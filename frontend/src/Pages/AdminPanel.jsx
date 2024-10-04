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
    attributes: {},
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:5002/api/products');
    setProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await axios.put(`http://localhost:5002/api/products/${currentProductId}`, formData);
    } else {
      await axios.post('http://localhost:5002/api/products', formData);
    }
    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      rating: 0,
      imageLink: '',
      type: '', // Reset type
      attributes: {},
    });
    setIsEditing(false);
    setCurrentProductId(null);
    fetchProducts();
  };

  // Handle delete
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5002/api/products/${id}`);
    fetchProducts();
  };

  // Handle edit
  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
    setCurrentProductId(product._id);
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">{isEditing ? 'Update' : 'Add'} Product</button>
      </form>

      <h2>Product List</h2>
      <div className="product-list">
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
      </div>
    </div>
  );
};

export default AdminPanel;
