

//updated

const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  slotTime: { type: Date, required: true, index: true }, // Indexing slotTime for faster queries
  availableDoses: { 
    type: Number, 
    default: 10, 
    min: [0, 'Available doses cannot be less than 0'] // Ensure doses are not negative
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Reference to User model
});

// Method to decrease available doses
SlotSchema.methods.decreaseDoses = function() {
  if (this.availableDoses > 0) {
    this.availableDoses -= 1;
  }
};

// Method to increase available doses (e.g., when a user cancels)
SlotSchema.methods.increaseDoses = function() {
  this.availableDoses += 1;
};

// Exporting the Slot model
module.exports = mongoose.model('Slot', SlotSchema);



