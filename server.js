
//updated

const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config(); // Load environment variables
const cors = require('cors'); // Import CORS middleware

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse incoming JSON data

// Define routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/slots', require('./routes/slotRoutes')); // Slot routes for booking and updating
app.use('/api/admin', require('./routes/adminRoutes')); // Admin routes for managing users and slots

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Set the server port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
