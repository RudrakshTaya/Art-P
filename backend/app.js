const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/database/db'); // Assuming you have this for DB connection
const cookieParser = require('cookie-parser');



// Importing routes
const authRoutes = require('./src/Routes/auth.Routes');
const cartRoutes = require('./src/Routes/cart.Routes');
const productRoutes = require('./src/Routes/product.Routes');
const adminRoutes=require('./src/Routes/admin.Routes')

// Initialize Express app
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(helmet()); // Add basic security headers
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser());


// Routes
app.use('/api/auth', authRoutes);        // Authentication routes (signup/signin)
app.use('/api/cart', cartRoutes);        // Cart-related routes
app.use('/api', productRoutes); // Product-related routes
app.use('/api/ad', adminRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Export the app module
module.exports = app;
