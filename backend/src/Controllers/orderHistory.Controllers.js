// controllers/orderController.js
const Order = require('../Models/order.Models'); // Import the Order model

// Get order history for a user
const getUserOrderHistory = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available from middleware
        const orders = await Order.find({ userId })
            .populate('products.productId', 'name price') // Populate product details
            .populate('products.adminId', 'name'); // Populate admin details

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }

        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch order history.', error });
    }
};

module.exports = { getUserOrderHistory };
