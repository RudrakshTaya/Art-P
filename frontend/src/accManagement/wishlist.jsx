import React from 'react';
import { useWishlist } from '../Context/wishlistContext';
import { useNavigate } from 'react-router-dom';
import './wishlist.css';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!Array.isArray(wishlist)) {
    return (
      <div className="wishlist__error">
        <div className="wishlist__error-content">
          <h2>Something went wrong</h2>
          <p className="wishlist__error-message">Error: Wishlist data is not in the correct format.</p>
          <button onClick={() => navigate('/')} className="wishlist__error-button">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist">
      <div className="wishlist__header">
        <h1 className="wishlist__title">My Wishlist</h1>
        <div className="wishlist__actions">
          <button 
            className="wishlist__continue-shopping" 
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist__empty">
          <div className="wishlist__empty-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h2 className="wishlist__empty-title">Your wishlist is empty</h2>
          <p className="wishlist__empty-text">Explore our collections and add your favorite items to your wishlist.</p>
          <button 
            className="wishlist__empty-button" 
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="wishlist__stats">
            <span className="wishlist__count">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</span>
          </div>
          <div className="wishlist__items">
            {wishlist.map((item) => (
              <div className="wishlist__item" key={item._id}>
                <div className="wishlist__item-image-container">
                  <img
                    src={item.productId.images[0]?.url || '/default-image.png'}
                    alt={item.productId.name}
                    className="wishlist__item-image"
                  />
                  <div className="wishlist__item-actions-overlay">
                    <button
                      className="wishlist__view-button"
                      onClick={() => handleViewProduct(item.productId._id)}
                    >
                      View Product
                    </button>
                  </div>
                </div>
                <div className="wishlist__item-details">
                  <div className="wishlist__item-header">
                    <h3 className="wishlist__item-name">{item.productId.name}</h3>
                    <button
                      className="wishlist__remove-button"
                      onClick={() => handleRemoveFromWishlist(item.productId._id)}
                      aria-label="Remove from wishlist"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <div className="wishlist__item-brand">{item.productId.brand}</div>
                  <div className="wishlist__item-price-container">
                    <span className="wishlist__item-price">${item.productId.price.toFixed(2)}</span>
                    {item.productId.discount.percentage > 0 && (
                      <span className="wishlist__item-discount">
                        {item.productId.discount.percentage}% OFF
                      </span>
                    )}
                  </div>
                  <div className="wishlist__item-date">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;