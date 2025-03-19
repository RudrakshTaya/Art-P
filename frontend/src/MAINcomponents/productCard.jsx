import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye, Package, CheckCircle, Award, Truck } from 'lucide-react';
import './productCard.css';
import { useCart } from '../Context/cartContext';
import { useAuth } from '../Components/useAuth';
import { useWishlist } from '../Context/wishlistContext';

const renderStars = (averageRating) => {
  const totalStars = 5;
  const filledStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;
  const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <>
      {[...Array(filledStars)].map((_, i) => (
        <Star key={`filled-${i}`} className="prcd_star_icon prcd_star_filled" />
      ))}
      {hasHalfStar && (
        <div className="prcd_half_star_container">
          <Star className="prcd_star_icon prcd_star_filled prcd_half" />
          <Star className="prcd_star_icon prcd_half_empty" />
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="prcd_star_icon" />
      ))}
    </>
  );
};

const ProductCard = ({ product, onProductClick }) => {
  const [processing, setProcessing] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { userId } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist: checkIfInWishlist } = useWishlist();

  useEffect(() => {
    if (userId) {
      setIsInWishlist(checkIfInWishlist(product._id));
    }
  }, [userId, product._id, checkIfInWishlist]);
console.log(product.stock)
  // Reset image loaded state when changing images
  useEffect(() => {
    setImageLoaded(false);
  }, [currentImageIndex]);

  // Image carousel effect
  useEffect(() => {
    if (product.images?.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, [product.images]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!userId) {
      alert('You need to be logged in to add items to the cart.');
      navigate('/signin');
      return;
    }

    setProcessing(true);
    try {
      await addToCart(product, 1);
      const successMessage = document.createElement('div');
      successMessage.className = 'prcd_toast_success';
      successMessage.innerHTML = `
        <div class="prcd_toast_icon"><CheckCircle size={18} /></div>
        <div>Added to cart successfully!</div>
      `;
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        document.body.removeChild(successMessage);
        navigate('/cart');
      }, 2000);
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
      } else {
        await addToWishlist(product);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error managing wishlist:', error);
      alert('An error occurred while managing your wishlist. Please try again later.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle image load event
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Calculate discount percentage if not provided
  const discountPercent = product.discountPercentage || 
    (product.originalPrice && product.price < product.originalPrice ? 
      Math.round((1 - product.price / product.originalPrice) * 100) : 0);

  return (
    <div className="prcd_product_card" onClick={() => onProductClick(product._id)}>
      {/* Badges */}
      <div className="prcd_badge_container">
        {product.isNew && <span className="prcd_badge prcd_badge_new">New</span>}
        {discountPercent > 0 && (
          <span className="prcd_badge prcd_badge_sale">-{discountPercent}%</span>
        )}
        {product.freeShipping && (
          <span className="prcd_badge prcd_badge_shipping">Free Shipping</span>
        )}
      </div>
      
      {/* Optimized Image container */}
      <div className="prcd_product_image_container">
        {/* Loading skeleton */}
        <div className={`prcd_image_skeleton ${imageLoaded ? 'prcd_hidden' : ''}`}>
          <div className="prcd_skeleton_animation"></div>
        </div>
        
        <div className="prcd_image_slider" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
          {(product.images && product.images.length > 0) ? 
            product.images.map((image, index) => (
              <div key={`img-wrapper-${index}`} className="prcd_image_wrapper">
                <img 
                  key={`img-${index}`}
                  src={image.url || '/default-image.png'} 
                  alt={`${product.name} - view ${index + 1}`}
                  className={`prcd_product_image ${currentImageIndex === index && imageLoaded ? 'prcd_visible' : ''}`}
                  onLoad={currentImageIndex === index ? handleImageLoad : undefined}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            )) : 
            <div className="prcd_image_wrapper">
              <img 
                src="/default-image.png" 
                alt={product.name}
                className="prcd_product_image prcd_visible"
                onLoad={handleImageLoad}
              />
            </div>
          }
        </div>
        
        {/* Image indicators for multiple images */}
        {product.images && product.images.length > 1 && (
          <div className="prcd_image_indicators">
            {product.images.map((_, index) => (
              <span 
                key={`indicator-${index}`} 
                className={`prcd_indicator ${currentImageIndex === index ? 'prcd_active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="prcd_product_actions">
          <button 
            className={`prcd_action_button prcd_wishlist_button ${isInWishlist ? 'prcd_active' : ''}`} 
            onClick={handleAddToWishlist}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`prcd_icon ${isInWishlist ? 'prcd_heart_filled' : ''}`} />
          </button>
          <button 
            className="prcd_action_button prcd_quick_view_button" 
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product._id);
            }}
            aria-label="Quick view"
          >
            <Eye className="prcd_icon" />
          </button>
        </div>
      </div>
      
      {/* Product details */}
      <div className="prcd_product_info">
        {/* Brand name if available */}
        {product.brand && (
          <div className="prcd_product_brand">{product.brand}</div>
        )}
        
        <h3 className="prcd_product_name">{product.name}</h3>
        
        {/* Rating display */}
        <div className="prcd_product_rating">
          {renderStars(product.ratings.averageRating)}
          <span className="prcd_rating_count">({product.ratings.reviewCount})</span>
          {product.ratings.averageRating >= 4.5 && (
            <span className="prcd_top_rated">
              <Award className="prcd_award_icon" />
              Top Rated
            </span>
          )}
        </div>
        
        {/* Price display */}
        <div className="prcd_product_price_container">
          {product.originalPrice && product.originalPrice > product.price ? (
            <>
              <span className="prcd_original_price">₹{product.originalPrice.toFixed(2)}</span>
              <span className="prcd_current_price">₹{product.price.toFixed(2)}</span>
              <span className="prcd_save_amount">Save ₹{(product.originalPrice - product.price).toFixed(2)}</span>
            </>
          ) : (
            <span className="prcd_current_price">₹{product.price.toFixed(2)}</span>
          )}
        </div>
        
        {/* Product features highlights */}
        <div className="prcd_product_features">
          {product.stock >0  ? (
            <div className="prcd_feature">
              <CheckCircle className="prcd_feature_icon prcd_in_stock" />
              <span>In Stock</span>
            </div>
          ) : (
            <div className="prcd_feature">
              <Package className="prcd_feature_icon prcd_out_stock" />
              <span>Out of Stock</span>
            </div>
          )}
          
          {product.freeShipping && (
            <div className="prcd_feature">
              <Truck className="prcd_feature_icon" />
              <span>Free Shipping</span>
            </div>
          )}
        </div>
        
        {/* Product description */}
        <p className="prcd_product_description">
          {product.description.length > 65 
            ? `${product.description.substring(0, 65)}...` 
            : product.description}
        </p>
        
        {/* Add to cart button */}
        <button className="prcd_add_to_cart_button" onClick={handleAddToCart} disabled={processing || !product.stock}>
          <ShoppingCart className="prcd_cart_icon" />
          {processing ? 'Adding...' : !product.stock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;