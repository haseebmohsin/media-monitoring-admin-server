// services/usersService.js
const User = require('../entities/userModel');

const getUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

module.exports = {
  getUsers,
};
