const express = require('express');
const router = express.Router();
const { getProductsByType } = require('../Controllers/product.Controllers');

// Route for fetching products by type
router.get('/products/:type', getProductsByType);

module.exports = router;
