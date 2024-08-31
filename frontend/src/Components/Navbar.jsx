import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
//import { useAuth } from './useAuth';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    // const { isLoggedIn, username } = useAuth();
    const location = useLocation();

    const handleSignInClick = () => {
        localStorage.setItem('redirectPath', location.pathname);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Brand</Link>
            </div>
            <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                <Link to="/Shop">Shop</Link>
                <Link to="/Challenges">Challenges</Link>
                <Link to="/Gallery">Gallery</Link>
             
               
                <Link to="/Signin" onClick={handleSignInClick}>Sign In</Link>
                
            </div>
            <div className="nav-toggle" onClick={toggleMenu}>
                ☰
            </div>
        </nav>
    );
};

export default Navbar;
