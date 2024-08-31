const express = require('express');
const cors = require('cors');
const connectDB = require('./src/database/db');

const cardRoutes = require('./src/Routes/cards.Routes');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes for cards 
app.use('/cards', cardRoutes);
// Routes for signup/signin
const authRoutes = require('./src/Routes/auth.Routes');
app.use('/api', authRoutes);

module.exports = app;
