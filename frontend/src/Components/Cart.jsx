import React, { useEffect, useState } from 'react';
import { useCart } from '../Context/cartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';  // Updated to react-router-dom
import './cart.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  // Removed setError since it was unused

  useEffect(() => {
    if (cart) {
      // Validate cart data if needed
    }
  }, [cart]);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      if (item && item.productId && item.productId.price && item.quantity) {
        return total + (item.productId.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.1; // Assuming 10% tax
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity >= 1) {
      updateQuantity(productId, quantity);
    }
  };

  const handleCheckout = () => {
    // Implement checkout logic here
    console.log('Proceeding to checkout');
  };

  if (!cart) {
    return <div className="cart-loading">Loading cart...</div>;
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="cart-empty">
          <ShoppingBag size={48} />
          <p>Your cart is empty.</p>
          <Link to="/products">
            <button className="continue-shopping-btn">Continue Shopping</button>
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img 
                    src={item.productId.images[0].url} 
                    alt={item.productId.name} 
                    width={100} 
                    height={100}
                    style={{ objectFit: 'cover' }} 
                  />
                </div>
                <div className="cart-item-details">
                  <h2>{item.productId.name}</h2>
                  <p className="cart-item-price">${item.productId.price.toFixed(2)}</p>
                  <div className="cart-item-quantity">
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleQuantityChange(item.productId._id, Number(e.target.value))}
                      className="cart-quantity-input"
                    />
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button 
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.productId._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="cart-summary-row">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Tax (10%):</span>
              <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
            </div>
            <div className="cart-summary-row cart-total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <button className="cart-checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
