// routes/orderRoutes.js
const express = require('express');
const { getUserOrderHistory } = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to fetch order history for a user
router.get('/order-history', authMiddleware, getUserOrderHistory);

module.exports = router;
