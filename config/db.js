const mongoose = require('mongoose'); // Import mongoose for MongoDB object modeling

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, // Avoid deprecation warnings
      useUnifiedTopology: true, // Use the new topology engine
    });
    console.log('MongoDB connected successfully...'); // Log success message
  } catch (error) {
    console.error('MongoDB connection error:', error); // Log error on connection failure
    process.exit(1); // Exit the process with failure code
  }
};

module.exports = connectDB; // Export the function for use in other modules


