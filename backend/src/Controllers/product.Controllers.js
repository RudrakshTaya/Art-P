// Import the Product model
const Product = require('../Models/product.Models');

// Controller function to get products by type
const getProductsByType = async (req, res) => {
  try {
    const products = await Product.find({ type: req.params.type });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductsByType,
};
