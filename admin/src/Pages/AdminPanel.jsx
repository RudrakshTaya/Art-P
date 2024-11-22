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
    subcategory: '',
    brand: '',
    stock: '',
    images: [],
    discount: '',
    discountExpiresAt:'',
    isCustomizable: false,
    customizationOptions: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = [
    'Original Handmade Art and Decor',
    'Personalized Clothing and Accessories',
    'DIY Kits and Craft Materials',
    'Customized Home and Gift Items',
    'Sustainable and Upcycled Crafts',
    'Limited Edition Collaborative Products',
  ];

  const subcategories = {
    'Original Handmade Art and Decor': ['Paintings and Sculptures', 'Wall Hangings', 'Handmade Pottery'],
    'Personalized Clothing and Accessories': ['Custom Embroidered Apparel', 'Handmade Jewelry'],
    'DIY Kits and Craft Materials': ['Candle-Making Kits', 'Embroidery Kits', 'Woodworking Kits'],
    'Customized Home and Gift Items': ['Personalized Gifts', 'Keepsake Boxes'],
    'Sustainable and Upcycled Crafts': ['Eco-Friendly Decor', 'Sustainable Home Goods'],
    'Limited Edition Collaborative Products': ['Exclusive Art Pieces', 'Collaborative Home Decor'],
  };

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

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchEarnings();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'images' && files) {
      const imagesArray = Array.from(files);
      setFormData((prevData) => ({
        ...prevData,
        [name]: imagesArray,
      }));
      setImagePreviews(imagesArray.map((file) => URL.createObjectURL(file)));
    } else if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'images') {
          formData.images.forEach((image) => data.append('images', image));
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
    } finally {
      setLoading(false);
    }
  };

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

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory || '',
      brand: product.brand,
      stock: product.stock,
      discount: product.discount,
      discountExpiresAt: product.discountExpiresAt,
      images: [],
      isCustomizable: product.isCustomizable,
      customizationOptions: product.customizationOptions.join(', '),
    });
    setImagePreviews(product.images.map((image) => image.url));
    setIsEditing(true);
    setCurrentProductId(product._id);
  };

  const handleCancelEdit = () => {
    resetForm();
    setIsEditing(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      subcategory: '',
      brand: '',
      stock: '',
      images: [],
      discount: '',
      discountExpiresAt: '',
      isCustomizable: false,
      customizationOptions: '',
    });
    setImagePreviews([]);
    setIsEditing(false);
    setCurrentProductId(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5002/api/ad/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="product-form">
        <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Product Description" required />
        <input name="price" value={formData.price} onChange={handleChange} placeholder="Price ($)" required type="number" min="0" />
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">--Select Category--</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        {formData.category && (
          <select name="subcategory" value={formData.subcategory} onChange={handleChange}>
            <option value="">--Select Subcategory--</option>
            {subcategories[formData.category]?.map((sub, index) => (
              <option key={index} value={sub}>{sub}</option>
            ))}
          </select>
        )}
        <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand Name" required />
        <input name="stock" value={formData.stock} onChange={handleChange} placeholder="Items in stock" required type="number" min="0" />
        <input type="file" name="images" accept="image/*" onChange={handleChange} multiple />
        <div className="image-previews">
          {imagePreviews.map((preview, index) => (
            <img key={index} src={preview} alt="Product preview" className="image-preview" />
          ))}
        </div>
        <label>
          <input type="checkbox" name="isCustomizable" checked={formData.isCustomizable} onChange={handleChange} />
          Customizable
        </label>
        {formData.isCustomizable && (
          <textarea name="customizationOptions" value={formData.customizationOptions} onChange={handleChange} placeholder="Customization Options (comma-separated)" />
        )}
        <input name="discount" value={formData.discount} onChange={handleChange} placeholder="Discount(%)" required type="percentage" min="0" />
        <input name="discountExpiresAt" value={formData.discountExpiresAt} onChange={handleChange} placeholder="Discount Expiration Date"required type="date"
/>
        <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
        {isEditing && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
      </form>

        <section className="recent-orders">
        <h2>Recent Orders</h2>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order._id}>
                <p>Order ID: {order._id} - Total: <strong>${order.total.toFixed(2)}</strong></p>
            
                <p>Status:
                  <select value={order.orderStatus} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="status-dropdown">
                    {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </p>
              </li>
            ))}
          </ul>
        ) : <p>No recent orders found.</p>}
      </section>


      <section className="product-list">
        <h2>Product List</h2>
        {products.length > 0 ? (
          <ul>
            {products.map((product) => (
              <li key={product._id}>
                <p><strong>{product.name}</strong> - ${product.price}</p>
                <p> Stock:{product.stock}</p>
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : <p>No products found.</p>}
      </section>
    </div>
  );
};

export default AdminDashboard;
