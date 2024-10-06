const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// Route for user registration
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('phoneNumber', 'Please provide a valid phone number').isLength({
      min: 10,
      max: 10,
    }),
    check('password', 'Password should be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  registerUser
);

// Route for user login
router.post(
  '/login',
  [
    check('phoneNumber', 'Please provide a valid phone number').isLength({
      min: 10,
      max: 10,
    }),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

module.exports = router;
