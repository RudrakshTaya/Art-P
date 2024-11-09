const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['Type-1', 'Type-2', 'Type-3'], 
  },
  attributes: {
    type: mongoose.Schema.Types.Mixed,
  },
  brand: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  // sku: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  images: [
    {
      url: { type: String, required: true },
      altText: { type: String, default: '' },
    },
  ],
  // type: {
  //   type: String,
  //   enum: ['Type-1', 'Type-2', 'Type-3'], 
  //   required: true,
  // },
  // attributes: {
  //   type: mongoose.Schema.Types.Mixed,
  // },
  ratings: {
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  discount: {
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    expiresAt: { type: Date },
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the `updatedAt` field automatically on each save
productSchema.pre('save', function(next) {
  console.log('Product data before save:', this);
  this.updatedAt = Date.now();
  next();
});

// Create a product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
