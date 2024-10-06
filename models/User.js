
//updated
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v); // Regex for a 10-digit phone number
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  pincode: { 
    type: String, 
    required: true, 
    validate: {
      validator: function(v) {
        return /^[0-9]{6}$/.test(v); // Regex for a 6-digit pincode
      },
      message: props => `${props.value} is not a valid pincode!`
    }
  },
  aadharNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    validate: {
      validator: function(v) {
        return /^[0-9]{12}$/.test(v); // Regex for a 12-digit Aadhar number
      },
      message: props => `${props.value} is not a valid Aadhar number!`
    }
  },
  vaccinationStatus: {
    type: String,
    enum: ['none', 'first_dose', 'completed'],
    default: 'none',
    index: true // Indexing for faster filtering based on vaccination status
  },
  firstDoseDate: { type: Date, default: null }, // Optional, default to null
  secondDoseDate: { type: Date, default: null }, // Optional, default to null
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
});

// Method to update vaccination status and ensure proper transitions
UserSchema.methods.updateVaccinationStatus = function(status, doseDate) {
  if (status === 'first_dose' && this.vaccinationStatus === 'none') {
    this.vaccinationStatus = 'first_dose';
    this.firstDoseDate = doseDate;
  } else if (status === 'completed' && this.vaccinationStatus === 'first_dose') {
    this.vaccinationStatus = 'completed';
    this.secondDoseDate = doseDate;
  } else {
    throw new Error('Invalid vaccination status update.');
  }
};

// Export the User model
module.exports = mongoose.model('User', UserSchema);
