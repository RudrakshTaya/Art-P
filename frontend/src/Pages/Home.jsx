import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../MAINcomponents/productCard";
import { FaSearch, FaShoppingBag, FaPalette, FaRegStar } from "react-icons/fa";
import "./Home.css";

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);

        // Fetch Featured Products
        const featuredRes = await axios.get("http://localhost:5002/api/products");
        setFeaturedProducts(featuredRes.data.slice(0, 4)); // Limit to 4 items

        // Fetch Trending Products
        const trendingRes = await axios.get("http://localhost:5002/api/products");
        // In a real app, you would have a different endpoint or parameter for trending
        setTrendingProducts(trendingRes.data.slice(0, 4)); // Limit to 4 items

        // Placeholder for Featured Artists until API is ready
        setFeaturedArtists([
          { _id: "1", name: "Sarah Miller", specialty: "Watercolor", rating: 4.9, image: "/default-artist.png" },
          { _id: "2", name: "David Chen", specialty: "Digital Art", rating: 4.8, image: "/default-artist.png" },
          { _id: "3", name: "Emma Roberts", specialty: "Ceramics", rating: 4.7, image: "/default-artist.png" }
        ]);
        
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const shopNow = () => {
    navigate("/menu");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  const handleCustomArt = () => {
    navigate("/custom-request");
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="star full">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="star half">★</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content container">
          <h1>Discover Unique Art & Crafts</h1>
          <p className="hero-subtitle">Support independent artists and find one-of-a-kind creations</p>
          <form onSubmit={handleSearch} className="search-bar">
            <input 
              type="text" 
              placeholder="Search for arts, crafts, or artists..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
            <button type="submit" aria-label="Search">
              <FaSearch />
              <span>Search</span>
            </button>
          </form>
          <div className="hero-buttons">
            <button onClick={shopNow} className="primary-btn">
              <FaShoppingBag className="btn-icon" />
              <span>Shop Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && <div className="error-message container">{error}</div>}

      {/* Featured Products Section */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <a href="/products?featured=true" className="view-all">View All</a>
          </div>
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading featured products...</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.length > 0 ? (
                featuredProducts.map(product => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    onProductClick={() => navigate(`/products/${product._id}`)} 
                  />
                ))
              ) : (
                <p className="no-products">No featured products available at this time.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Banner Section */}
      <section className="banner">
        <div className="banner-content container">
          <h2>Custom Art Just For You</h2>
          <p>Commission unique pieces directly from talented artists</p>
          <button onClick={handleCustomArt} className="primary-btn">
            <FaPalette className="btn-icon" />
            <span>Request Custom Art</span>
          </button>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="products-section trending">
        <div className="container">
          <div className="section-header">
            <h2>Trending Now</h2>
            <a href="/products?trending=true" className="view-all">View All</a>
          </div>
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading trending products...</p>
            </div>
          ) : (
            <div className="products-grid">
              {trendingProducts.length > 0 ? (
                trendingProducts.map(product => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    onProductClick={() => navigate(`/products/${product._id}`)} 
                  />
                ))
              ) : (
                <p className="no-products">No trending products available at this time.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="artists-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Artists</h2>
            <a href="/artists" className="view-all">View All</a>
          </div>
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading featured artists...</p>
            </div>
          ) : (
            <div className="artists-grid">
              {featuredArtists.length > 0 ? (
                featuredArtists.map(artist => (
                  <div className="artist-card" key={artist._id} onClick={() => navigate(`/artists/${artist._id}`)}>
                    <div className="artist-image">
                      <img src={artist.image || "/default-artist.png"} alt={artist.name} />
                    </div>
                    <div className="artist-info">
                      <h3>{artist.name}</h3>
                      <p className="specialty">{artist.specialty || "Independent Artist"}</p>
                      <div className="artist-rating">
                        <div className="stars">{renderStars(artist.rating || 0)}</div>
                        <span className="rating-value">{artist.rating || "New"}</span>
                      </div>
                      <button className="view-profile">View Profile</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-artists">No featured artists available at this time.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
     
    </div>
  );
}

export default HomePage;