import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from '../Components/useAuth';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { userId } = useAuth();

  // Helper function to compare customizations
  const compareCustomizations = (custom1, custom2) => {
    if (!custom1 && !custom2) return true;
    if (!custom1 || !custom2) return false;
    
    const keys1 = Object.keys(custom1);
    const keys2 = Object.keys(custom2);
    
    if (keys1.length !== keys2.length) return false;
    
    return keys1.every(key => {
      // Special handling for files (compare by name and size)
      if (custom1[key] instanceof File && custom2[key] instanceof File) {
        return custom1[key].name === custom2[key].name && 
               custom1[key].size === custom2[key].size;
      }
      return custom1[key] === custom2[key];
    });
  };

  const fetchCart = useCallback(async () => {
    if (userId) {
      try {
        const response = await fetch(`http://localhost:5002/api/cart/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setCart(data.items || []);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity, selectedCustomizations = {}) => {
    if (!userId) {
      
      console.warn("⚠️ User not logged in. Cannot add to cart.");
      return false;
    }
  
    try {
      console.log('🛠️ Sending Request:', {
        userId,
        productId: product._id,
        quantity,
        selectedCustomizations
      });
  
      // Prepare customizations and check for files
      const customizations = { ...selectedCustomizations };
      const formData = new FormData();
      let hasFiles = false;
  
      Object.entries(customizations).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
          hasFiles = true;
        }
      });
  
      if (hasFiles) {
        // Upload files first
        formData.append('userId', userId);
        formData.append('productId', product._id);
        formData.append('quantity', quantity);
        
        console.log("📤 Uploading files with request:", formData);
  
        const uploadResponse = await fetch('http://localhost:5002/api/cart/add-with-files', {
          method: 'POST',
          body: formData,
        });
  
        const uploadResult = await uploadResponse.json();
        console.log("✅ File Upload Response:", uploadResult);
  
        if (!uploadResponse.ok) {
          throw new Error(`File upload failed: ${uploadResult.message}`);
        }
  
        fetchCart();
        return true;
      } else {
        // No files to upload
        const payload = {
          userId, 
          productId: product._id, 
          quantity,
          selectedCustomizations: Object.keys(selectedCustomizations).length ? selectedCustomizations : undefined, // Ensure valid data
        };
  
        console.log("📤 Sending JSON Request:", payload);
  
        const response = await fetch('http://localhost:5002/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        const result = await response.json();
        console.log("✅ Server Response:", result);
  
        if (!response.ok) {
          throw new Error(`Request failed: ${result.message}`);
        }
  
        fetchCart();
        return true;
      }
    } catch (error) {
      console.error('❌ Error adding to cart:', error.message);
      return false;
    }
  };
  

  const removeFromCart = async (cartItemId) => {
    if (userId) {
      try {

        await fetch('http://localhost:5002/api/cart/remove', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, cartItemId }),
        });
        fetchCart();
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (userId) {
      try {
        await fetch('http://localhost:5002/api/cart/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, cartItemId, quantity }),
        });
        fetchCart();
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }
  };

  const clearCart = async () => {
    if (userId) {
      try {
        await fetch('http://localhost:5002/api/cart/clear', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        setCart([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      compareCustomizations
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);