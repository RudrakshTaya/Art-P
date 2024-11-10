const Cart = require('../Models/cart.Models');
const { body, validationResult } = require('express-validator');

// Input validation middleware
const validateCartInput = [
    body('userId').notEmpty().withMessage('User ID is required.'),
    body('productId').notEmpty().withMessage('Product ID is required.'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1.'),
];

// Add item to cart or update existing item quantity
exports.addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (itemIndex > -1) {
                // Increment the existing quantity by the new quantity
                cart.items[itemIndex].quantity += quantity;
               
            } else {
                // Add new item if it does not exist
                cart.items.push({ productId, quantity });
               

            }
            await cart.save();
        } else {
            // Create new cart if none exists for the user
            cart = new Cart({ userId, items: [{ productId, quantity }] });
           
            await cart.save();
        }

        res.status(200).json({ message: 'Cart updated' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
};


// Fetch user's cart
exports.getCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const cart = await Cart.findOne({ userId });

        if (cart) {
            // Filter out the item to be removed
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            await cart.save();
            res.status(200).json({ message: 'Item removed successfully' });
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
};

// Update item quantity in cart
exports.updateQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const cart = await Cart.findOne({ userId });

        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity = quantity;
                await cart.save();
                res.status(200).json({ message: 'Quantity updated successfully' });
            } else {
                res.status(404).json({ message: 'Item not found in cart' });
            }
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ message: 'Error updating quantity', error: error.message });
    }
};

// Handle buy now action
exports.buyNow = async (req, res) => {
    const { userId } = req.body;

    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Implement your purchase logic here (check stock, deduct from inventory, etc.)

        // Clear the cart for the user after purchase
        await Cart.deleteOne({ userId });
        res.status(200).json({ message: 'Purchase successful' });
    } catch (error) {
        console.error('Error completing purchase:', error);
        res.status(500).json({ message: 'Error completing purchase', error: error.message });
    }
};
