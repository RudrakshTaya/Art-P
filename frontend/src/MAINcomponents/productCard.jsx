// ProductCard.js
import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import './productCard.css';

const renderStars = (averageRating) => {
  const totalStars = 5;
  const filledStars = Math.floor(averageRating);
  const emptyStars = totalStars - filledStars;

  return (
    <>
      {[...Array(filledStars)].map((_, i) => (
        <Star key={`filled-${i}`} className="classy-icon filled" />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="classy-icon" />
      ))}
    </>
  );
};

const ProductCard = ({ product, onProductClick }) => {
  return (
    <div className="classy-product-card" onClick={() => onProductClick(product._id)}>
      <div className="classy-product-card-header">
        <h3 className="classy-product-name">{product.name}</h3>
        <button className="classy-favorite-button">
          <Heart className="classy-icon" />
        </button>
      </div>
      <div className="classy-product-card-content">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="classy-product-image"
        />
        <div className="classy-product-overlay">
          <button className="classy-quick-view-button">Quick View</button>
        </div>
      </div>
      <div className="classy-product-card-footer">
        <p className="classy-product-price">${product.price.toFixed(2)}</p>
        <div className="classy-product-rating">
          {renderStars(product.ratings.averageRating)}
          <span className="classy-rating-count">({product.ratings.reviewCount})</span>
        </div>
        <p className="classy-product-description">{product.description}</p>
        <button className="classy-add-to-cart-button">
          <ShoppingCart className="classy-icon" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;