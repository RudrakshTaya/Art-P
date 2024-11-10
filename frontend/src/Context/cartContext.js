import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from '../Components/useAuth'; // Assuming your authContext is in the same folder

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { userId } = useAuth(); // Access userId from the auth context

  // Memoize the fetchCart function using useCallback
  const fetchCart = useCallback(async () => {
    if (userId) {
      try {
        const response = await fetch(`http://localhost:5002/api/cart/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setCart(data.items || []);
        } else {
          console.error('Failed to fetch cart');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
  }, [userId]); // Only re-create fetchCart when userId changes

  // Fetch the cart when the user ID changes (i.e., on login or logout)
  useEffect(() => {
    fetchCart();
  }, [fetchCart]); // Add fetchCart as a dependency (it's now memoized)

  // Function to add or update item in the cart
  
  const addToCart = async (product, quantity) => {
   
    if (userId) {
      try {
        await fetch('http://localhost:5002/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, productId: product._id, quantity }),
          
        });
        fetchCart(); // Refresh cart after adding
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  // Function to remove item from the cart
  const removeFromCart = async (productId) => {
    if (userId) {
      try {
        await fetch('http://localhost:5002/api/cart/remove', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, productId }),
        });
        fetchCart(); // Refresh cart after removing
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }
  };

  // Function to update the quantity of an item
  const updateQuantity = async (productId, quantity) => {
    if (userId) {
      try {
        await fetch('http://localhost:5002/api/cart/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, productId, quantity }),
        });
        fetchCart(); // Refresh cart after updating
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
