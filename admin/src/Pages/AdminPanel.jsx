import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Adminpanel.css'; // Import the CSS file

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    rating: 0,
    imageLink: null,
    type: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products for the logged-in admin
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/ad/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/ad/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch total earnings
  const fetchEarnings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/ad/admin/earnings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEarnings(Number(response.data.totalEarnings) || 0); // Ensure earnings are a number
    } catch (err) {
      setError('Failed to fetch earnings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchEarnings();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageLink') {
      setFormData({ ...formData, imageLink: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submit for adding or updating a product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('rating', formData.rating);
      data.append('type', formData.type);
      if (formData.imageLink) {
        data.append('imageLink', formData.imageLink);
      }

      if (isEditing) {
        await axios.put(`http://localhost:5002/api/ad/admin/products/${currentProductId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('http://localhost:5002/api/ad/admin/products', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError('Failed to save the product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5002/api/ad/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      setError('Failed to delete the product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit product action
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      rating: product.rating,
      imageLink: null,
      type: product.type,
    });
    setIsEditing(true);
    setCurrentProductId(product._id);
  };

  // Cancel the edit operation
  const handleCancelEdit = () => {
    resetForm();
    setIsEditing(false);
    setCurrentProductId(null);
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      rating: 0,
      imageLink: null,
      type: '',
    });
    setIsEditing(false);
    setCurrentProductId(null);
  };

  return (
    <div className="admin-dashboard">
     

      {/* Display error or loading states */}
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Add/Edit Product Form */}
      <form onSubmit={handleSubmit} className="product-form">
        <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Product Description"
          required
        />
        <input
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price ($)"
          required
          type="number"
          min="0"
        />
        <input
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Rating (1-5)"
          required
          type="number"
          min="1"
          max="5"
        />
        <input
          type="file"
          name="imageLink"
          accept="image/*"
          onChange={handleChange}
        />
        {formData.imageLink && (
          <img 
            src={URL.createObjectURL(formData.imageLink)} 
            alt="Preview" 
            className="image-preview" 
          />
        )}
        <label htmlFor="type">Product Type:</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">--Select Type--</option>
          <option value="Type-1">Type 1</option>
          <option value="Type-2">Type 2</option>
          <option value="Type-3">Type 3</option>
        </select>
        <button type="submit" disabled={loading} className="submit-button">
          {isEditing ? 'Update Product' : 'Add Product'}
        </button>
        {isEditing && <button type="button" onClick={handleCancelEdit} className="cancel-button">Cancel Edit</button>}
      </form>

      {/* Statistics Section */}
      <section className="statistics">
        <h2>Statistics</h2>
        <p>Total Earnings: <strong>${typeof earnings === 'number' ? earnings.toFixed(2) : 'N/A'}</strong></p>
      </section>

      {/* Recent Orders Section */}
      <section className="recent-orders">
        <h2>Recent Orders</h2>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order._id} className="order-item">
                Order ID: {order._id} - Total: <strong>${order.total.toFixed(2)}</strong> - Status: {order.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent orders found.</p>
        )}
      </section>

      {/* Product List Section */}
      <section className="product-list">
        <h2>Product List</h2>
        {products.length > 0 ? (
          <ul>
            {products.map((product) => (
              <li key={product._id} className="product-item">
                <h3>{product.name}</h3>
                
                <p>Price: <strong>${product.price.toFixed(2)}</strong></p>
                
                <p>Type: <strong>{product.type}</strong></p>
                <button onClick={() => handleEdit(product)} className="edit-button">Edit</button>
                <button onClick={() => handleDelete(product._id)} className="delete-button">Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found.</p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
