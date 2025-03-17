import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCreditCard, FaPaypal, FaApplePay, FaGooglePay, FaShippingFast, FaLock, FaBox, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      
     

      <div className="footer-main">
        <div className="footer-container">
          {/* Branding & About */}
          <div className="footer-section about">
            <h2>Craft Aura</h2>
            <p>
              Discover handcrafted treasures from talented artisans worldwide. 
              Each piece tells a unique story and brings a touch of artistry to your life.
            </p>
            <div className="footer-contact">
              <p><FaPhone /> <span>(123) 456-7890</span></p>
              <p><FaEnvelope /> <span>support@craftaura.com</span></p>
              <p><FaMapMarkerAlt /> <span>123 Artisan Way, Craft City</span></p>
            </div>
          </div>

          {/* Customer Service */}
          <div className="footer-section links">
            <h3>Customer Service</h3>
            <ul>
              <li><Link to="/help-center">Help Center</Link></li>
              <li><Link to="/track-order">Track Your Order</Link></li>
              <li><Link to="/shipping-delivery">Shipping & Delivery</Link></li>
              <li><Link to="/returns">Returns & Exchanges</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Shopping Links */}
          <div className="footer-section categories">
            <h3>Shop Collections</h3>
            <ul>
              <li><Link to="/category/paintings">Paintings</Link></li>
              <li><Link to="/category/jewelry">Handmade Jewelry</Link></li>
              <li><Link to="/category/home-decor">Home Decor</Link></li>
              <li><Link to="/category/custom-art">Custom Art</Link></li>
              <li><Link to="/category/sculptures">Sculptures</Link></li>
              <li><Link to="/category/crafts">Craft Supplies</Link></li>
            </ul>
          </div>

          {/* Company Info */}
          <div className="footer-section company">
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/artisans">Our Artisans</Link></li>
              <li><Link to="/sustainability">Sustainability</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/affiliates">Affiliate Program</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="trust-badges">
        <div className="badge-container">
          <div className="badge">
            <FaShippingFast />
            <span>Fast & Reliable Shipping</span>
          </div>
          <div className="badge">
            <FaShieldAlt />
            <span>Secure Transactions</span>
          </div>
          <div className="badge">
            <FaBox />
            <span>Easy Returns</span>
          </div>
          <div className="badge">
            <FaLock />
            <span>Privacy Protected</span>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="payment-methods">
        <div className="payment-container">
          <h4>Payment Methods We Accept</h4>
          <div className="payment-icons">
            <FaCreditCard />
            <FaPaypal />
            <FaApplePay />
            <FaGooglePay />
            <span className="text-payment">And more payment options</span>
          </div>
        </div>
      </div>

      {/* Social Media & Copyright */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><FaPinterest /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
          </div>
          
          <div className="legal-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/accessibility">Accessibility</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
          
          <p className="copyright">&copy; {new Date().getFullYear()} Craft Aura. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;