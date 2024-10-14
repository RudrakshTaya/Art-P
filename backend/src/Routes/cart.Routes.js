const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const cartController = require('../Controllers/cart.Controllers');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Input validation middleware
const addCartValidation = [
    body('userId').isMongoId().withMessage('Invalid user ID'),
    body('productId').isMongoId().withMessage('Invalid product ID'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

const removeCartValidation = [
    body('userId').isMongoId().withMessage('Invalid user ID'),
    body('productId').isMongoId().withMessage('Invalid product ID'),
];

const updateCartValidation = [
    body('userId').isMongoId().withMessage('Invalid user ID'),
    body('productId').isMongoId().withMessage('Invalid product ID'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

// Add to cart
router.post('/add', addCartValidation, handleValidationErrors, cartController.addToCart);

// Get user's cart
router.get('/:userId', param('userId').isMongoId().withMessage('Invalid user ID'), handleValidationErrors, cartController.getCart);

// Buy now
router.post('/buy', handleValidationErrors, cartController.buyNow);

// Remove from cart
router.delete('/remove', removeCartValidation, handleValidationErrors, cartController.removeFromCart);

// Update quantity of an item in the cart
router.put('/update', updateCartValidation, handleValidationErrors, cartController.updateQuantity);

module.exports = router;
