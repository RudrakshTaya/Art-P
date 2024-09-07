import React, { useEffect, useState } from 'react';
import { useCart } from '../Context/cartContext'; // Import CartContext
import './cart.css';
const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [error] = useState(null);

  // Check if cart data is defined and has the expected format
  useEffect(() => {
    if (cart) {
      console.log('Cart items:', cart);
    }
  }, [cart]);

  // Calculate total price, checking for undefined or null values
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => {
      if (item && item.productId && item.productId.price && item.quantity) {
        return total + (item.productId.price * item.quantity);
      }
      return total;
    }, 0);
  };

  // Handle quantity change
  const handleQuantityChange = (productId, quantity) => {
    updateQuantity(productId, quantity);
  };

  if (!cart) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <ul>
        {cart.map((item) => (
          <li key={item._id}>
            <div className="cart-item">
              <img src={item.productId.imgSrc} alt={item.productId.title} />
              <div className="item-details">
                <h2>{item.productId.title}</h2>
                <p>${item.productId.price}</p>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => handleQuantityChange(item.productId._id, Number(e.target.value))}
                />
                <button onClick={() => removeFromCart(item._id)}>Remove</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <h2>Total Price: ${calculateTotalPrice().toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default CartPage;
