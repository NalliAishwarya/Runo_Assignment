
const Slot = require('../models/Slot');
const User = require('../models/User');

// Book a vaccine slot
exports.bookSlot = async (req, res) => {
  const { userId, slotId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const slot = await Slot.findById(slotId);
    if (!slot || slot.availableDoses === 0) return res.status(400).json({ msg: 'Slot not available' });

    // Ensure consistent time zone handling for slotTime
    const slotTime = new Date(slot.slotTime.toISOString());
    if (slotTime < new Date('2024-11-01') || slotTime > new Date('2024-11-30')) {
      return res.status(400).json({ msg: 'Slot is outside the allowed vaccination period' });
    }

    // Handle first dose booking
    if (user.vaccinationStatus === 'none') {
      user.firstDoseDate = slot.slotTime; // Booking first dose
      user.vaccinationStatus = 'first_dose';
    }
    // Handle second dose booking
    else if (user.vaccinationStatus === 'first_dose') {
      if (new Date(slot.slotTime) <= new Date(user.firstDoseDate)) {
        return res.status(400).json({ msg: 'Second dose must be booked after the first dose date' });
      }
      user.secondDoseDate = slot.slotTime; // Booking second dose
      user.vaccinationStatus = 'completed';
    } else {
      return res.status(400).json({ msg: 'Invalid booking status' });
    }

    // Decrement the available doses and add user to slot
    // Add a condition to avoid double booking
    if (slot.users.includes(userId)) {
      return res.status(400).json({ msg: 'User has already booked this slot' });
    }

    slot.availableDoses -= 1;
    slot.users.push(userId);

    await user.save();
    await slot.save();

    res.json({ msg: 'Slot booked successfully', slot });
  } catch (err) {
    console.error(`Error in booking slot for userId ${userId} and slotId ${slotId}: `, err.message);
    res.status(500).send('Server Error');
  }
};

// Update a booked slot
exports.updateSlot = async (req, res) => {
  const { userId, oldSlotId, newSlotId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const oldSlot = await Slot.findById(oldSlotId);
    const newSlot = await Slot.findById(newSlotId);

    if (!oldSlot || !newSlot) return res.status(404).json({ msg: 'Slot not found' });

    // Check if the old slot is within 24 hours
    const now = new Date();
    const oldSlotTime = new Date(oldSlot.slotTime.toISOString());
    if (oldSlotTime - now < 24 * 60 * 60 * 1000) {
      return res.status(400).json({ msg: 'Cannot update the slot within 24 hours' });
    }

    // Check if the new slot has available doses
    if (newSlot.availableDoses <= 0) {
      return res.status(400).json({ msg: 'New slot not available' });
    }

    // Ensure the new slot time is at least 24 hours in the future
    const newSlotTime = new Date(newSlot.slotTime.toISOString());
    if (newSlotTime - now < 24 * 60 * 60 * 1000) {
      return res.status(400).json({ msg: 'New slot must be at least 24 hours in the future' });
    }

    // Update the user's slot information
    if (user.vaccinationStatus === 'first_dose' && user.firstDoseDate.toString() === oldSlot.slotTime.toString()) {
      user.firstDoseDate = newSlot.slotTime;
    } else if (user.vaccinationStatus === 'completed' && user.secondDoseDate.toString() === oldSlot.slotTime.toString()) {
      user.secondDoseDate = newSlot.slotTime;
    } else {
      return res.status(400).json({ msg: 'User does not have this slot booked' });
    }

    // Update slots
    oldSlot.availableDoses += 1; // Increment the available doses for the old slot
    newSlot.availableDoses -= 1; // Decrement the available doses for the new slot
    newSlot.users.push(userId); // Add user to the new slot

    await user.save();
    await oldSlot.save();
    await newSlot.save();

    res.json({ msg: 'Slot updated successfully', newSlot });
  } catch (err) {
    console.error(`Error updating slot for userId ${userId}:`, err.message);
    res.status(500).send('Server Error');
  }
};

// Get available slots for a specific date
exports.getAvailableSlots = async (req, res) => {
  const { date } = req.query; // Expecting a date in the query string

  try {
    // Parse the date to start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Validate the date
    if (isNaN(startOfDay.getTime()) || isNaN(endOfDay.getTime())) {
      return res.status(400).json({ msg: 'Invalid date format' });
    }

    // Find slots within that date
    const availableSlots = await Slot.find({
      slotTime: { $gte: startOfDay, $lte: endOfDay },
      availableDoses: { $gt: 0 }, // Only slots with available doses
    });

    res.json(availableSlots);
  } catch (err) {
    console.error(`Error fetching available slots for date ${date}:`, err.message);
    res.status(500).send('Server Error');
  }
};

