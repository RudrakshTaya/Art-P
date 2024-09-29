import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import './Auth.css';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { signIn } = useAuth(); // Get signIn function

    const handleSignin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5002/api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Sign in successful');
                
                // Save the username, email, userId, and role in localStorage
                const userData = { 
                    username: data.username, 
                    email: data.email, 
                    userId: data.userId,
                    role: data.role // Get the user's role
                };
                signIn(userData);

                // Check role and redirect accordingly
                if (data.role === 'admin') {
                    navigate('/admin'); // Redirect to the admin panel if the user is an admin
                } else {
                    // Redirect to the stored path or default to home
                    const redirectPath = localStorage.getItem('redirectPath') || '/';
                    localStorage.removeItem('redirectPath');
                    navigate(redirectPath); // Redirect to the stored path or default to '/'
                }
            } else {
                alert(data.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Error signing in:', error);
            alert('An error occurred during sign in. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign In</h2>
            <form onSubmit={handleSignin}>
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
                <button type="submit">Sign In</button>
            </form>
            <p>
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
};

export default Signin;
