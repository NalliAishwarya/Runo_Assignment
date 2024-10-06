
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust the path according to your project structure

// Connect to the database
mongoose.connect('mongodb+srv://aishwaryanalli2010:aishu81@cluster1.zqj3h.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createAdmin = async () => {
  const admin = new User({
    name: 'Admin User',
    phoneNumber: '1234567890', // Replace with a valid phone number
    password: 'adminpassword', // Choose a strong password
    age: 30, // Replace with the admin's age
    pincode: '123456', // Replace with a valid pincode
    aadharNumber: '659456789013', // Use a valid Aadhar number (12 digits)
    vaccinationStatus: 'none',
    role: 'admin', // Set role as admin
  });

  try {
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);

    await admin.save();
    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close(); // Close the connection
  }
};

createAdmin();



