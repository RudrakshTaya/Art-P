const Product = require('../Models/product.Models');
const Order = require('../Models/order.Models');
const { body, validationResult } = require('express-validator');
const { uploadOnCloudinary } = require('../utils/cloudinary');
const multer = require('multer');
const fs = require('fs');

// Multer configuration for file uploads
const upload = multer({ dest: 'public/ProductImages/' });

// Get all products for the logged-in admin
const getAllProductsForAdmin = async (req, res) => {
  try {
    const adminId = req.user.userId; // Assuming req.user contains the authenticated admin's ID
    const products = await Product.find({ adminId });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error while fetching products for admin' });
  }
};

// Get products by type for the logged-in admin
const getProductsByTypeForAdmin = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const products = await Product.find({ type: req.params.type, adminId });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error while fetching products by type for admin' });
  }
};

// Create a new product for the logged-in admin
const createProduct = [
  body('name').notEmpty().withMessage('Name is required'),
  body('type').notEmpty().withMessage('Type is required'),
  body('price').isNumeric().withMessage('Price must be a number'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Handle image upload to Cloudinary
      let imageUrl;
      if (req.files && req.files.length > 0) {
        const filePath = req.files[0].path; // Get the local file path

        // Check if the file exists at the given path
        if (!fs.existsSync(filePath)) {
          return res.status(400).json({ message: 'Uploaded file does not exist at the given path' });
        }

        const response = await uploadOnCloudinary(filePath);
        if (!response || !response.url) {
          console.error("Cloudinary upload response:", response);
          return res.status(400).json({ message: 'Image upload failed' });
        }
        imageUrl = response.url; // Get the image URL from Cloudinary response
      } else {
        return res.status(400).json({ message: 'Image upload is required' });
      }

      const newProduct = new Product({
        ...req.body,
        imageLink: imageUrl,
        adminId: req.user.userId,
      });

      const savedProduct = await newProduct.save();
      res.status(201).json({
        message: 'Product created successfully',
        product: savedProduct,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Internal server error while creating product' });
    }
  },
];

// Update an existing product (only if the product belongs to the logged-in admin)
const updateProduct = [
  body('name').optional().notEmpty().withMessage('Name must not be empty if provided'),
  body('type').optional().notEmpty().withMessage('Type must not be empty if provided'),
  body('price').optional().isNumeric().withMessage('Price must be a number if provided'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Handle image upload to Cloudinary
      let imageUrl;
      if (req.files && req.files.length > 0) {
        const filePath = req.files[0].path; // Get the local file path
        const response = await uploadOnCloudinary(filePath);
        if (response && response.url) {
          imageUrl = response.url; // Get the image URL from Cloudinary response
        }
      }

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: req.params.id, adminId: req.user.userId }, // Ensure only the product's admin can update
        { ...req.body, ...(imageUrl && { imageLink: imageUrl }) }, // Update image link if a new image is uploaded
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({
        message: 'Product updated successfully',
        product: updatedProduct,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Internal server error while updating product' });
    }
  },
];

// Delete a product (only if the product belongs to the logged-in admin)
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id, adminId: req.user.userId });
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error while deleting product' });
  }
};

// Function to get recent orders for a specific admin
const getRecentOrders = async (req, res) => {
  try {
    const adminId = req.user.userId; // Get the admin's ID from the authenticated user
    const orders = await Order.find({
      'products.adminId': adminId, // Filter orders that contain products from this admin
    })
      .sort({ createdAt: -1 }) // Sort by creation date descending
      .limit(10) // Limit to the 10 most recent orders
      .populate('products.productId'); // Populate product details if necessary

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching recent orders for admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to get total earnings for a specific admin
const getTotalEarnings = async (req, res) => {
  try {
    const adminId = req.user.userId; // Get the admin's ID from the authenticated user
    console.log('Admin ID:', adminId); // Log the adminId
   
    const totalEarnings = await Order.aggregate([
      {
        $unwind: '$products', // Deconstruct the products array
      },
      {
        $match: {
          'products.adminId': adminId, // Only include orders with products from this admin
        },
      },
      {
        $group: {
          _id: null, // Group all documents
          totalEarnings: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }, // Sum total earnings based on price and quantity
        },
      },
    ]);
    
    console.log('Total Earnings Calculation:', totalEarnings); // Log the result for debugging
    
    res.status(200).json({ totalEarnings: totalEarnings[0] ? totalEarnings[0].totalEarnings : 0 });
  } catch (error) {
    console.error('Error fetching total earnings for admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Exporting all functions
module.exports = {
  getProductsByTypeForAdmin,
  getAllProductsForAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getRecentOrders,
  getTotalEarnings,
};
