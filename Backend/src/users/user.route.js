const express = require("express");
const User = require("./user.model");
const router = express.Router();

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username, password });
    await user.save();
    res.status(201).send({ message: "User registered successfully!" });
    
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).send({ message: "Error registering user" });
  }
});

// / login user endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  
  const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Password not match" });
    }

})

module.exports = router;
