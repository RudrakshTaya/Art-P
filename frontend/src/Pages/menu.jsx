import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom'; // Import Link component
import './menu.css';

function MenuPage() {
  const [type1Products, setType1Products] = useState([]);
  const [type2Products, setType2Products] = useState([]);
  const [type3Products, setType3Products] = useState([]);
  const [miscellaneousProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const type1Response = await axios.get('http://localhost:5002/api/products/type/Type-1');
      setType1Products(type1Response.data);

      const type2Response = await axios.get('http://localhost:5002/api/products/type/Type-2');
      setType2Products(type2Response.data);

      const type3Response = await axios.get('http://localhost:5002/api/products/type/Type-3');
      setType3Products(type3Response.data);

    // const miscellaneousResponse = await axios.get('http://localhost:5002/api/products/Miscellaneous');
    //   setMiscellaneousProducts(miscellaneousResponse.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    const intervalId = setInterval(fetchProducts, 60000); // Refresh every 60 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);
 // Function to handle the product click
 const handleProductClick = (productId) => {
  navigate(`/products/${productId}`);  // Navigate to the Product Detail page with the product ID
};

  return (
    <div className="menu-page">
      <div><h1>Main-Heading</h1></div>

      {/* Section 1 */}
      <div className='section-1'>
        <div className='section-1-heading'>
          <h2>Section 1 - Type 1 Products</h2>
          <Link to="/products/type/Type-1" className="view-all-button">View All Type 1 Products</Link> {/* Navigation button */}
        </div>
        <div className='section-1-container'>
          {type1Products.length === 0 ? (
            <p>No Type 1 products available.</p>
          ) : (
            type1Products.slice(0, 4).map(product => (
              <div key={product._id} className='product-card'
              onClick={() => handleProductClick(product._id)} >
                <img src={product.imageLink} alt="Product" className="shop-card-image" />
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p> {product.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 2 */}
      <div className='section-2'>
        <div className='section-2-heading'>
          <h2>Section 2 - Type 2 Products</h2>
          <Link to="/products/type/Type-2" className="view-all-button">View All Type 2 Products</Link> {/* Navigation button */}
        </div>
        <div className='section-2-container'>
          {type2Products.length === 0 ? (
            <p>No Type 2 products available.</p>
          ) : (
            type2Products.slice(0, 4).map(product => (
              <div key={product._id} className='product-card'
              onClick={() => handleProductClick(product._id)}>
                <img src={product.imageLink} alt="Product" className="shop-card-image" />
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p> {product.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 3 */}
      <div className='section-3'>
        <div className='section-3-heading'>
          <h2>Section 3 - Type 3 Products</h2>
          <Link to="/products/type/Type-3" className="view-all-button">View All Type 2 Products</Link> {/* Navigation button */}
        </div>
        <div className='section-3-container'>
          {type3Products.length === 0 ? (
            <p>No Type 3 products available.</p>
          ) : (
            type3Products.slice(0, 4).map(product => (
              <div key={product._id} className='product-card'
              onClick={() => handleProductClick(product._id)}>
                <img src={product.imageLink} alt="Product" className="shop-card-image" />
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p> {product.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 4 */}
      <div className='section-4'>
        <div className='section-4-heading'>
          <h2>Section 4 - Miscellaneous Products</h2>
          <Link to="/#miscellaneous-products" className="view-all-button">View All Miscellaneous Products</Link> {/* Navigation button */}
        </div>
        <div className='section-4-container'>
          {miscellaneousProducts.length === 0 ? (
            <p>No miscellaneous products available.</p>
          ) : (
            miscellaneousProducts.slice(0, 2).map(product => (
              <div key={product._id} className='product-card'>
                <img src={product.imageLink} alt="Product" className="shop-card-image" />
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Description: {product.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuPage;
