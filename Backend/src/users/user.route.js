const express = require("express");
const User = require("./user.model");
const generateToken = require("../middleware/generateToken");
// const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const { sendWelcomeEmail } = require("../utils/emailService"); 

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirm } = req.body;

    // 1. Check for empty fields
    if (!username?.trim() || !email?.trim() || !password || !confirm) {
      return res.status(400).json({
        success: false,
        status: 400,
        title: "Missing Required Fields",
        description: "Please complete all required fields before submitting the form.",
        code: "EMPTY_FIELDS"
      });
    }

    // 2. Sanitize input
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    // 3. Validate email format (strict)
    const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        status: 400,
        title: "Invalid Email Format",
        description: "Please enter a valid email like user@example.com (no invalid characters like !, #, etc).",
        code: "INVALID_EMAIL"
      });
    }

    // 4. Restrict to allowed domains only
    const allowedDomains = ["gmail.com"];
    const emailDomain = cleanEmail.split("@")[1]?.toLowerCase();
    if (!emailDomain || !allowedDomains.includes(emailDomain)) {
      return res.status(400).json({
        success: false,
        status: 400,
        title: "Unsupported Email Domain",
        description: `Only the following email domains are allowed: ${allowedDomains.join(", ")}`,
        code: "EMAIL_DOMAIN_RESTRICTED"
      });
    }

    // 5. Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        status: 400,
        title: "Invalid Username",
        description: "Username must be 3–20 characters and can only include letters, numbers, or underscores.",
        code: "INVALID_USERNAME"
      });
    }

    // 6. Password match check
    if (password !== confirm) {
      return res.status(400).json({
        success: false,
        status: 400,
        title: "Password Mismatch",
        description: "The passwords you entered do not match.",
        code: "PASSWORD_MISMATCH"
      });
    }

    // 7. Password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        status: 400,
        title: "Weak Password",
        description: "Password must be 8+ characters and include uppercase, lowercase, number, and special character.",
        code: "WEAK_PASSWORD"
      });
    }

    // 8. Check for existing email
    const existingEmailUser = await User.findOne({ email: cleanEmail });
    if (existingEmailUser) {
      return res.status(409).json({
        success: false,
        status: 409,
        title: "Email Already Registered",
        description: "This email is already linked to another account.",
        code: "EMAIL_EXISTS"
      });
    }

    // 9. Check for existing username
    const existingUsernameUser = await User.findOne({ username: cleanUsername });
    if (existingUsernameUser) {
      return res.status(409).json({
        success: false,
        status: 409,
        title: "Username Taken",
        description: "This username is already taken. Please choose a different one.",
        code: "USERNAME_EXISTS"
      });
    }

    // 10. Create user
    const user = new User({ email: cleanEmail, username: cleanUsername, password });
    await user.save();

    // 11. Send welcome email
    try {
      await sendWelcomeEmail(cleanEmail, cleanUsername);
    } catch (err) {
      console.warn("Email send failed (non-blocking):", err.message);
    }

    // 12. Success
    return res.status(201).json({
      success: true,
      status: 201,
      title: "Registration Successful",
      description: "Your account has been created. Please check your email.",
    });

  } catch (error) {
    console.error("Unexpected error during registration:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      title: "Server Error",
      description: "An unexpected error occurred. Please try again later.",
      error: error.message
    });
  }
});




// / login user endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Password not match" });
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
    console.error("Error logged in user", error);
    res.status(500).send({ message: "Error logged in user" });
  }


})

// logout endpoint
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logged out successfully" });
});

// delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).send({ message: "Error deleting user" });
  }
});

// get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "id email role").sort({ createdAt: -1 });
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).send({ message: "Error fetching user" });
  }
});

// update user role
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User role updated successfully", user });
  } catch (error) {
    console.error("Error updating user role", error);
    res.status(500).send({ message: "Error updating user role" });
  }
});

// edit or update profile
router.patch("/edit-profile", async (req, res) => {
  try {
    const { userId, username, profileImage, bio, profession } = req.body;
    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }
    const user = await User.findById(userId);
    console.log(user)

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    // update profile
    if (username !== undefined) user.username = username;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (bio !== undefined) user.bio = bio;
    if (profession !== undefined) user.profession = profession;

    await user.save();
    res.status(200).send({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        profession: user.profession,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating user profile", error);
    res.status(500).send({ message: "Error updating user profile" });
  }
});

module.exports = router;
