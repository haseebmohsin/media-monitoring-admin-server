const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  displayName: String,
  password: String,
  email: { type: String, unique: true },
  role: {
    type: [String],
    default: ['user'],
    enum: ['admin', 'staff', 'user']
  },
  photo: {
    type: String,
    default: 'default-avatar.jpg'
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
