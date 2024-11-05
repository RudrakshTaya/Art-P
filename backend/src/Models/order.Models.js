const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Reference to the Product model
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1, // Minimum quantity is 1
            },
            price: {
                type: Number,
                required: true,
            },
            adminId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Admin', // Reference to the Admin model
                required: true, // Ensure adminId is required to link to the admin
            },
        },
    ],
    total: {
        type: Number,
        required: true,
        min: 0, // Ensure total is non-negative
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], // Order status options
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now, // Set created date to now
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Set updated date to now
    },
});

// Update the updatedAt field on save
orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
