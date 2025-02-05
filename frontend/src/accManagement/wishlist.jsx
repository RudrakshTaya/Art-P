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
    return <p className="error-message">Error: Wishlist data is not in the correct format.</p>;
  }

  return (
    <div className="wishlist-page">
      <h1 className="wishlist-title">Your Curated Collection</h1>
      {wishlist.length === 0 ? (
        <p className="empty-wishlist">Your wishlist is waiting to be filled with amazing finds!</p>
      ) : (
        <div className="wishlist-items">
          {wishlist.map((item) => (
            <div className="wishlist-item" key={item._id}>
              <div className="wishlist-item-image-container">
                <img
                  src={item.productId.images[0]?.url || '/default-image.png'}
                  alt={item.productId.name}
                  className="wishlist-item-image"
                  onClick={() => handleViewProduct(item.productId._id)}
                />
                <div className="wishlist-item-overlay">
                  <button 
                    className="view-button"
                    onClick={() => handleViewProduct(item.productId._id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
              <div className="wishlist-item-details">
                <h3 className="wishlist-item-name">{item.productId.name}</h3>
                <p className="wishlist-item-brand">{item.productId.brand}</p>
                <p className="wishlist-item-price">${item.productId.price.toFixed(2)}</p>
                {item.productId.discount.percentage > 0 && (
                  <p className="wishlist-item-discount">
                    {item.productId.discount.percentage}% OFF
                  </p>
                )}
                <div className="wishlist-item-actions">
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveFromWishlist(item.productId._id)}
                  >
                    Remove
                  </button>
                  <p className="wishlist-item-date">
                    Added on {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
