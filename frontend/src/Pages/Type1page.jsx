import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../MAINcomponents/productCard';
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
  const handleQuickView = (productId) => console.log(`Quick view for product ${productId}`);
  const handleAddToCart = (productId) => console.log(`Added product ${productId} to cart`);

  const resetFilters = () => {
    setPriceRangeFilter([0, 1000]);
    setSearchTerm('');
    setCategoryFilter('All');
    setRatingFilter(0);
  };

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
        <button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
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
          <button className="reset-filters" onClick={resetFilters}>Reset Filters</button>
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
            {filteredCards.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onProductClick={handleProductClick}
                onQuickView={handleQuickView}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Type1ProductsPage;
