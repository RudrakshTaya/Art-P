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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate loading delay
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const calculateSubtotal = () => {
    if (!cart) return 0;
    return cart.reduce((total, item) => {
      const basePrice = item.product?.price || item.productId?.price || 0;
      const customizationPrice = item.customizationPrice || 0;
      return total + (basePrice + customizationPrice) * (item.quantity || 1);
    }, 0);
  };

  const taxRate = 0.1;
  const subtotal = calculateSubtotal();
  const tax = subtotal * taxRate;
  const shipping = subtotal > 1000 ? 0 : 99;
  const discount = couponApplied ? discountAmount : 0;
  const total = subtotal + tax + shipping - discount;

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity >= 1) {
      try {
        await updateQuantity(cartItemId, newQuantity);
      } catch (error) {
        console.error("Error updating quantity:", error);
        alert("Failed to update quantity. Please try again.");
      }
    }
  };

  const initiateRemove = (cartItemId) => {
    setItemToRemove(cartItemId);
    setShowConfirmModal(true);
  };

  const confirmRemoveItem = async () => {
    if (!itemToRemove) return;
    
    try {
      await removeFromCart(itemToRemove);
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item. Please try again.");
    } finally {
      setShowConfirmModal(false);
      setItemToRemove(null);
    }
  };

  const handleApplyCoupon = () => {
    setShowCouponError(false);
    
    // This would typically be an API call to validate the coupon
    if (couponCode.trim().toLowerCase() === 'welcome10') {
      setCouponApplied(true);
      setDiscountAmount(subtotal * 0.1); // 10% discount
    } else {
      setCouponApplied(false);
      setDiscountAmount(0);
      setShowCouponError(true);
      setTimeout(() => setShowCouponError(false), 3000);
    }
  };

  const handleCheckout = () => {
    console.log(cart);
    if (!cart || cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    if (!userId) {
      alert("Please log in to continue.");
      navigate("/signin", { state: { from: "/cart" } });
      return;
    }

    // Check for out of stock items
    const outOfStockItems = cart.filter(item => 
      item.product?.stock !== undefined && item.product.stock < item.quantity
    );

    if (outOfStockItems.length > 0) {
      alert(`Some items in your cart are out of stock or have insufficient quantity. 
             Please update your cart before proceeding.`);
      return;
    }

    setProcessing(true);
    navigate("/checkout", { 
      state: { 
        cart, 
        subtotal, 
        tax, 
        shipping, 
        discount, 
        total 
      } 
    });
    setProcessing(false);
  };

  const handleClearCart = () => {
    setShowConfirmModal(true);
    setItemToRemove('all');
  };

  const confirmClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Failed to clear cart. Please try again.");
    } finally {
      setShowConfirmModal(false);
      setItemToRemove(null);
    }
  };

  const closeModal = () => {
    setShowConfirmModal(false);
    setItemToRemove(null);
  };

  const renderCustomizations = (customizations) => {
    if (!customizations || Object.keys(customizations).length === 0) return null;
    
    return (
      <div className="customization-display">
        {Object.entries(customizations).map(([key, value]) => {
          // Handle file customizations
          if (value instanceof File || (typeof value === 'string' && value.match(/\.(jpeg|jpg|gif|png|pdf)$/i))) {
            return (
              <div key={key} className="customization-item">
                <strong>{key}:</strong> 
                {value instanceof File ? value.name : 'File attached'}
              </div>
            );
          }
          
          // Handle color customizations
          if (key.toLowerCase().includes('color') || typeof value === 'string' && value.match(/^#([0-9A-F]{3}){1,2}$/i)) {
            return (
              <div key={key} className="customization-item">
                <strong>{key}:</strong> 
                <span 
                  className="color-swatch" 
                  style={{ backgroundColor: value }}
                  title={value}
                />
                <span className="color-value">{value}</span>
              </div>
            );
          }
          
          // Default text display
          return (
            <div key={key} className="customization-item">
              <strong>{key}:</strong> {value}
            </div>
          );
        })}
      </div>
    );
  };

  const getProductImage = (item) => {
    if (item.product?.images?.[0]?.url) return item.product.images[0].url;
    if (item.productId?.images?.[0]?.url) return item.productId.images[0].url;
    return "/placeholder.jpg";
  };

  const getProductName = (item) => {
    return item.product?.name || item.productId?.name || "Product";
  };

  const getProductPrice = (item) => {
    return item.product?.price || item.productId?.price || 0;
  };

  const getStockStatus = (item) => {
    if (item.product?.stock === undefined) return null;
    return item.product.stock < item.quantity ? "Insufficient stock" : null;
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Confirm Action</h3>
            <p>
              {itemToRemove === 'all' 
                ? "Are you sure you want to clear your entire cart?" 
                : "Are you sure you want to remove this item from your cart?"}
            </p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button 
                className="confirm-btn" 
                onClick={itemToRemove === 'all' ? confirmClearCart : confirmRemoveItem}
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
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
          {cart?.length > 0 && (
            <button 
              className="clear-cart-btn"
              onClick={handleClearCart}
              disabled={processing}
            >
              <Trash2 size={18} />
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {!cart || cart.length === 0 ? (
        <div className="cart-empty">
          <div className="empty-cart-icon">
            <ShoppingBag size={64} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products">
            <button className="browse-products-btn">
              Browse Products
            </button>
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
              {cart.map((item) => {
                const basePrice = getProductPrice(item);
                const customizationPrice = item.customizationPrice || 0;
                const itemPrice = basePrice + customizationPrice;
                const itemTotal = itemPrice * (item.quantity || 1);
                const stockWarning = getStockStatus(item);

                return (
                  <li key={item._id} className={`cart-item ${stockWarning ? 'low-stock' : ''}`}>
                    <div className="cart-item-product">
                      <div className="cart-item-image">
                        <img 
                          src={getProductImage(item)} 
                          alt={getProductName(item)} 
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="cart-item-details">
                        <h2>{getProductName(item)}</h2>
                        {item.selectedCustomizations && renderCustomizations(item.selectedCustomizations)}
                        {stockWarning && (
                          <p className="stock-warning">
                            {stockWarning} (Available: {item.product?.stock})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="cart-item-price">
                      ₹{itemPrice.toLocaleString('en-IN')}
                      {customizationPrice > 0 && (
                        <div className="customization-price-note">
                          (Includes ₹{customizationPrice} for customization)
                        </div>
                      )}
                    </div>

                    <div className="cart-item-quantity">
                      <button 
                        className="quantity-btn decrease" 
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || processing}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        max={item.product?.stock || 999}
                        onChange={(e) => {
                          const newQuantity = Math.max(1, Number(e.target.value));
                          if (!isNaN(newQuantity)) {
                            handleQuantityChange(item._id, newQuantity);
                          }
                        }}
                        className="cart-quantity-input"
                        disabled={processing}
                      />
                      <button 
                        className="quantity-btn increase" 
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={
                          processing || 
                          (item.product?.stock !== undefined && 
                           item.quantity >= item.product.stock)
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="cart-item-total">
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </div>

                    <button 
                      className="cart-item-remove"
                      onClick={() => initiateRemove(item._id)}
                      disabled={processing}
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="cart-summary-row">
              <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="cart-summary-row">
              <span>Tax (10%):</span>
              <span>₹{tax.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="cart-summary-row">
              <span>Shipping:</span>
              <span>
                {shipping === 0 ? (
                  <span className="free-shipping">Free</span>
                ) : (
                  `₹${shipping.toLocaleString('en-IN')}`
                )}
              </span>
            </div>
            
            {couponApplied && (
              <div className="cart-summary-row discount">
                <span>Discount:</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            
            <div className="cart-summary-row cart-total">
              <span>Total:</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <div className="coupon-section">
              <h3>Apply Coupon</h3>
              <div className="coupon-input-group">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    if (couponApplied) setCouponApplied(false);
                  }}
                  placeholder="Enter coupon code"
                  className={`coupon-input ${showCouponError ? 'error' : ''}`}
                  disabled={processing || couponApplied}
                />
                <button
                  onClick={handleApplyCoupon}
                  className="apply-coupon-btn"
                  disabled={!couponCode.trim() || processing || couponApplied}
                >
                  {couponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {showCouponError && (
                <p className="coupon-error">Invalid coupon code</p>
              )}
              {couponApplied && (
                <button
                  className="remove-coupon-btn"
                  onClick={() => {
                    setCouponApplied(false);
                    setDiscountAmount(0);
                    setCouponCode('');
                  }}
                >
                  Remove Coupon
                </button>
              )}
              <p className="coupon-hint">Try "WELCOME10" for 10% off</p>
            </div>

            <button
              className={`cart-checkout-btn ${processing ? 'processing' : ''}`}
              onClick={handleCheckout}
              disabled={
                processing || 
                !cart || 
                cart.length === 0 ||
                cart.some(item => item.product?.stock !== undefined && item.product.stock < item.quantity)
              }
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
          <p>Need help? <a href="mailto:support@example.com">Contact our customer support</a></p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;