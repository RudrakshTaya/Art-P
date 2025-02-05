const express = require('express');
const authMiddleware = require('../Middleware/authMiddleware');
const { placeOrder, getAllProductsForUsers, getProductsByTypeForUsers, getProductById } = require('../Controllers/product.Controllers');

const router = express.Router();

// Product routes
router.get('/products', getAllProductsForUsers);
router.get('/products/type/:type', getProductsByTypeForUsers);
router.get('/products/:id', getProductById);

// Place order route
router.post('/placeorder', authMiddleware, placeOrder);

module.exports = router;
