import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import './productCard.css';
import { useCart } from '../Context/cartContext';
import { useAuth } from '../Components/useAuth';
import { useWishlist } from '../Context/wishlistContext';

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
  const [processing, setProcessing] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { userId } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist: checkIfInWishlist } = useWishlist();

  useEffect(() => {
    if (userId) {
      setIsInWishlist(checkIfInWishlist(product._id));
    }
  }, [userId, product._id, checkIfInWishlist]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!userId) {
      alert('You need to be logged in to add items to the cart.');
      navigate('/signin');
      return;
    }

    setProcessing(true);
    try {
      await addToCart(product, 1); // Assuming quantity is 1
      alert('Added to cart successfully!');
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred while adding to cart. Please try again later.');
    } finally {
      setProcessing(false);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    if (!userId) {
      alert('You need to be logged in to add items to your wishlist.');
      navigate('/signin');
      return;
    }

    setProcessing(true);
    try {
      if (isInWishlist) {
        await removeFromWishlist(product._id);
        setIsInWishlist(false);
        alert('Removed from wishlist');
      } else {
        await addToWishlist(product);
        setIsInWishlist(true);
        alert('Added to wishlist');
      }
    } catch (error) {
      console.error('Error managing wishlist:', error);
      alert('An error occurred while managing your wishlist. Please try again later.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="classy-product-card" onClick={() => onProductClick(product._id)}>
      <div className="classy-product-card-header">
        <h3 className="classy-product-name">{product.name}</h3>
        <button className="classy-favorite-button" onClick={handleAddToWishlist}>
          <Heart className={`classy-icon ${isInWishlist ? 'filled-heart' : ''}`} />
          
        </button>
      </div>
      <div className="classy-product-card-content">
        <img
          src={product.images[0]?.url || '/default-image.png'} // Fallback for missing image
          alt={product.name}
          className="classy-product-image"
        />
        <div className="classy-product-overlay">
          <button className="classy-quick-view-button">Quick View</button>
        </div>
      </div>
      <div className="classy-product-card-footer">
        <p className="classy-product-price">₹{product.price.toFixed(2)}</p>
        <div className="classy-product-rating">
          {renderStars(product.ratings.averageRating)}
          <span className="classy-rating-count">({product.ratings.reviewCount})</span>
        </div>
        <p className="classy-product-description">{product.description}</p>
        <button
          className="classy-add-to-cart-button"
          onClick={handleAddToCart}
          disabled={processing}
        >
          <ShoppingCart className="classy-icon" />
          {processing ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
