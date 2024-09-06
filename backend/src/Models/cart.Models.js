// models/cart.Models.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
