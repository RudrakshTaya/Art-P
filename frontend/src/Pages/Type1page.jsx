import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './product.css';

function Type1ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products of type 'Type1' from the backend
    axios.get('http://localhost:5002/api/products/Type-1')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching Type1 products:', error);
      });
  }, []);

  return (
    <div className="products-page">
    
      <h1>Type 1 Products</h1>
      <div className="products-container">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map(product => (
            <div key={product._id} className="product-card">
            <img src={product.imageLink} alt="h" className="shop-card-image" />
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
