'use client';

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CreditCard, Truck, ShieldCheck, ArrowLeft, Gift, Info } from 'lucide-react';

import "./Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], total = 0, userId } = location.state || {};
  
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [errors, setErrors] = useState({});

  // Shipping costs
  const shippingOptions = {
    standard: { price: 49, days: "3-5" },
    express: { price: 99, days: "1-2" },
    free: { price: 0, threshold: 999 }
  };

  // Calculate final price
  const subtotal = total;
  const shipping = total >= shippingOptions.free.threshold ? 0 : shippingOptions[deliveryOption].price;
  const finalTotal = subtotal + shipping - discount;

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { returnTo: "/checkout" } });
      return;
    }

    // Fetch saved addresses if user is logged in
    fetchSavedAddresses(token);
    
    // Redirect if cart is empty
    if (!cart || cart.length === 0) {
      navigate("/cart");
    }
  }, [navigate, cart]);

  const fetchSavedAddresses = async (token) => {
    try {
      const response = await axios.get(
        `http://localhost:5002/api/user/${userId}/addresses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.addresses) {
        setSavedAddresses(response.data.addresses);
      }
    } catch (error) {
      console.error("Error fetching saved addresses:", error);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const selectSavedAddress = (savedAddress) => {
    setAddress(savedAddress);
  };

  const validateAddress = () => {
    const newErrors = {};
    const requiredFields = ['fullName', 'phoneNumber', 'street', 'city', 'state', 'zipCode', 'country'];
    
    requiredFields.forEach(field => {
      if (!address[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    // Phone number validation
    if (address.phoneNumber && !/^\d{10}$/.test(address.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }
    
    // ZIP code validation
    if (address.zipCode && !/^\d{6}$/.test(address.zipCode)) {
      newErrors.zipCode = "Please enter a valid 6-digit ZIP code";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateAddress()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5002/api/validate-coupon",
        { 
          code: couponCode,
          total: subtotal
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.valid) {
        setDiscount(response.data.discountAmount);
        setAppliedCoupon(response.data.coupon);
      } else {
        setErrors({ coupon: response.data.message || "Invalid coupon code" });
      }
    } catch (error) {
      setErrors({ coupon: "Failed to validate coupon" });
      console.error("Coupon validation error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated.");

      // Format address for API
      const formattedAddress = `${address.fullName}, ${address.phoneNumber}, ${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
      
      // Prepare order data
      const orderResponse = await axios.post(
        "http://localhost:5002/api/placeorder",
        {
          products: cart.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          userId,
          subtotal,
          shipping,
          discount,
          total: finalTotal,
          address: formattedAddress,
          shippingMethod: deliveryOption,
          couponCode: appliedCoupon?.code || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (orderResponse.data.message === "Order placed successfully") {
        initiateRazorpay(orderResponse.data);
      } else {
        setErrors({ submit: orderResponse.data.message || "Failed to create order" });
      }
    } catch (error) {
      console.error("Order creation error:", error);
      setErrors({ submit: "Error processing order. Please try again." });
    } finally {
      setProcessing(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiateRazorpay = async (orderData) => {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      setErrors({ payment: "Failed to load payment gateway. Please try again." });
      return;
    }

    const { razorpayOrderId } = orderData;
    if (!razorpayOrderId) {
      setErrors({ payment: "Invalid order details. Please try again." });
      return;
    }

    const options = {
      key: "rzp_test_lnw8y27v4NY3zx",
      amount: finalTotal * 100, // Convert to paise
      currency: "INR",
      order_id: razorpayOrderId,
      name: "StyleCraft",
      description: "Fashion Purchase",
      image: "/logo.png", // Add your logo here
      handler: (response) => {
        // Verify payment on server
        verifyPayment(response, orderData.orderId);
      },
      prefill: {
        name: address.fullName,
        email: localStorage.getItem("userEmail") || "",
        contact: address.phoneNumber,
      },
      notes: {
        address: `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`,
      },
      theme: { color: "#3c4e7a" },
      modal: {
        ondismiss: function() {
          navigate("/cart", { state: { paymentCancelled: true } });
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const verifyPayment = async (paymentResponse, orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5002/api/verify-payment",
        {
          orderId,
          paymentId: paymentResponse.razorpay_payment_id,
          signature: paymentResponse.razorpay_signature
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.verified) {
        // Clear cart in local storage or context
        localStorage.removeItem("cart");
        
        // Navigate to confirmation page with order details
        navigate("/confirmation", { 
          state: { 
            orderId,
            total: finalTotal,
            paymentId: paymentResponse.razorpay_payment_id
          } 
        });
      } else {
        setErrors({ payment: "Payment verification failed. Please contact customer support." });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setErrors({ payment: "Error verifying payment. Please contact customer support." });
    }
  };

  return (
    <div className="elegant-checkout">
      <h1 className="elegant-checkout__title">Secure Checkout</h1>
      
      {/* Checkout progress */}
      <div className="elegant-checkout__progress">
        <div className={`elegant-checkout__progress-step ${step >= 1 ? 'active' : ''}`}>
          <div className="elegant-checkout__progress-number">1</div>
          <span>Delivery</span>
        </div>
        <div className="elegant-checkout__progress-bar" />
        <div className={`elegant-checkout__progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="elegant-checkout__progress-number">2</div>
          <span>Payment</span>
        </div>
      </div>
      
      <div className="elegant-checkout__content">
        {/* Left side content changes based on step */}
        <div className="elegant-checkout__main">
          {step === 1 ? (
            /* Step 1: Address Form */
            <div className="elegant-checkout__form-container">
              <h2 className="elegant-checkout__form-title">Delivery Details</h2>
              
              {/* Saved addresses section */}
              {savedAddresses.length > 0 && (
                <div className="elegant-checkout__saved-addresses">
                  <h3>Select a saved address</h3>
                  <div className="elegant-checkout__address-grid">
                    {savedAddresses.map((savedAddress, index) => (
                      <div 
                        key={index} 
                        className={`elegant-checkout__address-card ${address === savedAddress ? 'selected' : ''}`}
                        onClick={() => selectSavedAddress(savedAddress)}
                      >
                        <p className="elegant-checkout__address-name">{savedAddress.fullName}</p>
                        <p>{savedAddress.street}</p>
                        <p>{savedAddress.city}, {savedAddress.state} {savedAddress.zipCode}</p>
                        <p>{savedAddress.country}</p>
                        <p>{savedAddress.phoneNumber}</p>
                      </div>
                    ))}
                    <div 
                      className="elegant-checkout__address-card elegant-checkout__address-card--new"
                      onClick={() => setAddress({
                        fullName: "",
                        phoneNumber: "",
                        street: "",
                        city: "",
                        state: "",
                        zipCode: "",
                        country: "",
                      })}
                    >
                      <p>+ Add new address</p>
                    </div>
                  </div>
                </div>
              )}
              
              <form className="elegant-checkout__form">
                <div className="elegant-checkout__form-row">
                  <div className="elegant-checkout__form-group">
                    <label className="elegant-checkout__label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      className={`elegant-checkout__input ${errors.fullName ? 'error' : ''}`}
                    />
                    {errors.fullName && <p className="elegant-checkout__error">{errors.fullName}</p>}
                  </div>
                  <div className="elegant-checkout__form-group">
                    <label className="elegant-checkout__label">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={address.phoneNumber}
                      onChange={handleAddressChange}
                      className={`elegant-checkout__input ${errors.phoneNumber ? 'error' : ''}`}
                    />
                    {errors.phoneNumber && <p className="elegant-checkout__error">{errors.phoneNumber}</p>}
                  </div>
                </div>
                
                <div className="elegant-checkout__form-group">
                  <label className="elegant-checkout__label">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    className={`elegant-checkout__input ${errors.street ? 'error' : ''}`}
                  />
                  {errors.street && <p className="elegant-checkout__error">{errors.street}</p>}
                </div>
                
                <div className="elegant-checkout__form-row">
                  <div className="elegant-checkout__form-group">
                    <label className="elegant-checkout__label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      className={`elegant-checkout__input ${errors.city ? 'error' : ''}`}
                    />
                    {errors.city && <p className="elegant-checkout__error">{errors.city}</p>}
                  </div>
                  <div className="elegant-checkout__form-group">
                    <label className="elegant-checkout__label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      className={`elegant-checkout__input ${errors.state ? 'error' : ''}`}
                    />
                    {errors.state && <p className="elegant-checkout__error">{errors.state}</p>}
                  </div>
                </div>
                
                <div className="elegant-checkout__form-row">
                  <div className="elegant-checkout__form-group">
                  <label className="elegant-checkout__label">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={address.zipCode}
                      onChange={handleAddressChange}
                      className={`elegant-checkout__input ${errors.zipCode ? 'error' : ''}`}
                    />
                    {errors.zipCode && <p className="elegant-checkout__error">{errors.zipCode}</p>}
                  </div>
                  <div className="elegant-checkout__form-group">
                    <label className="elegant-checkout__label">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      className={`elegant-checkout__input ${errors.country ? 'error' : ''}`}
                    />
                    {errors.country && <p className="elegant-checkout__error">{errors.country}</p>}
                  </div>
                </div>
                
                <div className="elegant-checkout__form-group">
                  <label className="elegant-checkout__label">Save this address for future purchases</label>
                  <input
                    type="checkbox"
                    name="saveAddress"
                    className="elegant-checkout__checkbox"
                  />
                </div>
                
                <h3 className="elegant-checkout__section-title">Delivery Options</h3>
                <div className="elegant-checkout__delivery-options">
                  <div 
                    className={`elegant-checkout__delivery-option ${deliveryOption === 'standard' ? 'selected' : ''}`}
                    onClick={() => setDeliveryOption('standard')}
                  >
                    <div className="elegant-checkout__delivery-option-header">
                      <Truck size={20} />
                      <span>Standard Delivery</span>
                    </div>
                    <div className="elegant-checkout__delivery-option-details">
                      <p>₹{shippingOptions.standard.price}</p>
                      <p>{shippingOptions.standard.days} business days</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`elegant-checkout__delivery-option ${deliveryOption === 'express' ? 'selected' : ''}`}
                    onClick={() => setDeliveryOption('express')}
                  >
                    <div className="elegant-checkout__delivery-option-header">
                      <Truck size={20} />
                      <span>Express Delivery</span>
                    </div>
                    <div className="elegant-checkout__delivery-option-details">
                      <p>₹{shippingOptions.express.price}</p>
                      <p>{shippingOptions.express.days} business days</p>
                    </div>
                  </div>
                </div>
                
                {subtotal < shippingOptions.free.threshold && (
                  <div className="elegant-checkout__free-shipping-alert">
                    <Info size={16} />
                    <span>Add ₹{(shippingOptions.free.threshold - subtotal).toFixed(2)} more to your cart for FREE shipping!</span>
                  </div>
                )}
                
                <button 
                  type="button" 
                  className="elegant-checkout__submit"
                  onClick={handleNextStep}
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          ) : (
            /* Step 2: Payment */
            <div className="elegant-checkout__payment-container">
              <button 
                onClick={handlePrevStep}
                className="elegant-checkout__back-button"
              >
                <ArrowLeft size={16} /> Back to Delivery
              </button>
              
              <h2 className="elegant-checkout__form-title">Payment Method</h2>
              
              <div className="elegant-checkout__payment-methods">
                <div className="elegant-checkout__payment-method selected">
                  <div className="elegant-checkout__payment-method-header">
                    <CreditCard size={20} />
                    <span>Credit/Debit Card or UPI</span>
                  </div>
                  <div className="elegant-checkout__payment-method-detail">
                    Secured by Razorpay
                  </div>
                </div>
              </div>
              
              <div className="elegant-checkout__shipping-address">
                <h3>Shipping to:</h3>
                <p>{address.fullName}</p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                <p>{address.phoneNumber}</p>
                <button 
                  className="elegant-checkout__edit-button"
                  onClick={handlePrevStep}
                >
                  Edit
                </button>
              </div>
              
              <div className="elegant-checkout__coupon-section">
                <h3>Have a coupon?</h3>
                <div className="elegant-checkout__coupon-input">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={`elegant-checkout__input ${errors.coupon ? 'error' : ''}`}
                  />
                  <button 
                    className="elegant-checkout__apply-button"
                    onClick={applyCoupon}
                    disabled={processing}
                  >
                    {processing ? "Applying..." : "Apply"}
                  </button>
                </div>
                {errors.coupon && <p className="elegant-checkout__error">{errors.coupon}</p>}
                {appliedCoupon && (
                  <div className="elegant-checkout__applied-coupon">
                    <Gift size={16} />
                    <span>Coupon applied: {appliedCoupon.description}</span>
                  </div>
                )}
              </div>
              
              <div className="elegant-checkout__place-order">
                <button 
                  type="button" 
                  className="elegant-checkout__submit"
                  onClick={handleSubmit}
                  disabled={processing}
                >
                  {processing ? "Processing..." : `Pay ₹${finalTotal.toFixed(2)}`}
                  <CreditCard size={20} />
                </button>
                {errors.submit && <p className="elegant-checkout__error">{errors.submit}</p>}
                {errors.payment && <p className="elegant-checkout__error">{errors.payment}</p>}
              </div>
              
              <div className="elegant-checkout__security-info">
                <ShieldCheck size={16} />
                <span>Your payment information is processed securely. We do not store credit card details.</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Summary Section - Always visible */}
        <div className="elegant-checkout__summary">
          <h2 className="elegant-checkout__summary-title">Order Summary</h2>
          <div className="elegant-checkout__summary-items">
            {cart.map((item, index) => (
              <div key={index} className="elegant-checkout__product">
                <div className="elegant-checkout__product-image-container">
                  <img 
                    src={item.productId.images?.[0]?.url || "/placeholder.svg"} 
                    alt={item.productId.name} 
                    className="elegant-checkout__product-image"
                  />
                  <span className="elegant-checkout__product-quantity">{item.quantity}</span>
                </div>
                <div className="elegant-checkout__product-details">
                  <h3 className="elegant-checkout__product-name">{item.productId.name}</h3>
                  {item.productId.variant && (
                    <p className="elegant-checkout__product-variant">
                      {item.productId.variant}
                    </p>
                  )}
                  <p className="elegant-checkout__product-price">
                    ₹{item.productId.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="elegant-checkout__product-total">
                  ₹{(item.productId.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="elegant-checkout__summary-calculations">
            <div className="elegant-checkout__summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="elegant-checkout__summary-row">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="elegant-checkout__free-shipping">FREE</span>
                ) : (
                  `₹${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            {discount > 0 && (
              <div className="elegant-checkout__summary-row elegant-checkout__discount">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="elegant-checkout__summary-divider"></div>
            <div className="elegant-checkout__summary-row elegant-checkout__total-row">
              <span>Total</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="elegant-checkout__benefits">
            <div className="elegant-checkout__benefit">
              <Truck size={18} />
              <span>Free shipping on orders over ₹{shippingOptions.free.threshold}</span>
            </div>
            <div className="elegant-checkout__benefit">
              <ShieldCheck size={18} />
              <span>Secure payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;