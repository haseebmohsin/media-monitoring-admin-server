const express = require('express');
const router = express.Router();
const { getUsers, getUserById, signIn, signUp, signInWithToken } = require('../controllers/userController');

// GET /api/users
router.get('/', getUsers);
// GET /api/users/:id
router.get('/:id', getUserById);

router.post('/auth/sign-up', signUp);
router.post('/auth/sign-in', signIn);
router.post('/auth/sign-in-with-token', signInWithToken);

module.exports = router;
