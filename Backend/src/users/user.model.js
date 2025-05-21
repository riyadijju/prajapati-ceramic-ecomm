const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  profileImage: String,
  bio: { type: String, maxlength: 200 },
  profession: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🔐 Automatically hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

// 🔑 Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  const match = await bcrypt.compare(candidatePassword, this.password);
  console.log("Candidate:", candidatePassword);
  console.log("Stored (hashed):", this.password);
  console.log("Match:", match);
  return match;
};

module.exports = model('User', userSchema);

