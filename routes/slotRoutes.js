
const express = require('express');
const { bookSlot, updateSlot, getAvailableSlots } = require('../controllers/slotController');
const auth = require('../middleware/auth');
const router = express.Router();

// Route for booking a vaccine slot
router.post('/book', auth, bookSlot);

// Route for updating a booked slot
router.put('/update', auth, updateSlot);

// Route for fetching available slots for a specific date
router.get('/available', auth, getAvailableSlots);

module.exports = router;


