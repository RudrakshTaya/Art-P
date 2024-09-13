const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  imageLink: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Type-1', 'Type-2', 'Type-3'], // Add more types as needed
    required: true,
  },
  attributes: {
    type: mongoose.Schema.Types.Mixed, // Dynamic attributes depending on the product type
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
