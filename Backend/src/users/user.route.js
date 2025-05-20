const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../users/user.model");
const PendingUser = require("../users/pendingUser.model");
const generateToken = require("../middleware/generateToken");
const { sendVerificationEmail } = require("../utils/emailService");

const router = express.Router();


// ✅ REGISTER — store user temporarily and send verification email
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirm } = req.body;
    if (!username || !email || !password || !confirm)
      return res.status(400).json({ code: "EMPTY_FIELDS", message: "All fields required" });

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();
    const domain = cleanEmail.split("@")[1];

    const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail))
      return res.status(400).json({ code: "INVALID_EMAIL", message: "Invalid email format" });

    const allowedDomains = ["gmail.com"];
    if (!allowedDomains.includes(domain))
      return res.status(400).json({ code: "EMAIL_DOMAIN_RESTRICTED", message: "Only gmail.com allowed" });

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(cleanUsername))
      return res.status(400).json({ code: "INVALID_USERNAME", message: "Invalid username" });

    if (password !== confirm)
      return res.status(400).json({ code: "PASSWORD_MISMATCH", message: "Passwords do not match" });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password))
      return res.status(400).json({ code: "WEAK_PASSWORD", message: "Weak password" });

    const existingEmailUser = await User.findOne({ email: cleanEmail });
    const existingPending = await PendingUser.findOne({ email: cleanEmail });
    if (existingEmailUser || existingPending)
      return res.status(409).json({ code: "EMAIL_EXISTS", message: "Email already registered" });

    const existingUsername = await User.findOne({ username: cleanUsername });
    if (existingUsername)
      return res.status(409).json({ code: "USERNAME_EXISTS", message: "Username already taken" });

    const token = jwt.sign({ email: cleanEmail }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const hashedPassword = await bcrypt.hash(password, 10);

    await PendingUser.create({ email: cleanEmail, username: cleanUsername, password: hashedPassword, token });
    await sendVerificationEmail(cleanEmail, cleanUsername, token);

    return res.status(200).json({ message: "Verification email sent. Please check your inbox." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ code: "SERVER_ERROR", message: "Something went wrong" });
  }
});

// ✅ VERIFY EMAIL — move from PendingUser to User and mark as verified
router.get("/verify-email/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const token = req.params.token;

    const pendingUser = await PendingUser.findOneAndDelete({ token });
    if (!pendingUser)
      return res.status(400).send("Invalid or expired verification link.");

    const newUser = new User({
      email: pendingUser.email,
      username: pendingUser.username,
      password: pendingUser.password,
      verified: true
    });

    await newUser.save();
    return res.redirect("http://localhost:5173/login?verified=true");
  } catch (err) {
    console.error("Verification failed:", err);
    return res.status(400).send("Verification link is invalid or has expired.");
  }
});

// ✅ LOGIN — block unverified users
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // ✅ BLOCK UNVERIFIED USERS
    if (!user.verified) {
      console.log(`Blocked login for unverified user: ${user.email}`);
      return res.status(403).send({ message: "Please verify your email before logging in." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).send({
      message: "Logged in successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        profession: user.profession,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Error logging in user" });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logged out successfully" });
});

// DELETE USER
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).send({ message: "User not found" });

    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).send({ message: "Error deleting user" });
  }
});

// GET ALL USERS
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "id email role").sort({ createdAt: -1 });
    res.status(200).send(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).send({ message: "Error fetching users" });
  }
});

// UPDATE ROLE
router.put("/users/:id", async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user)
      return res.status(404).send({ message: "User not found" });

    res.status(200).send({ message: "User role updated", user });
  } catch (error) {
    console.error("Role update error:", error);
    res.status(500).send({ message: "Error updating role" });
  }
});

// UPDATE PROFILE
router.patch("/edit-profile", async (req, res) => {
  try {
    const { userId, username, profileImage, bio, profession } = req.body;
    if (!userId)
      return res.status(400).send({ message: "User ID is required" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(400).send({ message: "User not found" });

    if (username !== undefined) user.username = username;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (bio !== undefined) user.bio = bio;
    if (profession !== undefined) user.profession = profession;

    await user.save();
    res.status(200).send({ message: "Profile updated", user });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).send({ message: "Error updating profile" });
  }
});

module.exports = router;
