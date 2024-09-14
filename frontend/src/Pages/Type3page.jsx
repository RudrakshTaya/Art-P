import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import axios from 'axios';
import './product.css';

function Type1ProductsPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();  // Initialize the useNavigate hook

  useEffect(() => {
    // Fetch products of type 'Type1' from the backend
    axios.get('http://localhost:5002/api/products/type/Type-3')
      .then(response => {
        setProducts(response.data);
       
      })
      .catch(error => {
        console.error('Error fetching Type1 products:', error);
      });
  }, []);

  // Function to handle the product click
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);  // Navigate to the Product Detail page with the product ID
  };

  return (
    <div className="products-page">
      <h1>Type 3 Products</h1>
      <div className="products-container">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map(product => (
            <div
              key={product._id}
              className="product-card"
              onClick={() => handleProductClick(product._id)} // Add onClick event
            >
              <img src={product.imageLink} alt="Product" className="shop-card-image" />
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>{product.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Type1ProductsPage;
