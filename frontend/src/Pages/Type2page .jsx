import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Type1page.css';
function Type1ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [priceRangeFilter, setPriceRangeFilter] = useState([0, 1000]); // Default price range
  const [searchTerm, setSearchTerm] = useState(''); // Add search term state
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    // Fetch products of type 'Type1' from the backend
    axios
      .get('http://localhost:5002/api/products/type/Type-2')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Type1 products:', error);
      });
  }, []);

  // Filter cards whenever filters change
  useEffect(() => {
    let filtered = products;

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRangeFilter[0] &&
        product.price <= priceRangeFilter[1]
    );

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCards(filtered);
  }, [priceRangeFilter, searchTerm, products]);

  // Function to handle the product click
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`); // Navigate to the Product Detail page with the product ID
  };

  return (
    <div className="products-page">


     
<div className='product-section'>
      {/* Filter Section */}
      <div className="Filter">
       
        <div className="price-range-filter">
          <h3>Price Range</h3>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRangeFilter[1]}
              onChange={(e) =>
                setPriceRangeFilter([0, parseInt(e.target.value)])
              }
            />
            <span>Price Range: $0 - ${priceRangeFilter[1]}</span>
          </div>
        </div>
      </div>

      <div className="Products-container">
      
       <div className="search-bar">
     
        <input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
      </div>
      <div className='products'>
        {filteredCards.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredCards.map((product) => (
            <div
              key={product._id}
              className="product-card"
              onClick={() => handleProductClick(product._id)} // Add onClick event
            >
              <img
                src={product.imageLink}
                alt="Product"
                className="shop-card-image"
              />
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>{product.description}</p>
            </div>
          ))
        )}
        
        </div>
        
      </div>
      
      </div>
      <div><h2>hello</h2></div>
     
    </div>
   
  );
}

export default Type1ProductsPage;
