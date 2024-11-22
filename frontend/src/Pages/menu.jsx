import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';



function MenuPage() {
  const [type1Products, setType1Products] = useState([]);
  const [type2Products, setType2Products] = useState([]);
  const [type3Products, setType3Products] = useState([]);
  const [type4Products, setType4Products] = useState([]);
  const [type5Products, setType5Products] = useState([]);
  const [type6Products, setType6Products] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const type1Response = await axios.get('http://localhost:5002/api/products/type/Original Handmade Art and Decor');
      setType1Products(type1Response.data);

      const type2Response = await axios.get('http://localhost:5002/api/products/type/Personalized Clothing and Accessories');
      setType2Products(type2Response.data);

      const type3Response = await axios.get('http://localhost:5002/api/products/type/DIY Kits and Craft Materials');
      setType3Products(type3Response.data);

      const type4Response = await axios.get('http://localhost:5002/api/products/type/Customized Home and Gift Items');
      setType4Products(type4Response.data);

      const type5Response = await axios.get('http://localhost:5002/api/products/type/Sustainable and Upcycled Crafts');
      setType5Products(type5Response.data);

      const type6Response = await axios.get('http://localhost:5002/api/products/type/Limited Edition Collaborative Products');
      setType6Products(type6Response.data);
    
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
    navigate(`/products/${productId}`); // Navigate to the Product Detail page with the product ID
  };

  return (
    <div className="menu-page">
      <div>
        <h1>Discover Unique Creations</h1>
      </div>

      {/* Section 1 */}
      <div className='product-section'>
        <div className='product-section-heading'>
          <h2>Original Handmade Art and Decor</h2>
          <Link to="/products/type/Original Handmade Art and Decor" className="view-all-button">View All</Link>
        </div>
        <div className='product-section-container'>
          {type1Products.length === 0 ? (
            <p>No Type 1 products available.</p>
          ) : (
            type1Products.slice(0, 4).map(product => (
              <div key={product._id} className='product-card' onClick={() => handleProductClick(product._id)}>
                <img src={product.images[0].url} alt="Product" className="product-image" />
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>{product.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 2 */}
      <div className='product-section'>
        <div className='product-section-heading'>
          <h2>Personalized Clothing and Accessories</h2>
          <Link to="/products/type/Personalized Clothing and Accessories" className="view-all-button">View All</Link>
        </div>
        <div className='product-section-container'>
          {type2Products.length === 0 ? (
            <p>No Type 2 products available.</p>
          ) : (
            type2Products.slice(0, 4).map(product => (
              <div key={product._id} className='product-card' onClick={() => handleProductClick(product._id)}>
                <img src={product.images[0].url} alt="Product" className="product-image" />
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>{product.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 3 */}
      <div className='product-section'>
        <div className='product-section-heading'>
          <h2>DIY Kits and Craft Materials</h2>
          <Link to="/products/type/DIY Kits and Craft Materials" className="view-all-button">View All</Link>
        </div>
        <div className='product-section-container'>
          {type3Products.length === 0 ? (
            <p>No Type 3 products available.</p>
          ) : (
            type3Products.slice(0, 4).map(product => (
              <div key={product._id} className='product-card' onClick={() => handleProductClick(product._id)}>
                <img src={product.images[0].url} alt="Product" className="product-image" />
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>{product.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 4 */}
      <div className='product-section'>
        <div className='product-section-heading'>
          <h2>Customized Home and Gift Items</h2>
          <Link to="/products/type/Customized Home and Gift Items" className="view-all-button">View All</Link>
        </div>
        <div className='product-section-container'>
          {type4Products.length === 0 ? (
            <p>No Customized Home and Gift Items</p>
          ) : (
            type4Products.slice(0, 2).map(product => (
              <div key={product._id} className='product-card'>
                <img src={product.images[0].url} alt="Product" className="product-image" />
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Description: {product.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 5 */}
      <div className='product-section'>
        <div className='product-section-heading'>
          <h2>Sustainable and Upcycled Crafts</h2>
          <Link to="/products/type/Sustainable and Upcycled Crafts" className="view-all-button">View All</Link>
        </div>
        <div className='product-section-container'>
          {type5Products.length === 0 ? (
            <p>No Sustainable and Upcycled Crafts</p>
          ) : (
            type5Products.slice(0, 2).map(product => (
              <div key={product._id} className='product-card'>
                <img src={product.images[0].url} alt="Product" className="product-image" />
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Description: {product.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 6 */}
      <div className='product-section'>
        <div className='product-section-heading'>
          <h2>Limited Edition Collaborative Products</h2>
          <Link to="/products/type/Limited Edition Collaborative Products" className="view-all-button">View All</Link>
        </div>
        <div className='product-section-container'>
          {type6Products.length === 0 ? (
            <p>No Limited Edition Collaborative Products</p>
          ) : (
            type6Products.slice(0, 2).map(product => (
              <div key={product._id} className='product-card'>
                <img src={product.images[0].url} alt="Product" className="product-image" />
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
