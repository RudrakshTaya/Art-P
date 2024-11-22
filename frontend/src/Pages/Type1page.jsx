import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Type1page.css';

function Type1ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [priceRangeFilter, setPriceRangeFilter] = useState([0, 1000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5002/api/products/type/Original Handmade Art and Decor')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = products;

    filtered = filtered.filter(
      (product) => product.price >= priceRangeFilter[0] && product.price <= priceRangeFilter[1]
    );

    if (categoryFilter !== 'All') {
      filtered = filtered.filter((product) => product.attributes === categoryFilter);
    }

    if (ratingFilter > 0) {
      filtered = filtered.filter((product) => product.ratings?.averageRating >= ratingFilter);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCards(filtered);
  }, [priceRangeFilter, categoryFilter, ratingFilter, searchTerm, products]);

  const handleProductClick = (productId) => navigate(`/products/${productId}`);

  return (
    <div className="products-page">
    
    
    <h1 className="page-title">Original Handmade Art and Decor</h1>
    

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filters-button">
          <button onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-section">
          <div className="filter">
            <h3>Price Range</h3>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRangeFilter[1]}
              onChange={(e) => setPriceRangeFilter([0, Number(e.target.value)])}
            />
            <p>Up to ${priceRangeFilter[1]}</p>
          </div>

          <div className="filter">
            <h3>Minimum Rating</h3>
            <select value={ratingFilter} onChange={(e) => setRatingFilter(Number(e.target.value))}>
              <option value="0">All Ratings</option>
              <option value="1">1 Star & Above</option>
              <option value="2">2 Stars & Above</option>
              <option value="3">3 Stars & Above</option>
              <option value="4">4 Stars & Above</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
        </div>
      )}

      <div className="category-inline">
        {['All', 'Paintings and Sculptures', 'Wall Hangings and Tapestries', 'Handmade Pottery and Ceramics', 'Decorative Woodcrafts'].map((category) => (
          <span
            key={category}
            className={`category-text ${categoryFilter === category ? 'active' : ''}`}
            onClick={() => setCategoryFilter(category)}
          >
            {category}
          </span>
        ))}
      </div>















      <div className="products-container">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredCards.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="products-grid">
            {filteredCards.map((product) => {
              const discountedPrice = product.discount?.percentage
                ? (product.price * (1 - product.discount.percentage / 100)).toFixed(2)
                : product.price;

              return (
                <div
                key={product._id}
                className="product-card"
                onClick={() => handleProductClick(product._id)}
              >
                <div className="product-image-container">
                  <img
                    src={product.images[0]?.url || '/placeholder-image.png'}
                    alt={product.images[0]?.altText || 'Product'}
                    className="product-image"
                  />
                  {product.discount?.percentage && (
                    <span className="discount-badge">
                      {product.discount.percentage}% OFF
                    </span>
                  )}
                </div>
                <hr className="divider" />
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <div className="price-container">
                    {product.discount?.percentage ? (
                      <>
                        <span className="discounted-price">
                          ${(
                            product.price -
                            (product.price * product.discount.percentage) / 100
                          ).toFixed(2)}
                        </span>
                        <span className="original-price">${product.price}</span>
                      </>
                    ) : (
                      <span className="discounted-price">${product.price}</span>
                    )}
                  </div>
                  <p>Rating: {product.ratings?.averageRating || 'N/A'}</p>
                </div>
              </div>
              
              
              );
            })}
          </div>
        )}
      </div>







      <div class="footer">
  <div class="footer-container">
    <div class="footer-column">
      <h4>About Us</h4>
      <p>
        Discover unique, handmade, and creative products crafted with love and passion. 
        Our mission is to bring the finest art and creativity to your doorstep.
      </p>
    </div>

    <div class="footer-column">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="/shop">Shop</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/terms">Terms of Service</a></li>
      </ul>
    </div>

    <div class="footer-column">
      <h4>Contact Us</h4>
      <p>Email: <a href="mailto:support@example.com">support@example.com</a></p>
      <p>Phone: <a href="tel:+1234567890">+1 234 567 890</a></p>
      <p>Address: 123 Creative Lane, Art City, World</p>
    </div>

    <div class="footer-column">
      <h4>Follow Us</h4>
      <div class="social-icons">
        <a href="#"><i class="fab fa-facebook-f"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-pinterest-p"></i></a>
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    <p>&copy; 2024 Your E-Commerce Site. All Rights Reserved.</p>
  </div>
</div>

    </div>

    
  );
}

export default Type1ProductsPage;
