import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPanel.css'; // Import the CSS file

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    rating: 0,
    imageLink: '',
    type: '',
    attributes: {}, // This can be expanded to contain specific attributes
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products for the logged-in admin
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
     
      const response = await axios.get('http://localhost:5002/api/admin/products', {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token to the request headers
        },
      });
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit for adding or updating a product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token'); // Retrieve the token for the request
      if (isEditing) {
        // Update an existing product
        await axios.put(`http://localhost:5002/api/admin/products/${currentProductId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token
          },
        });
      } else {
        // Create a new product
        await axios.post('http://localhost:5002/api/admin/products', formData, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token
          },
        });
      }
      // Reset form after submission
      setFormData({
        name: '',
        description: '',
        price: '',
        rating: 0,
        imageLink: '',
        type: '',
        attributes: {}, // Reset attributes
      });
      setIsEditing(false);
      setCurrentProductId(null);
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
    try {
      const token = localStorage.getItem('token'); // Retrieve the token for the request
      await axios.delete(`http://localhost:5002/api/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token
        },
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
      imageLink: product.imageLink,
      type: product.type,
      attributes: product.attributes || {}, // Handle attributes if available
    });
    setIsEditing(true);
    setCurrentProductId(product._id);
  };

  // Cancel the edit operation
  const handleCancelEdit = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      rating: 0,
      imageLink: '',
      type: '',
      attributes: {},
    });
    setIsEditing(false);
    setCurrentProductId(null);
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      {/* Display error or loading states */}
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          type="number"
        />
        <input
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Rating"
          required
          type="number"
        />
        <input
          name="imageLink"
          value={formData.imageLink}
          onChange={handleChange}
          placeholder="Image Link"
          required
        />
        <label htmlFor="type">Type:</label>
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
        <button type="submit" disabled={loading}>
          {isEditing ? 'Update' : 'Add'} Product
        </button>
        {isEditing && <button type="button" onClick={handleCancelEdit}>Cancel Edit</button>}
      </form>

      <h2>Product List</h2>
      <div className="product-list">
        {products.length > 0 ? (
          <ul>
            {products.map((product) => (
              <li key={product._id}>
                {product.name} - ${product.price}
                <div>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button onClick={() => handleDelete(product._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
