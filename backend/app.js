const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/database/db'); // Assuming you have this for DB connection
const cookieParser = require('cookie-parser');

const userVerificationRoutes = require('./src/Routes/userVerification.Routes'); // Adjust the path as necessary

// Importing routes
const authRoutes = require('./src/Routes/auth.Routes');
const cartRoutes = require('./src/Routes/cart.Routes');
const productRoutes = require('./src/Routes/product.Routes');
const adminRoutes=require('./src/Routes/admin.Routes');
const accInfo =require('./src/Routes/accInfo.Routes');

// Initialize Express app
const app = express();

// Connect to the database
connectDB();

// Middleware
// Add CORS middleware with appropriate settings
app.use(cors({
  origin: 'https://craftaura.vercel.app', // Allow the frontend Ngrok URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow necessary HTTP methods
  credentials: true // If you need to send cookies or other credentials
}));


app.use(helmet()); // Add basic security headers
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser());


// Routes
app.use('/api/auth', authRoutes);        // Authentication routes (signup/signin)
app.use('/api/cart', cartRoutes);        // Cart-related routes
app.use('/api', productRoutes); // Product-related routes
app.use('/api/ad', adminRoutes);

app.use('/api/user', userVerificationRoutes);
app.use('/api/account',accInfo);



// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Export the app module
module.exports = app;
