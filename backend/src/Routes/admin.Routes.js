const express = require('express');
const authMiddleware = require('../Middleware/authMiddleware');
const router = express.Router();
const upload = require('../Middleware/multerMiddleware');
const {
    getAllProductsForAdmin,
    getProductsByTypeForAdmin,
    createProduct,
    updateProduct,
    deleteProduct,
    getRecentOrders,
    getTotalEarnings,
   
} = require('../Controllers/admin.Controllers'); 


// Admin routes
router.get('/admin/products', authMiddleware, getAllProductsForAdmin);
router.get('/admin/products/type/:type', authMiddleware, getProductsByTypeForAdmin);

// Using upload.array for multiple image uploads
router.post('/admin/products', authMiddleware, upload.array('imageLink'), createProduct);
router.put('/admin/products/:id', authMiddleware, upload.array('imageLink'), updateProduct);
router.delete('/admin/products/:id', authMiddleware, deleteProduct);

// Route to get recent orders
router.get('/admin/orders',authMiddleware , getRecentOrders);

// Route to get total earnings
router.get('/admin/earnings',authMiddleware, getTotalEarnings);



module.exports = router;
