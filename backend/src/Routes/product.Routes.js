const express = require('express');
const authMiddleware=require('../Middleware/authMiddleware');
const router = express.Router();
const upload=require('../Middleware/multerMiddleware');
const {
    getAllProductsForUsers,
    getProductsByTypeForUsers,
    getProductById,
    getAllProductsForAdmin,
    getProductsByTypeForAdmin,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../Controllers/product.Controllers'); // Adjust the path if necessary

// User routes
router.get('/products', getAllProductsForUsers);
router.get('/products/type/:type', getProductsByTypeForUsers);
router.get('/products/:id', getProductById);

// Admin routes
router.get('/admin/products',authMiddleware, getAllProductsForAdmin);
router.get('/admin/products/type/:type',authMiddleware, getProductsByTypeForAdmin);
router.post('/admin/products',authMiddleware, upload.single('imageLink'),createProduct);
router.put('/admin/products/:id',authMiddleware,upload.single('imageLink'), updateProduct);
router.delete('/admin/products/:id',authMiddleware, deleteProduct);

module.exports = router;
