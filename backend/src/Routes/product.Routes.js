const express = require('express');
const router = express.Router();
const { getProductsByType,getProductsById, getAllProducts } = require('../Controllers/product.Controllers');
//all products
router.get('/products', getAllProducts);
// Route for fetching products by type
router.get('/products/type/:type', getProductsByType);
//By id
router.get('/products/:id', getProductsById);


module.exports = router;
