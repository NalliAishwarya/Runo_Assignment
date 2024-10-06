
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Register a new user
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, phoneNumber, age, pincode, aadharNumber, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ phoneNumber });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Default role to 'user'
    user = new User({
      name,
      phoneNumber,
      age,
      pincode,
      aadharNumber,
      password,
      role: 'user', // Only users can register through the API
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Check if JWT_SECRET is defined, otherwise send an error response
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: 'JWT_SECRET not defined' });
    }

    // Create the token
    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token and user data as a response
    res.json({ token });
  } catch (err) {
    console.error('Error in registerUser:', err.message);
    res.status(500).send('Server Error');
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    let user = await User.findOne({ phoneNumber });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: 'JWT_SECRET not defined' });
    }

    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error('Error in loginUser:', err.message);
    res.status(500).send('Server Error');
  }
};

