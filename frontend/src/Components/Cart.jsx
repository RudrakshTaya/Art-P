import React, { useEffect, useState } from 'react';
import { useCart } from '../Context/cartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Info, Shield, Truck, RefreshCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../Components/useAuth";
import './cart.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showCouponError, setShowCouponError] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    if (cart) {
      console.log("Cart Updated:", cart);
    }
  }, [cart]);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      return total + (item?.productId?.price || 0) * (item?.quantity || 1);
    }, 0);
  };

  const taxRate = 0.1;
  const subtotal = calculateSubtotal();
  const tax = subtotal * taxRate;
  const shipping = subtotal > 1000 ? 0 : 99;
  const discount = couponApplied ? discountAmount : 0;
  const total = subtotal + tax + shipping - discount;

  const handleQuantityChange = (productId, quantity) => {
    if (quantity >= 1) {
      updateQuantity(productId, quantity);
    }
  };

  const initiateRemove = (productId) => {
    setItemToRemove(productId);
    setShowConfirmModal(true);
  };

  const handleRemoveItem = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove);
      setShowConfirmModal(false);
      setItemToRemove(null);
    }
  };

  const handleApplyCoupon = () => {
    // Reset previous error state
    setShowCouponError(false);
    
    // This would typically involve an API call to validate the coupon
    if (couponCode.toLowerCase() === 'welcome10') {
      setCouponApplied(true);
      setDiscountAmount(subtotal * 0.1); // 10% discount
    } else {
      setCouponApplied(false);
      setDiscountAmount(0);
      setShowCouponError(true);
      
      // Auto-hide error after 3 seconds
      setTimeout(() => {
        setShowCouponError(false);
      }, 3000);
    }
  };

  const handleCheckout = () => {
    if (!cart.length) {
      alert("Your cart is empty!");
      return;
    }
    if (!userId) {
      alert("Please log in to continue.");
      navigate("/signin");
      return;
    }
    setProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      navigate("/checkout", { 
        state: { 
          cart, 
          subtotal, 
          tax, 
          shipping, 
          discount, 
          total, 
          userId 
        } 
      });
      setProcessing(false);
    }, 1000);
  };

  const handleClearCart = () => {
    setShowConfirmModal(true);
    setItemToRemove('all'); // Special flag to indicate clearing the whole cart
  };

  const confirmClearCart = () => {
    clearCart();
    setShowConfirmModal(false);
    setItemToRemove(null);
  };

  const closeModal = () => {
    setShowConfirmModal(false);
    setItemToRemove(null);
  };

  if (!cart) return (
    <div className="cart-loading">
      <div className="loading-spinner"></div>
      <p>Loading cart...</p>
    </div>
  );

  return (
    <div className="cart-page">
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Confirmation</h3>
            <p>
              {itemToRemove === 'all' 
                ? "Are you sure you want to clear your cart?" 
                : "Are you sure you want to remove this item?"}
            </p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button 
                className="confirm-btn" 
                onClick={itemToRemove === 'all' ? confirmClearCart : handleRemoveItem}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="cart-header">
        <h1 className="cart-title">Your Shopping Cart</h1>
        <div className="cart-header-actions">
          <Link to="/products" className="continue-shopping-link">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          {cart.length > 0 && (
            <button className="clear-cart-btn" onClick={handleClearCart}>
              <Trash2 className="h-4 w-4" />
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <div className="empty-cart-icon">
            <ShoppingBag size={64} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products">
            <button className="browse-products-btn">Browse Products</button>
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <span className="cart-header-product">Product</span>
              <span className="cart-header-price">Price</span>
              <span className="cart-header-quantity">Quantity</span>
              <span className="cart-header-total">Total</span>
              <span className="cart-header-actions">Actions</span>
            </div>
            <ul className="cart-items">
              {cart.map((item) => (
                <li key={item._id} className="cart-item">
                  <div className="cart-item-product">
                    <div className="cart-item-image">
                      <img 
                        src={item?.productId?.images?.[0]?.url || "/placeholder.jpg"} 
                        alt={item?.productId?.name || "Product"} 
                        loading="lazy"
                      />
                    </div>
                    <div className="cart-item-details">
                      <h2>{item?.productId?.name}</h2>
                      {item?.productId?.variant && <p className="cart-item-variant">{item.productId.variant}</p>}
                      {item?.productId?.inStock === false && (
                        <p className="out-of-stock-warning">Out of stock</p>
                      )}
                    </div>
                  </div>
                  <div className="cart-item-price">₹{(item?.productId?.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="cart-item-quantity">
                    <button 
                      className="quantity-btn decrease" 
                      onClick={() => handleQuantityChange(item?.productId?._id, item?.quantity - 1)}
                      disabled={item?.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={item?.quantity || 1}
                      min="1"
                      onChange={(e) => handleQuantityChange(item?.productId?._id, Number(e.target.value))}
                      className="cart-quantity-input"
                      aria-label="Item quantity"
                    />
                    <button 
                      className="quantity-btn increase" 
                      onClick={() => handleQuantityChange(item?.productId?._id, item?.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="cart-item-total">
                    ₹{((item?.productId?.price || 0) * (item?.quantity || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <button 
                    className="cart-item-remove"
                    onClick={() => initiateRemove(item?.productId?._id)}
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="cart-summary-row">
              <span>Subtotal ({cart.reduce((total, item) => total + (item?.quantity || 1), 0)} items):</span>
              <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="cart-summary-row">
              <span>Tax (10%):</span>
              <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping:</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
            </div>
            {couponApplied && (
              <div className="cart-summary-row discount">
                <span>Discount:</span>
                <span>-₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="cart-summary-row cart-total">
              <span>Total:</span>
              <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="coupon-section">
              <h3>Apply Coupon</h3>
              <div className="coupon-input-group">
                <input 
                  type="text" 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value)} 
                  placeholder="Enter coupon code"
                  className="coupon-input"
                />
                <button 
                  onClick={handleApplyCoupon} 
                  className="apply-coupon-btn"
                  disabled={!couponCode}
                >
                  Apply
                </button>
              </div>
              {showCouponError && (
                <p className="coupon-error">Invalid coupon code</p>
              )}
              {couponApplied && (
                <p className="coupon-success">Coupon applied successfully!</p>
              )}
              <p className="coupon-hint">Try "WELCOME10" for 10% off your first order</p>
            </div>

            <div className="shipping-note">
              <Info className="h-4 w-4" />
              <p>Free shipping on orders above ₹1000</p>
            </div>

            <button 
              className={`cart-checkout-btn ${processing ? 'processing' : ''}`} 
              onClick={handleCheckout}
              disabled={processing || cart.length === 0}
            >
              {processing ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Processing...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>

            <div className="payment-methods">
              <p>We accept:</p>
              <div className="payment-icons">
                <span className="payment-icon visa">Visa</span>
                <span className="payment-icon mastercard">MasterCard</span>
                <span className="payment-icon paypal">PayPal</span>
                <span className="payment-icon upi">UPI</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="cart-footer">
        <div className="cart-guarantees">
          <div className="guarantee-item">
            <div className="guarantee-icon">
              <Shield size={24} />
            </div>
            <div className="guarantee-text">
              <h3>Secure Payment</h3>
              <p>Your data is protected</p>
            </div>
          </div>
          <div className="guarantee-item">
            <div className="guarantee-icon">
              <Truck size={24} />
            </div>
            <div className="guarantee-text">
              <h3>Fast Delivery</h3>
              <p>2-3 business days</p>
            </div>
          </div>
          <div className="guarantee-item">
            <div className="guarantee-icon">
              <RefreshCcw size={24} />
            </div>
            <div className="guarantee-text">
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
          </div>
        </div>
        
        <div className="customer-support">
          <p>Need help? Contact our customer support at <a href="mailto:support@yourstore.com">support@yourstore.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;