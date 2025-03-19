import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../MAINcomponents/productCard';
import { Search, Sliders, X, ChevronDown, Star, StarHalf } from 'lucide-react';
import './ProductCategoryPage.css';

function CategoryProductsPage() {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [priceFilter, setPriceFilter] = useState(100000);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('featured');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [resultsCount, setResultsCount] = useState(0);

  const subcategories = {
    "Original Handmade Art and Decor": ["Paintings & Sculptures", "Wall Hangings", "Pottery & Ceramics", "Woodcrafts"],
    "Personalized Clothing and Accessories": ["Embroidered Apparel", "Handmade Jewelry", "Leather Goods"],
    "DIY Kits and Craft Materials": ["Candle & Soap Kits", "Embroidery & Sewing", "Woodworking Kits", "Home Decor DIY"],
    "Customized Home and Gift Items": ["Personalized Gifts", "Keepsake Boxes", "Customized Kitchenware"],
    "Sustainable and Upcycled Crafts": ["Upcycled Decor", "Eco-friendly Home Goods", "Garden & Planters"],
    "Limited Edition Collaborative Products": ["Exclusive Art", "Jewelry Collections", "Home Decor Collabs"]
  };

  const categorySubcategories = subcategories[decodedCategory] || [];

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch products when the category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5002/api/products/type/${encodeURIComponent(decodedCategory)}`);
        const fetchedProducts = response.data;

        setProducts(fetchedProducts);

        if (fetchedProducts.length > 0) {
          const prices = fetchedProducts.map(product => product.price);
          setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) });
          setPriceFilter(Math.max(...prices));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [decodedCategory]);

  // Apply filters and sorting when relevant states change
  useEffect(() => {
    let filtered = [...products];

    // Filter by price
    filtered = filtered.filter(product => product.price >= 0 && product.price <= priceFilter);

    // Filter by rating
    if (ratingFilter > 0) {
      filtered = filtered.filter(product => product.ratings?.averageRating >= ratingFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Filter by subcategory
    if (selectedSubcategory !== 'All') {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    // Apply sorting
    switch (sortOption) {
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.ratings?.averageRating || 0) - (a.ratings?.averageRating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default: // 'featured' or any other case
        // Keep original order or apply your featured logic here
        break;
    }

    setFilteredProducts(filtered);
    setResultsCount(filtered.length);
  }, [products, priceFilter, ratingFilter, searchTerm, selectedSubcategory, sortOption]);

  // Handlers
  const handleProductClick = (productId) => navigate(`/products/${productId}`);
  
  const resetFilters = () => {
    setSearchTerm('');
    setPriceFilter(priceRange.max);
    setRatingFilter(0);
    setSelectedSubcategory('All');
    setSortOption('featured');
  };

  // Render star rating display
  const RatingDisplay = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="star-icon filled" size={16} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="star-icon half-filled" size={16} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="star-icon empty" size={16} />);
    }
    
    return <div className="rating-display">{stars}</div>;
  };

  return (
    <div className="products-page">
      {/* Hero Banner */}
      <div className="category-hero-banner" style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(/assets/images/${decodedCategory.toLowerCase().replace(/\s+/g, '-')}-banner.jpg)` 
      }}>
        <div className="category-hero-content">
          <h1>{decodedCategory}</h1>
          <p>Discover unique and handcrafted items made with passion and skill</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="category-toolbar">
        <div className="search-filter-container">
          <div className="category-search-bar">
            <Search className="category-search-icon" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="category-search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="category-results-count">
            {resultsCount} {resultsCount === 1 ? 'product' : 'products'} found
          </div>

          <div className="category-sort-filter">
            <div className="sort-dropdown">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <ChevronDown size={16} className="sort-icon" />
            </div>

           
          </div>
        </div>
      </div>

      <div className="category-content-container">
        {/* Side Filters Panel (Desktop) or Expandable Panel (Mobile) */}
        <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
          <div className="filters-header">
            <h2>Refine Results</h2>
            {isMobile && (
              <button className="close-filters" onClick={() => setShowFilters(false)}>
                <X size={20} />
              </button>
            )}
          </div>

          {/* Subcategories Filter */}
          <div className="filter-group">
            <h3>Subcategories</h3>
            <div className="filter-options subcategory-options">
              <div className={`filter-option ${selectedSubcategory === 'All' ? 'selected' : ''}`}>
                <label>
                  <input
                    type="radio"
                    name="subcategory"
                    checked={selectedSubcategory === 'All'}
                    onChange={() => setSelectedSubcategory('All')}
                  />
                  <span>All Items</span>
                </label>
              </div>
              
              {categorySubcategories.map((subcat) => (
                <div 
                  key={subcat} 
                  className={`filter-option ${selectedSubcategory === subcat ? 'selected' : ''}`}
                >
                  <label>
                    <input
                      type="radio"
                      name="subcategory"
                      checked={selectedSubcategory === subcat}
                      onChange={() => setSelectedSubcategory(subcat)}
                    />
                    <span>{subcat}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h3>Price Range</h3>
            <div className="price-range-slider">
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={priceFilter}
                onChange={(e) => setPriceFilter(Number(e.target.value))}
                className="range-slider"
              />
              <div className="price-labels">
                <span>${priceRange.min}</span>
                <span className="price-value">Up to ${priceFilter}</span>
                <span>${priceRange.max}</span>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <h3>Minimum Rating</h3>
            <div className="rating-options">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div
                  key={rating}
                  className={`rating-option ${ratingFilter === rating ? 'selected' : ''}`}
                  onClick={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
                >
                  <RatingDisplay rating={rating} />
                  <span className="rating-label">{rating === 1 ? '& Up' : '& Up'}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="reset-filters-btn" onClick={resetFilters}>Reset All Filters</button>
        </div>

        {/* Main Content Area */}
        <div className="products-main-content">
          {/* Horizontal Subcategory Navigation (Optional for mobile) */}
          {categorySubcategories.length > 0 && isMobile && (
            <div className="subcategory-scroll">
              <button
                className={`subcategory-pill ${selectedSubcategory === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedSubcategory('All')}
              >
                All
              </button>
              {categorySubcategories.map((subcat) => (
                <button
                  key={subcat}
                  className={`subcategory-pill ${selectedSubcategory === subcat ? 'active' : ''}`}
                  onClick={() => setSelectedSubcategory(subcat)}
                >
                  {subcat}
                </button>
              ))}
            </div>
          )}

          {/* Products Grid */}
          <div className="products-container">
            {loading ? (
              <div className="products-grid loading-grid">
                {Array(9).fill(0).map((_, index) => (
                  <div key={index} className="product-card-skeleton">
                    <div className="skeleton skeleton-image"></div>
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-price"></div>
                    <div className="skeleton skeleton-rating"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-button">
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onClick={resetFilters} className="reset-search-btn">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryProductsPage;