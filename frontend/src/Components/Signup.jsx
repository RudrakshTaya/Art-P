import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [businessEmail, setBusinessEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false); // for loading state
    const [error, setError] = useState(null); // for error state

    const handleSignup = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                username,
                email: role === 'admin' ? businessEmail : email, 
                password,
                role,
                phoneNumber,
                fullName: role === 'admin' ? businessName : fullName,
            };

            const response = await fetch('http://localhost:5002/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
              
            const data = await response.json();
            setIsLoading(false);

            if (response.ok) {
                alert('User registered successfully! Please check your email to verify your account.');
                // Optionally redirect to the sign-in page
                // navigate('/signin');
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Signup error:', error);
            setError('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="" disabled hidden>Select Role</option> 
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <input
                    type="text"
                    placeholder={role === 'admin' ? "Business Name" : "Full Name"}
                    value={role === 'admin' ? businessName : fullName}
                    onChange={(e) => role === 'admin' ? setBusinessName(e.target.value) : setFullName(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                
                <input
                    type="email"
                    placeholder={role === 'admin' ? "Business Email" : "Email"}
                    value={role === 'admin' ? businessEmail : email}
                    onChange={(e) => role === 'admin' ? setBusinessEmail(e.target.value) : setEmail(e.target.value)}
                    required
                />
                
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                
                <input
                    type='text'
                    placeholder='Phone Number'
                    value={phoneNumber}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 10) {
                            setPhoneNumber(value);
                        }
                    }}
                    maxLength={10}
                    required
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>
                Already have an account? <Link to="/signin">Sign In</Link>
            </p>
        </div>
    );
};

export default Signup;
