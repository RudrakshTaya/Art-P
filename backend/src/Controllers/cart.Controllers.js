const Cart = require('../Models/cart.Models');

// Add item to cart or update existing item quantity
exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        // Update quantity if item exists
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item if it does not exist
        cart.items.push({ productId, quantity });
      }
      await cart.save();
    } else {
      // Create new cart if none exists for the user
      cart = new Cart({ userId, items: [{ productId, quantity }] });
      await cart.save();
    }

    res.status(200).json({ message: 'Cart updated' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart', error: error.message });
  }
};

// Fetch user's cart
exports.getCart = async (req, res) => {
  try {
    // Find cart for the user and populate product details
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });

    if (cart) {
      // Filter out the item to be removed
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      await cart.save();
      res.status(200).json({ message: 'Item removed successfully' });
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
};

// Update item quantity in cart
exports.updateQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.status(200).json({ message: 'Quantity updated successfully' });
      } else {
        res.status(404).json({ message: 'Item not found in cart' });
      }
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'Error updating quantity', error: error.message });
  }
};

// Handle buy now action
exports.buyNow = async (req, res) => {
  const { userId } = req.body;

  try {
    // Handle purchase logic here (e.g., deduct stock, record purchase)
    await Cart.deleteOne({ userId }); // Clear the cart for the user
    res.status(200).json({ message: 'Purchase successful' });
  } catch (error) {
    console.error('Error completing purchase:', error);
    res.status(500).json({ message: 'Error completing purchase', error: error.message });
  }
};
