const Wishlist = require('../Models/wishList.Models');

exports.addToWishlist = async (req, res) => {
  const { userId } = req.user; // Access userId from the authenticated user (should be attached by authMiddleware)
  const { productId } = req.body; // Access productId from the request body

  try {
    // Find the user's wishlist
    let wishlist = await Wishlist.findOne({ userId });

    // If no wishlist, create a new one
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    // Check if product is already in wishlist
    const productExists = wishlist.products.some(
      (item) => item.productId.toString() === productId
    );

    if (productExists) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add product to wishlist
    wishlist.products.push({ productId });
    await wishlist.save();

    res.status(200).json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to wishlist', error });
  }
};

exports.getWishlist = async (req, res) => {
  const { userId } = req.user; // Access userId from the authenticated user

  try {
    // Find the wishlist of the user and populate productId field
    const wishlist = await Wishlist.findOne({ userId }).populate('products.productId');

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json(wishlist); // Return the populated wishlist
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { userId } = req.user; // Access userId from the authenticated user
  const { productId } = req.params; // Access productId from the request params

  try {
    // Find the user's wishlist
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Remove the product from the wishlist
    wishlist.products = wishlist.products.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();
    res.status(200).json({ message: 'Product removed from wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product from wishlist', error });
  }
};
