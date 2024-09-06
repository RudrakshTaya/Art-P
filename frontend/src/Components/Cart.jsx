import React from 'react';
import { useCart } from '../Context/cartContext';
import { useNavigate } from 'react-router-dom';
import './cart.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout'); // Redirect to checkout page
  };

  const handleQuantityChange = (Product_Id, quantity) => {
    if (quantity < 1) {
      removeFromCart(Product_Id); // Remove item if quantity is less than 1
    } else {
      updateQuantity(Product_Id, quantity);
    }
  };

  // Calculate total price with defensive checks
  const totalPrice = cart.reduce((total, item) => {
    // Check if item.product and item.product.price are defined
    const price = item.product && item.product.price ? parseFloat(item.product.price) : 0;
    return total + (price * item.quantity);
  }, 0).toFixed(2);

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cart.map(({ product, quantity }) => (
            // Defensive check to avoid accessing properties of undefined
            product ? (
              <div key={product._id} className="cart-item">
                <img src={product.imgSrc || 'default-image-url.jpg'} alt={product.title} className="cart-item-image" />
                <div className="cart-item-info">
                  <h2>{product.title || 'No Title'}</h2>
                  <p>${product.price || '0.00'}</p>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(product._id, Number(e.target.value))}
                    min="1"
                  />
                  <button onClick={() => removeFromCart(product._id)}>Remove</button>
                </div>
              </div>
            ) : null
          ))}
          <div className="cart-summary">
            <h2>Total: ${totalPrice}</h2>
            <button onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
