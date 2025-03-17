import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../Components/useAuth'; // Assuming you have this for authentication
import axios from 'axios';

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const { userId } = useAuth(); // Get userId from your authentication context
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // New error state

  // Fetch wishlist from the server
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return; // Exit if userId is not available

      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5002/api/account/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched Wishlist:', response.data.products);
        setWishlist(response.data.products || []); // Set the fetched wishlist
      } catch (err) {
        console.error('Error fetching wishlist:', err.message);
        setError('Failed to fetch wishlist. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  // Add a product to the wishlist
  const addToWishlist = async (product) => {
    setLoading(true);
    setError(null); // Reset error state before adding

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5002/api/account/wishlist',
        { productId: product._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Added to Wishlist:', response.data.products);
      setWishlist(response.data.products || []); // Update wishlist after adding
    } catch (err) {
      console.error('Error adding to wishlist:', err.message);
      setError('Failed to add product to wishlist.');
    } finally {
      setLoading(false);
    }
  };

  // Remove a product from the wishlist
  const removeFromWishlist = async (productId) => {
    setLoading(true);
    setError(null); // Reset error state before removing

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5002/api/account/wishlist/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Removed from Wishlist:', response.data.products);
      setWishlist(response.data.products || []); // Update wishlist after removal
    } catch (err) {
      console.error('Error removing from wishlist:', err.message);
      setError('Failed to remove product from wishlist.');
    } finally {
      setLoading(false);
    }
  };

  // Check if a product is in the wishlist (optimized to use local state)
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.productId._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist, // Optimized check
        loading,
        error, // Expose error state
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
