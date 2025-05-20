// 📁 backend/models/PendingUser.js
const { Schema, model } = require("mongoose");

const pendingUserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // auto delete after 1hr
});

const PendingUser = model("PendingUser", pendingUserSchema);
module.exports = PendingUser;


