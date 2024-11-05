import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';


const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role is 'user'

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5002/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, role }), // Send role as well
            });
              
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                alert('User registered successfully');
                // Optionally redirect to the sign-in page
                // navigate('/signin');
            } else {
                alert(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {/* Role selection dropdown */}
                <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account? <Link to="/signin">Sign In</Link>
            </p>
        </div>
    );
};

export default Signup;
