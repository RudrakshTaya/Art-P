const Product = require('../Models/product.Models');
const { body, validationResult } = require('express-validator');

// Get all Products for regular users
const getAllProductsForUsers = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    res.status(200).json(products);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all Products for the logged-in admin
const getAllProductsForAdmin = async (req, res) => {
  try {
    const adminId = req.user.id; // Assuming req.user contains the authenticated admin's ID
    const products = await Product.find({ adminId });
    res.status(200).json(products);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get products by type for regular users
const getProductsByTypeForUsers = async (req, res) => {
  try {
    const products = await Product.find({ type: req.params.type }); // Fetch products by type for all users
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get products by type for the logged-in admin
const getProductsByTypeForAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const products = await Product.find({ type: req.params.type, adminId });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
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
    res.status(500).json({ message: 'Internal server error' });
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
      const newProduct = new Product({
        ...req.body,
        adminId: req.user.id, // Attach admin ID to the product
      });
      const savedProduct = await newProduct.save();
      res.status(201).json({
        message: 'Product created successfully',
        product: savedProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error creating product', error: error.message });
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
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: req.params.id, adminId: req.user.id }, // Ensure only the product's admin can update
        req.body,
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
      console.error(error);
      res.status(400).json({ message: 'Error updating product', error: error.message });
    }
  },
];

// Delete a product (only if the product belongs to the logged-in admin)
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id, adminId: req.user.id });
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProductsByTypeForUsers,
  getProductById,
  getAllProductsForUsers,
  getProductsByTypeForAdmin,
  getAllProductsForAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
};
