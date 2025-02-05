const Order = require('../Models/order.Models');

// Controller to fetch order history
const getOrderHistory = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming `authMiddleware` adds user info to req
        

        // Fetch orders with related details
        const orders = await Order.find({ userId })
            .populate('products.productId', 'name price') // Populate product details
         //   .populate('products.adminId', 'name') // Populate admin details
            .sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No orders found for this user',
            });
        }
            
        res.status(200).json({
            success: true,
            message: 'Order history fetched successfully',
            orders,
        
        });
    } catch (error) {
        console.error('Error fetching order history:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message,
        });
    }
};

module.exports = { getOrderHistory };
