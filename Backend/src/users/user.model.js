// const {Schema, model} = require('mongoose');
// const bcrypt = require('bcrypt');

// const userShecma = new Schema({
//     username: {type: String, require: true, unique: true},
//     email: {type: String, require: true, unique: true},
//     password: {type: String, require: true},
//     confirm: {type: String, require: true},
//     role: {
//         type: String, default: 'user'
//     },
//     profileImage: String,
//     bio: {type: String, maxlength: 200},
//     profession: String,
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// // hashing passwords
// userShecma.pre('save', async function(next){
//     const user =  this;
//     if(!user.isModified('password')) return next();
//     const hashedPassword = await bcrypt.hash(user.password, 10);
//     user.password = hashedPassword;
//     next();
// })

// // match passwords
// userShecma.methods.comparePassword = function (cadidatePassword) {
//     return bcrypt.compare(cadidatePassword, this.password)
// }

// const User = new model('User', userShecma);
// module.exports = User;


// const { Schema, model } = require('mongoose');
// const bcrypt = require('bcrypt');

// const userSchema = new Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   verified: { type: Boolean, default: false },
//   role: { type: String, default: 'user' },
//   profileImage: String,
//   bio: { type: String, maxlength: 200 },
//   profession: String,
//   createdAt: { type: Date, default: Date.now }
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Check password
// userSchema.methods.comparePassword = function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// const User = model('User', userSchema);
// module.exports = User;

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
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = model('User', userSchema);

