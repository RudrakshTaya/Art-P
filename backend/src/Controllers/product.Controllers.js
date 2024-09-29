// Import the Product model
const Product = require('../Models/product.Models');

// Get all Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get products by type
const getProductsByType = async (req, res) => {
  try {
    const products = await Product.find({ type: req.params.type });
    res.status(200).json(products); // Respond with the products array
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
};

// Controller function to get a product by ID
const getProductsById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' }); // If not found, return 404
    }
    res.json(product); // Respond with the product details
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product details' }); // Handle errors
  }
};

// Controller function to create a new product
const createProduct = async (req, res) => {
  const newProduct = new Product(req.body); // Create a new product instance
  try {
    const savedProduct = await newProduct.save(); // Save the product to the database
    res.status(201).json(savedProduct); // Respond with the created product
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle validation errors
  }
};

// Controller function to update an existing product
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' }); // If not found, return 404
    }
    res.json(updatedProduct); // Respond with the updated product details
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle validation errors
  }
};

// Controller function to delete a product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' }); // If not found, return 404
    }
    res.json({ message: 'Product deleted successfully' }); // Respond with success message
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
};

// Export the controller functions
module.exports = {
  getProductsByType,
  getProductsById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
