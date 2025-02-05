import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
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
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const responses = await Promise.all(
        productTypes.map((type) =>
          axios.get(`https://art-p.vercel.app/api/products/type/${encodeURIComponent(type)}`)
        )
      );
      const newProducts = Object.fromEntries(
        responses.map((response, index) => [productTypes[index], response.data])
      );
      setProducts(newProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  return (
    <div className="classy-menu-page">
      <header className="classy-menu-header">
        <h1 className="classy-menu-title">Discover Unique Creations</h1>
        <div className="classy-search-bar">
          <Search className="classy-search-icon" />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="classy-search-input"
          />
        </div>
      </header>

      <nav className="classy-category-nav">
        <button
          className={`classy-category-button ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        {productTypes.map((type) => (
          <button
            key={type}
            className={`classy-category-button ${activeCategory === type ? 'active' : ''}`}
            onClick={() => setActiveCategory(type)}
          >
            {type}
          </button>
        ))}
      </nav>

      {Object.entries(filteredProducts).map(([type, typeProducts]) => (
        <section key={type} className="classy-product-section">
          <div className="classy-product-section-heading">
            <h2 className="classy-product-section-title">{type}</h2>
            <Link to={`/products/type/${encodeURIComponent(type)}`} className="classy-view-all-button">
              View All
            </Link>
          </div>
          <div className="classy-product-grid">
            {typeProducts ? (
              typeProducts.length === 0 ? (
                <p className="classy-no-products-message">No products available for {type}.</p>
              ) : (
                typeProducts.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onProductClick={handleProductClick}
                  />
                ))
              )
            ) : (
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="classy-product-card-skeleton">
                    <div className="classy-product-card-header">
                      <div className="classy-skeleton classy-skeleton-title"></div>
                    </div>
                    <div className="classy-product-card-content">
                      <div className="classy-skeleton classy-skeleton-image"></div>
                    </div>
                    <div className="classy-product-card-footer">
                      <div className="classy-skeleton classy-skeleton-text"></div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

export default MenuPage;
