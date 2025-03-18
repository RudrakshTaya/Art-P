import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import { ShoppingCart, Heart, User, Menu, X, ChevronDown, Bell } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { isLoggedIn, signOut, username } = useAuth();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const handleLogout = () => {
    signOut();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchActive) setIsSearchActive(false);
  };

 


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && !event.target.classList.contains('search-toggle')) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Categories dropdown for desktop
  const categories = [
    { name:  'Original Handmade Art and Decor', link: "/products/type/Original Handmade Art and Decor" },
    { name: "Personalized Clothing and Accessories", link: "/products/type/Personalized Clothing and Accessories" },
    { name: "DIY Kits and Craft Materials", link: "/products/type/DIY Kits and Craft Materials" },
    { name: "Customized Home and Gift Items", link: "/products/type/Customized Home and Gift Items" },
    { name: "Sustainable and Upcycled Crafts", link: "/products/type/Sustainable and Upcycled Crafts" },
    { name: "Limited Edition Collaborative Products", link: "/products/type/Limited Edition Collaborative Products" }
  ];

  return (
    <header className="site-header">
      {/* Top banner for promotions */}
      <div className="promo-banner">
        <p>Free shipping on orders over $50 | Use code WELCOME10 for 10% off your first order</p>
      </div>

      <nav className="navbar">
        <div className="navbar-container">
          {/* Mobile menu toggle */}
          <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </div>

          {/* Logo */}
          <div className="navbar-brand">
            <Link to="/">
              <span className="logo-text">Craft Aura</span>
            </Link>
          </div>

          {/* Main navigation - desktop */}
          <div className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
            <div className="categories-dropdown">
              <button className="categories-button">
                Shop <ChevronDown size={16} />
              </button>
              <div className="categories-menu">
                {categories.map((category, index) => (
                  <Link key={index} to={category.link} className="category-item">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/new-arrivals" className="nav-link">New Arrivals</Link>
            <Link to="/bestsellers" className="nav-link">Bestsellers</Link>
            <Link to="/deals" className="nav-link">Deals</Link>
            <Link to="/challenges" className="nav-link">Challenges</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
          </div>

          {/* Right actions section */}
          <div className="nav-actions">
            {/* Search */}
           

            {/* Wishlist */}
            <Link to="/wishlist" className="nav-icon">
              <Heart size={20} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="nav-icon cart-icon">
              <ShoppingCart size={20} />
              <span className="cart-badge">3</span>
            </Link>

            {/* User account */}
            {isLoggedIn ? (
              <div className="user-dropdown" ref={dropdownRef}>
                <div className="user-avatar" onClick={toggleDropdown}>
                  <User size={20} />
                  <span className="username-display">{username || 'Rudraksh'}</span>
                </div>
                
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <p className="welcome-text">Hello, {username || 'Rudraksh'}</p>
                    </div>
                    
                    <div className="dropdown-section">
                      <Link to="/account-info" className="dropdown-item">
                        <User size={16} />
                        <span>My Account</span>
                      </Link>
                      <Link to="/order-history" className="dropdown-item">
                        <span>Order History</span>
                      </Link>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-section">
                      <Link to="/wishlist" className="dropdown-item">
                        <Heart size={16} />
                        <span>Wishlist</span>
                      </Link>
                      <Link to="/notifications" className="dropdown-item">
                        <Bell size={16} />
                        <span>Notifications</span>
                      </Link>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-section">
                      <Link to="/support" className="dropdown-item">
                        <span>Help & Support</span>
                      </Link>
                    </div>
                    
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="sign-in-button">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Category navigation - mobile */}
      {isMobileMenuOpen && (
        <div className="mobile-categories">
          <h3>Shop by Category</h3>
          <div className="mobile-category-list">
            {categories.map((category, index) => (
              <Link key={index} to={category.link} className="mobile-category-item">
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;