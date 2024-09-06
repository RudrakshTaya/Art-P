import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Function to fetch the cart from the backend
  const fetchCart = async () => {
    const userId = localStorage.getItem('userId');
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
  };
  // Fetch the cart when the component mounts
  useEffect(() => {
    fetchCart();
  }, []);

  // Function to add or update item in the cart
  const addToCart = async (product, quantity) => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        await fetch('http://localhost:5002/api/addcart', {
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
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        await fetch('http://localhost:5002/api/removecart', {
          method: 'POST',
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
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        await fetch('http://localhost:5002/api/updatecart', {
          method: 'POST',
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
