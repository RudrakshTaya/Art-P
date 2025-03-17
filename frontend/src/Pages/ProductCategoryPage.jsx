import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../MAINcomponents/productCard';
import { Search, Sliders } from 'lucide-react';
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

  const subcategories = {
    "Original Handmade Art and Decor": ["Paintings & Sculptures", "Wall Hangings", "Pottery & Ceramics", "Woodcrafts"],
    "Personalized Clothing and Accessories": ["Embroidered Apparel", "Handmade Jewelry", "Leather Goods"],
    "DIY Kits and Craft Materials": ["Candle & Soap Kits", "Embroidery & Sewing", "Woodworking Kits", "Home Decor DIY"],
    "Customized Home and Gift Items": ["Personalized Gifts", "Keepsake Boxes", "Customized Kitchenware"],
    "Sustainable and Upcycled Crafts": ["Upcycled Decor", "Eco-friendly Home Goods", "Garden & Planters"],
    "Limited Edition Collaborative Products": ["Exclusive Art", "Jewelry Collections", "Home Decor Collabs"]
  };

  const categorySubcategories = subcategories[decodedCategory] || [];

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

  // Apply filters when relevant states change
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

    setFilteredProducts(filtered);
  }, [products, priceFilter, ratingFilter, searchTerm, selectedSubcategory]);

  // Handlers
  const handleProductClick = (productId) => navigate(`/products/${productId}`);
  const resetFilters = () => {
    setSearchTerm('');
    setPriceFilter(priceRange.max);
    setRatingFilter(0);
    setSelectedSubcategory('All');
  };

  return (
    <div className="products-page">
    <header className='category-page-header'>
  <h1 className="category-page-title">{decodedCategory}</h1>

  <div className="search-filter-container">
    {/* SEARCH BAR */}
    <div className="category-search-bar">
      <Search className="category-search-icon" />
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="category-search-input"
      />
    </div>

    {/* FILTER TOGGLE BUTTON */}
    <button className="filters-toggle" onClick={() => setShowFilters(!showFilters)}>
      <Sliders size={18} /> {showFilters ? 'Hide' : ''}
    </button>
  </div>
</header>


      {/* SUBCATEGORIES SECTION */}
      {categorySubcategories.length > 0 && (
        <div className="category-category-nav">
          <button
            className={`category-category-button ${selectedSubcategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedSubcategory('All')}
          >
            All
          </button>
          {categorySubcategories.map((subcat) => (
            <button
              key={subcat}
              className={`category-category-button  ${selectedSubcategory === subcat ? 'active' : ''}`}
              onClick={() => setSelectedSubcategory(subcat)}
            >
              {subcat}
            </button>
          ))}
        </div>
      )}

      {/* FILTERS SECTION */}
      {showFilters && (
        <div className="filters-section">
          <div className="filter">
            <h3>Price Range</h3>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={priceFilter}
              onChange={(e) => setPriceFilter(Number(e.target.value))}
            />
            <p>Up to ${priceFilter}</p>
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

      {/* PRODUCT LISTING */}
      <div className="products-container">
        {loading ? (
          <div className="loading-grid">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="product-card-skeleton">
                <div className="skeleton skeleton-image"></div>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found.</p>
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
  );
}

export default CategoryProductsPage;
