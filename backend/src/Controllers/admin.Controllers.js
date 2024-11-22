const Product = require('../Models/product.Models');
const Order = require('../Models/order.Models');
const { body, validationResult } = require('express-validator');
const { uploadOnCloudinary } = require('../utils/cloudinary');
const multer = require('multer');
const fs = require('fs');
const { log } = require('console');

// Multer configuration for temporary storage of images before Cloudinary upload
const upload = multer({ dest: 'public/ProductImages/' });

// Get all products for the logged-in admin
const getAllProductsForAdmin = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const products = await Product.find({ adminId });
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products for admin:", err);
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
    console.error("Error fetching products by type for admin:", error);
    res.status(500).json({ message: 'Internal server error while fetching products by type for admin' });
  }
};

// Create a new product for the logged-in admin
const createProduct = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        // Upload images to Cloudinary
        for (const file of req.files) {
          const response = await uploadOnCloudinary(file.path);
          if (response && response.url) {
            imageUrls.push({ url: response.url, altText: req.body.name });
          }
        }
      } else {
        return res.status(400).json({ message: 'At least one image is required' });
      }
      // Create a new product document
      const newProduct = new Product({
        ...req.body,
      discount: {
    percentage: req.body.discount, // or whatever you are calling it
    expiresAt: req.body.discountExpiresAt, // and the expiration date
  },
        attributes:req.body.subcategory,
        images: imageUrls,
        adminId: req.user.userId, // The logged-in admin's ID
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
  body('price').optional().isNumeric().withMessage('Price must be a number if provided'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        // Upload images to Cloudinary
        for (const file of req.files) {
          const response = await uploadOnCloudinary(file.path);
          if (response && response.url) {
            imageUrls.push({ url: response.url, altText: req.body.name });
          }
          fs.unlinkSync(file.path); // Clean up local file after upload
        }
      }

      const updateFields = {
        ...req.body,
        ...(imageUrls.length > 0 && { images: imageUrls }), // Only update images if new ones are provided
      };

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: req.params.id, adminId: req.user.userId },
        updateFields,
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found or access denied' });
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
      return res.status(404).json({ message: 'Product not found or access denied' });
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
    const adminId = req.user.userId;
    const orders = await Order.find({
      'products.adminId': adminId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('products.productId');

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching recent orders for admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to get total earnings for a specific admin
const getTotalEarnings = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const totalEarnings = await Order.aggregate([
      { $unwind: '$products' },
      { $match: { 'products.adminId': adminId } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: { $multiply: ['$products.price', '$products.quantity'] } },
        },
      },
    ]);

    res.status(200).json({ totalEarnings: totalEarnings[0]?.totalEarnings || 0 });
  } catch (error) {
    console.error('Error fetching total earnings for admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update the status of an order (only if it includes products managed by the logged-in admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const adminId = req.user.userId; // Authenticated admin ID
    const orderId = req.params.id;

    // Find the order containing products managed by the current admin
    const order = await Order.findOne({
      _id: orderId,
      'products.adminId': adminId,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or access denied' });
    }

    // Update the order status
    order.orderStatus = status;

    // If the order is being cancelled, update stock for each product in the order
    if (status === 'Cancelled') {
      for (const item of order.products) {
        const product = await Product.findById(item.productId);
        if (product && product.adminId.toString() === adminId) {
          product.stock += item.quantity; // Restore stock
          await product.save(); // Save each product update
        }
      }
    }

    await order.save(); // Save the order with updated status

    res.status(200).json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error while updating order status' });
  }
};

module.exports = {
  getProductsByTypeForAdmin,
  getAllProductsForAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getRecentOrders,
  getTotalEarnings,
  updateOrderStatus,
};
