import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import './Navbar.css';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown visibility
    const { isLoggedIn, signOut, username } = useAuth();

    const handleLogout = () => {
        signOut();
        setIsDropdownOpen(false); // Close dropdown after logout
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Craft Aura</Link>
            </div>
            <div className="nav-links">
                <Link to="/menu">Menu</Link>
                <Link to="/Challenges">Challenges</Link>
                <Link to="/Gallery">Gallery</Link>
                <Link to="/Cart">Cart</Link>

                {isLoggedIn ? (
                    <>
                        <span className="username" onClick={toggleDropdown}>
                            {username || 'Rudraksh'}
                        </span>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/profile">Account Information</Link>
                                <Link to="/orders">Order History</Link>
                                <div className="dropdown-divider"></div>
                                <Link to="/wishlist">Wishlist</Link>
                                <Link to="/payment-methods">Payment Methods</Link>
                                <Link to="/notifications">Subscriptions & Notifications</Link>
                                <div className="dropdown-divider"></div>
                                <Link to="/returns">Returns & Refunds</Link>
                                <Link to="/security">Security & Privacy</Link>
                                <Link to="/support">Help & Support</Link>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </>
                ) : (
                    <Link to="/Signin">Sign In</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
