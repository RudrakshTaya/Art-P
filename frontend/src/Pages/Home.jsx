import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../MAINcomponents/productCard";
import "./Home.css";

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);

        // Fetch Featured Products
        const featuredRes = await axios.get("http://localhost:5002/api/products");
        setFeaturedProducts(featuredRes.data);

        // Fetch Trending Products
        const trendingRes = await axios.get("http://localhost:5002/api/products");
        setTrendingProducts(trendingRes.data);

        // Fetch Featured Artists
        //const artistsRes = await axios.get("http://localhost:5002/api/artists/featured");
        //setFeaturedArtists(artistsRes.data);
        
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

   

    fetchHomeData();
  }, []);
  const shopNow = async () => {
    navigate("/menu");  // ✅ Corrected string format
};

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Unique Art & Crafts</h1>
          <p>Support independent artists and find one-of-a-kind creations</p>
          <div className="search-bar">
            <input type="text" placeholder="Search for arts, crafts, or artists..." />
            <button>Search</button>
          </div>
          <div className="hero-buttons">
            <button  onClick={shopNow}  className="primary-btn">Shop Now</button>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Featured Products Section */}
      <section className="products-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <a href="/products?featured=true" className="view-all">View All</a>
        </div>
        {isLoading ? (
          <div className="loading">Loading featured products...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} onProductClick={() => navigate(`/products/${product._id}`)} />
            ))}
          </div>
        )}
      </section>

      {/* Banner Section */}
      <section className="banner">
        <div className="banner-content">
          <h2>Custom Art Just For You</h2>
          <p>Commission unique pieces directly from talented artists</p>
          <button className="primary-btn">Request Custom Art</button>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="products-section trending">
        <div className="section-header">
          <h2>Trending Now</h2>
          <a href="/products?trending=true" className="view-all">View All</a>
        </div>
        {isLoading ? (
          <div className="loading">Loading trending products...</div>
        ) : (
          <div className="products-grid">
            {trendingProducts.map(product => (
              <ProductCard key={product._id} product={product} onProductClick={() => navigate(`/products/${product._id}`)} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Artists Section */}
      <section className="artists-section">
        <div className="section-header">
          <h2>Featured Artists</h2>
          <a href="/artists" className="view-all">View All</a>
        </div>
        {isLoading ? (
          <div className="loading">Loading featured artists...</div>
        ) : (
          <div className="artists-grid">
            {featuredArtists.map(artist => (
              <div className="artist-card" key={artist._id}>
                <div className="artist-image">
                  <img src={artist.image || "/default-artist.png"} alt={artist.name} />
                </div>
                <div className="artist-info">
                  <h3>{artist.name}</h3>
                  <p className="specialty">{artist.specialty || "Independent Artist"}</p>
                  <div className="artist-rating">
                    <span className="stars">★★★★★</span>
                    <span className="rating-value">{artist.rating || "New"}</span>
                  </div>
                  <button className="view-profile">View Profile</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
