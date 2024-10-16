import React, { useState } from 'react';
import axios from 'axios';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add the role field to the request data
      const response = await axios.post('http://localhost:5002/api/auth/admin/signup', {
        ...formData,
        role: 'admin' // Set role to 'admin'
      });
      setMessage(response.data.message);
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Admin Sign-Up</h2>
      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        required
      />
      <input
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        type="password"
        required
      />
      <button type="submit">Sign Up</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AdminSignup;
