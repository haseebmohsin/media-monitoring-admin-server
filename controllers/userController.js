const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const {
  hashPassword,
  findUserByEmail,
  generateJWTToken,
  comparePasswords,
  verifyJWTToken,
  decodeJWTToken,
  findUserById,
} = require("../helpers/helpers");

const secretKey = process.env.JWT_SECRET || "defaultSecretKey";

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Public
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  // Remove password from each user object
  const usersWithoutPasswords = users.map(user => {
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  });

  res.status(200).json(usersWithoutPasswords);
});


/**
 * @desc    Get a user by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
const getUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const user = findUserById(id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

/**
 * @desc    Post a user to database
 * @route   POST /api/auth/sign-up
 * @access  Public
 */
const signUp = asyncHandler(async (req, res) => {
  const { displayName, password, email } = req.body;

  // Check if email already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    res.status(400);
    throw new Error("The email address is already in use");
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create a new user
  const newUser = new User({
    displayName,
    password: hashedPassword,
    email,
  });

  // save user in database
  await newUser.save();

  // Find the user by email
  const user = await findUserByEmail(newUser.email);

  // Create user response object
  const userResponse = createUserResponse(user, secretKey);
  res.status(200).json(userResponse);
});

/**
 * @desc    Login user
 * @route   POST /api/auth/sign-in
 * @access  Public
 */
const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body.data;

  // Find user by email
  const user = await findUserByEmail(email);

  // Check if the user exists
  if (!user) {
    res.status(400);
    throw new Error("Check your email address");
  }

  // Compare the provided password with the hashed password in the database
  const passwordMatch = await comparePasswords(password, user.password);

  if (!passwordMatch) {
    res.status(400);
    throw new Error("Check your password");
  }

  // Create user response object
  const userResponse = createUserResponse(user, secretKey);
  res.status(200).json(userResponse);
});

/**
 * @desc    sign in with token
 * @route   POST /api/auth/sign-in-with-token
 * @access  Public
 */
const signInWithToken = asyncHandler(async (req, res) => {
  const { access_token } = req.body.data;

  // Verify the JWT token
  if (!verifyJWTToken(access_token)) {
    res.status(400);
    throw new Error("Invalid access token detected");
  }

  // Decode the token to get the user ID
  const { _id } = decodeJWTToken(access_token);

  // Find the user by ID
  const user = await findUserById(_id);

  // Check if the user exists
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Create user response object
  const userResponse = createUserResponse(user, secretKey);
  res.status(200).json(userResponse);
});

/**
 * @desc    create user response
 * @access  Private
 */
const createUserResponse = (user, secretKey) => {
  // Remove password from the user object
  const userObject = user.toObject();
  delete userObject.password;

  // Generate JWT token
  const token = generateJWTToken(user._id, secretKey);

  return {
    user: {
      _id: userObject._id,
      role: userObject.role,
      data: {
        displayName: userObject.displayName,
        email: userObject.email,
        photo: userObject.photo,
      },
    },
    access_token: token,
  };
};

module.exports = {
  getUsers,
  getUserById,
  signUp,
  signIn,
  signInWithToken,
};
