const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Product Information
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
  
  // Price and Category
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Original Handmade Art and Decor', 
      'Personalized Clothing and Accessories', 
      'DIY Kits and Craft Materials', 
      'Customized Home and Gift Items', 
      'Sustainable and Upcycled Crafts', 
      'Limited Edition Collaborative Products'
    ],
  },
  
  // Attributes (for flexible product-specific details)
  attributes: {
    type: mongoose.Schema.Types.Mixed,
  },

  // Specific Fields for Customization or Personalization
  isCustomizable: {
    type: Boolean,
    default: false,
  },
  customizationOptions: {
    type: [String], // List of options like color, size, text input for engravings, etc.
    default: [],
  },

  // Brand and Inventory Information
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

  // Images
  images: [
    {
      url: { type: String, required: true },
      altText: { type: String, default: '' },
    },
  ],
  
  // Ratings
  ratings: {
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  
  // Discount
  discount: {
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    expiresAt: { type: Date },
  },

  // Admin ID
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware: Automatically update `updatedAt` on each save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
