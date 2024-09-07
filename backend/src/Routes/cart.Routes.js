const express = require('express');
const router = express.Router();
const cartController = require('../Controllers/cart.Controllers');

// Add to cart
router.post('/addcart', cartController.addToCart);

// Get user's cart
router.get('/cart/:userId', cartController.getCart);

// Buy now
router.post('/buy', cartController.buyNow);

router.post('/removecart', cartController.removeFromCart);

// Route to update the quantity of an item in the cart
router.post('/updatecart', cartController.updateQuantity);

module.exports = router;
