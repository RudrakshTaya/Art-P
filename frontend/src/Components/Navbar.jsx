import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State for logout popup
    const { isLoggedIn, signOut,username } = useAuth(); // Get isLoggedIn and signOut from useAuth
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignInClick = () => {
        localStorage.setItem('redirectPath', location.pathname);
    };

    const handleLogout = () => {
        signOut();
        navigate('/'); // Redirect to home or any other page after logout
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Craft Aura</Link>
            </div>
            <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                <Link to="/Shop">Shop</Link>
                <Link to="/Challenges">Challenges</Link>
                <Link to="/Gallery">Gallery</Link>
                <Link to="/Cart">Cart</Link> {/* Add Cart link */}
                {!isLoggedIn ? (
                    <Link to="/Signin" onClick={handleSignInClick}>Sign In</Link>
                ) : (
                    <>
                        <span 
                            className="username" 
                            onClick={() => setShowLogoutPopup(!showLogoutPopup)}
                        >
                            {username || 'Rudraksh'}
                        </span>
                        {showLogoutPopup && (
                            <div className="logout-popup">
                                <p>Are you sure you want to logout?</p>
                                <button onClick={handleLogout}>Yes, Logout</button>
                                <button onClick={() => setShowLogoutPopup(false)}>Cancel</button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="nav-toggle" onClick={toggleMenu}>
                ☰
            </div>
        </nav>
    );
};

export default Navbar;
