import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Filter, X } from 'lucide-react';
import ProductCard from '../MAINcomponents/productCard';
import './menu.css';

const productTypes = [
  'Original Handmade Art and Decor',
  'Personalized Clothing and Accessories',
  'DIY Kits and Craft Materials',
  'Customized Home and Gift Items',
  'Sustainable and Upcycled Crafts',
  'Limited Edition Collaborative Products',
];

function MenuPage() {
  const [products, setProducts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const responses = await Promise.all(
        productTypes.map((type) =>
          axios.get(`http://localhost:5002/api/products/type/${encodeURIComponent(type)}`)
        )
      );
      const newProducts = Object.fromEntries(
        responses.map((response, index) => [productTypes[index], response.data])
      );
      setProducts(newProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const intervalId = setInterval(fetchProducts, 60000); // Refresh every 60 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const filteredProducts = Object.entries(products).reduce((acc, [type, typeProducts]) => {
    const filtered = typeProducts?.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (activeCategory === 'All' || activeCategory === type) {
      acc[type] = filtered;
    }
    return acc;
  }, {});

  const toggleMobileFilter = () => {
    setShowMobileFilter(!showMobileFilter);
  };

  const totalProductCount = Object.values(filteredProducts).flat().length;

  return (
    <div className="shop-container">
      {/* Hero Banner */}
      <div className="shop-hero">
        <div className="shop-hero-content">
          <h1>Handcrafted with Love</h1>
          <p>Discover unique creations made by talented artisans</p>
          <div className="shop-hero-search">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="shop-content">
        {/* Mobile Filter Toggle */}
        <button className="mobile-filter-toggle" onClick={toggleMobileFilter}>
          <Filter size={18} />
          <span>Filter Products</span>
        </button>

        {/* Category Navigation */}
        <aside className={`shop-sidebar ${showMobileFilter ? 'active' : ''}`}>
          <div className="sidebar-header">
            <h3>Categories</h3>
            <button className="close-sidebar" onClick={toggleMobileFilter}>
              <X size={24} />
            </button>
          </div>
          <div className="category-list">
            <button
              className={`category-item ${activeCategory === 'All' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('All');
                if (showMobileFilter) toggleMobileFilter();
              }}
            >
              <span>All Products</span>
              <span className="product-count">{Object.values(products).flat().length}</span>
            </button>
            {productTypes.map((type) => (
              <button
                key={type}
                className={`category-item ${activeCategory === type ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(type);
                  if (showMobileFilter) toggleMobileFilter();
                }}
              >
                <span>{type}</span>
                <span className="product-count">{products[type]?.length || 0}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Products Display */}
        <main className="shop-products">
          <div className="products-header">
            <h2>{activeCategory === 'All' ? 'All Products' : activeCategory}</h2>
            <p className="results-count">{totalProductCount} items found</p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="products-grid">
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="product-card-skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-title"></div>
                      <div className="skeleton-price"></div>
                      <div className="skeleton-button"></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : totalProductCount === 0 ? (
            <div className="no-products">
              <ShoppingBag size={48} />
              <h3>No products found</h3>
              <p>Try adjusting your search or filter to find what you're looking for.</p>
              {searchTerm && (
                <button className="reset-search" onClick={() => setSearchTerm('')}>
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="products-sections">
              {Object.entries(filteredProducts).map(([type, typeProducts]) => {
                if (!typeProducts || typeProducts.length === 0) return null;
                
                return (
                  <section key={type} className="product-section">
                    {activeCategory === 'All' && (
                      <div className="section-header">
                        <h3>{type}</h3>
                        <Link to={`/products/type/${encodeURIComponent(type)}`} className="view-all">
                          View All
                        </Link>
                      </div>
                    )}
                    <div className="products-grid">
                      {typeProducts.slice(0, activeCategory === 'All' ? 4 : undefined).map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          onProductClick={handleProductClick}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Join Our Creative Community</h2>
          <p>Subscribe to receive updates on new arrivals, special offers and artisan stories.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button type="submit">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MenuPage;