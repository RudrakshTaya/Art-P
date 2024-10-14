const express = require('express');
const cors = require('cors');
const connectDB = require('./src/database/db'); // Assuming you have this for DB connection

// Importing routes
const authRoutes = require('./src/Routes/auth.Routes');
const cartRoutes = require('./src/Routes/cart.Routes');
const productRoutes = require('./src/Routes/product.Routes');
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
     // Card-related routes
app.use('/api', authRoutes);        // Authentication routes (signup/signin)
app.use('/api', cartRoutes);        // Cart-related routes
app.use('/api', productRoutes);

// Export the app module
module.exports = app;
