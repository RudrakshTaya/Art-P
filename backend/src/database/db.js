const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    console.error(err.stack); // Add stack trace for debugging
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;
