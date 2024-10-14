const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // Ensure quantity is at least 1
      },
    },
  ],
}, { timestamps: true }); // Optional: Add timestamps for createdAt and updatedAt

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
