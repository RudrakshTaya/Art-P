const Product = require('../Models/product.Models');
const Order = require('../Models/order.Models');
const { body, validationResult } = require('express-validator');
const Razorpay = require('razorpay');

// Initialize Razorpay instance with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get all products for regular users
const getAllProductsForUsers = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Internal server error while fetching products' });
  }
};

// Get products by type for regular users
const getProductsByTypeForUsers = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.type });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by type:', error);
    res.status(500).json({ message: 'Internal server error while fetching products by type' });
  }
};

// Get a product by ID (for all users)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Internal server error while fetching product by ID' });
  }
};



// Place an order and create Razorpay order
const placeOrder = [
  body('products').isArray().withMessage('Products must be an array of product objects'),
  body('products.*.productId').isMongoId().withMessage('A valid product ID is required'),
  body('products.*.quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
  body('userId').isMongoId().withMessage('A valid user ID is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { products } = req.body;
      const userId = req.user.userId;
      let totalAmount = 0;
      let orderItems = [];

      for (let item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
        }

        orderItems.push({
          productId: product._id,
          quantity: item.quantity,
          price: product.price,
          adminId: product.adminId,
          name:product.name
        });
        totalAmount += product.price * item.quantity;

        product.stock -= item.quantity;
        await product.save();
      }

      const newOrder = new Order({ userId, products: orderItems, total: totalAmount });
      const savedOrder = await newOrder.save();

      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100,
        currency: 'INR',
        receipt: savedOrder._id.toString(),
        notes: { userId },
      });

      savedOrder.paymentId = razorpayOrder.id;
      await savedOrder.save();

      res.status(201).json({
        message: 'Order placed successfully',
        order: savedOrder,
        razorpayOrderId: razorpayOrder.id,
        razorpayPaymentLink: `https://checkout.razorpay.com/v1/checkout.js?order_id=${razorpayOrder.id}`,
      });
    } catch (error) {
      console.error('Error placing order:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },
];

module.exports = { placeOrder, getAllProductsForUsers, getProductsByTypeForUsers, getProductById };
