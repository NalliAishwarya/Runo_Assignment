
const express = require('express');
const { getAllUsers, getAllSlots } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const router = express.Router();

// Route for getting all registered users (with filters)
router.get('/users', auth, getAllUsers);

// Route for getting all slots (with optional filters)
router.get('/slots', auth, getAllSlots);

module.exports = router;


