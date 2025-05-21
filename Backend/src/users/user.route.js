const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../users/user.model");
const generateToken = require("../middleware/generateToken");
const { sendWelcomeEmail } = require("../utils/emailService");


const router = express.Router();

// ✅ REGISTER — store user and send welcome email
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirm } = req.body;

    if (!username || !email || !password || !confirm) {
      return res.status(400).json({ message: "All fields required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
      return res.status(400).json({ message: "Invalid username" });
    }

    if (password !== confirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Weak password" });
    }

    const emailExists = await User.findOne({ email: cleanEmail });
    const usernameExists = await User.findOne({ username: cleanUsername });

    if (emailExists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    if (usernameExists) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });

    // 🎉 Send welcome email
    await sendWelcomeEmail(cleanEmail, cleanUsername);

    return res.status(201).json({
      message: "Registration successful",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage,
        bio: newUser.bio,
        profession: newUser.profession,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ LOGIN — no verification check
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    });

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        profession: user.profession
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});



// ✅ DELETE USER
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

// ✅ GET ALL USERS
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "id email role").sort({ createdAt: -1 });
    res.status(200).send(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).send({ message: "Error fetching users" });
  }
});

// ✅ UPDATE ROLE
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

// ✅ UPDATE PROFILE
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
