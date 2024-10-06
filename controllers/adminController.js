
const User = require('../models/User'); 
const Slot = require('../models/Slot');

// Get all registered users with optional filters (age, pincode, vaccination status)
exports.getAllUsers = async (req, res) => {
  try {
    const { age, pincode, vaccinationStatus } = req.query;

    // Build a query object based on provided filters
    let query = {};
    if (age) query.age = age;
    if (pincode) query.pincode = pincode;
    
    // Handle specific vaccination statuses as required
    if (vaccinationStatus === 'none') {
      query.vaccinationStatus = 'none';
    } else if (vaccinationStatus === 'first_dose_completed') {
      query.vaccinationStatus = 'first_dose_completed';
    } else if (vaccinationStatus === 'all_completed') {
      query.vaccinationStatus = 'all_completed';
    }

    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Get all slots with optional filtering (dose type and date)
exports.getAllSlots = async (req, res) => {
  try {
    const { doseType, date } = req.query;
    let query = {};

    if (date) {
      // Parse the date to find slots within the given day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.slotTime = { $gte: startOfDay, $lte: endOfDay };
    }

    if (doseType) {
      if (doseType === 'first') {
        query['doseType'] = 'first';  // Assuming you have a field to indicate doseType
      } else if (doseType === 'second') {
        query['doseType'] = 'second';  // Filter slots for second doses
      }
    }

    const slots = await Slot.find(query).populate('users'); // Populating user details for each slot
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
