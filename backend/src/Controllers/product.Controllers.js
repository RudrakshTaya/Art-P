const Product = require('../Models/product.Models');
const Order = require('../Models/order.Models'); // Ensure you require the Order model
const { body, validationResult } = require('express-validator');

const fs = require('fs');



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



// Get products by type for regular users
const getProductsByTypeForUsers = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.type }); // Fetch products by type for all users
    res.status(200).json(products);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error while fetching products by type' });
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
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
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
      
      product.stock -= quantity;
      await product.save();
     
      res.status(201).json({
        message: 'Order placed successfully',
        
        order: savedOrder,
      }
    );
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
 
  placeOrder, // Export the placeOrder function
};
