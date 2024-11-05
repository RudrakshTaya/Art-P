const Product = require('../Models/product.Models');
const Order = require('../Models/order.Models'); // Ensure you require the Order model
const { body, validationResult } = require('express-validator');
const { uploadOnCloudinary } = require('../utils/cloudinary');
const multer = require('multer');
const fs = require('fs');

// Multer configuration for file uploads
const upload = multer({ dest: 'public/ProductImages/' });

// Get all Products for regular users
const getAllProductsForUsers = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    res.status(200).json(products);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error while fetching products' });
  }
};

// Get all Products for the logged-in admin
const getAllProductsForAdmin = async (req, res) => {
  try {
    const adminId = req.user.userId; // Assuming req.user contains the authenticated admin's ID
    const products = await Product.find({ adminId });
    res.status(200).json(products);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error while fetching products for admin' });
  }
};

// Get products by type for regular users
const getProductsByTypeForUsers = async (req, res) => {
  try {
    const products = await Product.find({ type: req.params.type }); // Fetch products by type for all users
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error while fetching products by type' });
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

// Get a product by ID (for all users)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Fetch product by ID for all users
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error while fetching product by ID' });
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

const placeOrder = [
  body('productId').isMongoId().withMessage('A valid product ID is required'),
  body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { productId, quantity ,userId} = req.body;

      // Check if the product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Create a new order
      const newOrder = new Order({
        userId: userId, // Get userId from authenticated user
        products: [{
          productId: product._id,
          quantity,
          price: product.price, // Use product price
          adminId: product.adminId, // Associate order with the product's admin
        }],
        total: product.price * quantity, // Calculate total price
      });

      const savedOrder = await newOrder.save();
      res.status(201).json({
        message: 'Order placed successfully',
        order: savedOrder,
      });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ message: 'Internal server error while placing order' });
    }
  },
];


module.exports = {
  getProductsByTypeForUsers,
  getProductById,
  getAllProductsForUsers,
  getProductsByTypeForAdmin,
  getAllProductsForAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  placeOrder, // Export the placeOrder function
};
