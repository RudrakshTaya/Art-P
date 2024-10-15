import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import './Auth.css';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);       // Error state
  const navigate = useNavigate();
  const { signIn } = useAuth(); // Get signIn function from context

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading
    setError(null);    // Clear any previous errors

    try {
      const response = await fetch('http://localhost:5002/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sign-in successful, store token and user data, then navigate
        const { token, username, userId, role } = data; // Destructure necessary data
        localStorage.setItem('token', token); // Store token in local storage
        const userData = { username, email, userId, role };

        signIn(userData);
        //console.log('User role:', role); // Log user role

        // Redirect based on user role
        if (role === 'admin') {
          navigate('/admin'); // Admin dashboard
        } else {
          const redirectPath = localStorage.getItem('redirectPath') || '/';
          localStorage.removeItem('redirectPath');
          navigate(redirectPath); // Redirect to stored path or home
        }
      } else {
        // Handle error from API
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false); // End loading
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

        <button type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>} {/* Display error */}

      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Signin;
