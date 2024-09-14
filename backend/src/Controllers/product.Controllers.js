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

// Export the controller functions
module.exports = {
  getProductsByType,
  getProductsById,
  getAllProducts,
};
