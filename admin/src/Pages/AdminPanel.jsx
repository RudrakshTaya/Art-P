import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Adminpanel.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    images: [],
    discount: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
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

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
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

  // Fetch earnings
  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/ad/admin/earnings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEarnings(Number(response.data.totalEarnings) || 0);
    } catch (err) {
      setError('Failed to fetch earnings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Run fetch functions on initial load
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchEarnings();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images' && files) {
      const imagesArray = Array.from(files);
      setFormData((prevData) => ({
        ...prevData,
        [name]: imagesArray,
      }));
      setImagePreviews(imagesArray.map((file) => URL.createObjectURL(file)));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Submit form data for adding or editing products
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;  // Prevent multiple submissions while loading
   

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'images') {
          formData.images.forEach((image) => data.append('images', image)); // Append multiple images
        } else {
          data.append(key, formData[key]);
        }
      });

      const requestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      if (isEditing) {
        await axios.put(
          `http://localhost:5002/api/ad/admin/products/${currentProductId}`,
          data,
          requestConfig
        );
      } else {
        await axios.post('http://localhost:5002/api/ad/admin/products', data, requestConfig);
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setError('Failed to save the product. Please try again.');
      console.error(err);  // Log error for debugging
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
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

  // Edit a product
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      discount: product.discount,
      images: [], // Clear previous images on edit
    });
    setImagePreviews(product.images.map((imageUrl) => imageUrl)); // Set product images if editing
    setIsEditing(true);
    setCurrentProductId(product._id);
  };

  // Cancel product editing
  const handleCancelEdit = () => {
    resetForm();
    setIsEditing(false);
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      stock: '',
      images: [],
      discount: '',
    });
    setImagePreviews([]);
    setIsEditing(false);
    setCurrentProductId(null);
  };

  return (
    <div className="admin-dashboard">
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

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
        
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">--Select Category--</option>
          <option value="Type-1">Type 1</option>
          <option value="Type-2">Type 2</option>
          <option value="Type-3">Type 3</option>
        </select>

        <input
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Brand Name"
          required
        />
        <input
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Items in stock"
          required
          type="number"
          min="0"
        />
        
        <input
          type="file"
          name="images"
          accept="image/*"
          onChange={handleChange}
          multiple
        />
        <div className="image-preview-container">
          {imagePreviews.map((preview, index) => (
            <img key={index} src={preview} alt={`Preview ${index + 1}`} className="image-preview" />
          ))}
        </div>

        <input
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          placeholder="Discount"
          type="number"
          min="0"
        />

        <button type="submit" disabled={loading}>
          {isEditing ? 'Update Product' : 'Add Product'}
        </button>
        {isEditing && <button type="button" onClick={handleCancelEdit}>Cancel Edit</button>}
      </form>

      <section className="statistics">
        <h2>Statistics</h2>
        <p>Total Earnings: <strong>${earnings.toFixed(2)}</strong></p>
      </section>

      <section className="recent-orders">
        <h2>Recent Orders</h2>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order._id}>
              
                Order ID: {order._id} - Total: <strong>${order.total.toFixed(2)}</strong> - Status: {order.orderStatus}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent orders found.</p>
        )}
      </section>

      <section className="product-list">
        <h2>Product List</h2>
        {products.length > 0 ? (
          <ul>
            {products.map((product) => (
              <li key={product._id}>
                <p>{product.name} - ${product.price}</p>
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
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
