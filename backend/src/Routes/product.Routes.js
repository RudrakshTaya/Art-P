const express = require('express');
const router = express.Router();
const productController = require('../Controllers/product.Controllers');

// Get product by ID
router.get('/product/:productId', productController.getProductById);

// Get all products
router.get('/products', productController.getAllProducts);

module.exports = router;
