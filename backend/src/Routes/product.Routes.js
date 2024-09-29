const express = require('express');
const router = express.Router();
const {
    getProductsByType,
    getProductsById,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../Controllers/product.Controllers'); // Adjust the path if necessary

// Get all products
router.get('/products', getAllProducts);

// Route for fetching products by type
router.get('/products/type/:type', getProductsByType);

// Get a product by ID
router.get('/products/:id', getProductsById);

// Create a new product
router.post('/products', createProduct);

// Update a product by ID
router.put('/products/:id', updateProduct);

// Delete a product by ID
router.delete('/products/:id', deleteProduct);

module.exports = router;
