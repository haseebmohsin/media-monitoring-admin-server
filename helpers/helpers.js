const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const generateJWTToken = (userId, secretKey) => {
  return jwt.sign({ _id: userId }, secretKey);
};

const decodeJWTToken = (access_token) => {
  return jwt.decode(access_token);
};

const verifyJWTToken = (token, secretKey) => {
  return jwt.verify(token, secretKey, (error, decoded) => {
    return error;
  });
};

const findUserById = async (userId) => {
  return await User.findById(userId);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  generateJWTToken,
  findUserById,
  findUserByEmail,
  hashPassword,
  comparePasswords,
  decodeJWTToken,
  verifyJWTToken,
};
