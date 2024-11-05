const express = require('express');
const authMiddleware = require('../Middleware/authMiddleware');
const router = express.Router();
const upload = require('../Middleware/multerMiddleware');
const {
    getAllProductsForUsers,
    getProductsByTypeForUsers,
    getProductById,
    placeOrder,
   
} = require('../Controllers/product.Controllers'); // Adjust the path if necessary

// User routes
router.get('/products', getAllProductsForUsers);
router.get('/products/type/:type', getProductsByTypeForUsers);
router.get('/products/:id', getProductById);
router.post('/placeorder', placeOrder); 




module.exports = router;
