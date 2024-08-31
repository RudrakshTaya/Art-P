import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                <Link to="/Gallert">Gallery</Link>
                <Link to="/Signup">Sign Up</Link>
            </div>
            <div className="nav-toggle" onClick={toggleMenu}>
                ☰
            </div>
        </nav>
    );
};

export default Navbar;
