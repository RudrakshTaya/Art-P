import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../Context/cartContext';
import { useAuth } from '../Components/useAuth';
import { Star, StarHalf } from 'lucide-react';
import './productDetailPage.css';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/products/${productId}`);
        setProduct(response.data);
        // Fetch related products
        const relatedResponse = await axios.get(`http://localhost:5002/api/products/type/Original Handmade Art and Decor`);
        setRelatedProducts(relatedResponse.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!userId) {
      alert('You need to be logged in to add items to the cart.');
      navigate('/signin');
      return;
    }
    
    setProcessing(true);
    try {
      await addToCart(product, quantity);
      alert('Added to cart successfully!');
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred while adding to cart. Please try again later.');
    } finally {
      setProcessing(false);
    }
  };

  const handleBuyNow = async () => {
    if (!userId) {
      alert('You need to be logged in to complete the purchase.');
      navigate('/signin');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('http://localhost:5002/api/placeorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity,
          adminId: product.adminId,
        }),
      });

      if (response.ok) {
        alert('Purchase successful!');
        navigate('/confirmation');
      } else {
        const errorData = await response.json();
        alert(`Failed to complete purchase: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      alert('An error occurred during purchase. Please try again later.');
    } finally {
      setProcessing(false);
    }
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="pd-star" fill="currentColor" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="pd-star" fill="currentColor" />);
    }

    return stars;
  };

  if (loading) {
    return <p className="pd-loading">Loading product details...</p>;
  }

  if (error) {
    return <div className="pd-error">Error: {error}</div>;
  }

  if (!product) {
    return <div className="pd-not-found">Product not found.</div>;
  }

  return (
    <div className="pd-container">
      <div className="pd-breadcrumb">
        <Link to="/">Home</Link> &gt; <Link to="/category">Category</Link> &gt; {product.name}
      </div>
      <div className="pd-content">
        <div className="pd-image-gallery">
          {product.images && product.images.length > 0 ? (
            <>
              <img 
                className="pd-main-image"
                src={product.images[currentImageIndex]?.url} 
                alt={`${product.name} ${currentImageIndex + 1}`} 
              />
              <div className="pd-image-nav">
                <button className="pd-image-nav-btn" onClick={handlePrevImage} aria-label="Previous image">&#8249;</button>
                <button className="pd-image-nav-btn" onClick={handleNextImage} aria-label="Next image">&#8250;</button>
              </div>
              <div className="pd-thumbnails">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className={`pd-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="pd-no-image">No images available</p>
          )}
        </div>

        <div className="pd-info">
          <h1 className="pd-name">{product.name}</h1>
          <p className="pd-price">${product.price?.toFixed(2)}</p>
          <div className="pd-rating">
            <div className="pd-stars">
              {renderStarRating(product.ratings.averageRating)}
            </div>
            <span className="pd-rating-count">({product.ratings.reviewCount} reviews)</span>
          </div>

          <div className="pd-quantity">
            <button 
              className="pd-quantity-btn" 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >-
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              min="1"
              aria-label="Quantity"
            />
            <button 
              className="pd-quantity-btn" 
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            className="pd-btn pd-btn-cart"
            onClick={handleAddToCart}
            disabled={processing}
            aria-label="Add to cart"
          >
            {processing ? 'Processing...' : 'Add to Cart'}
          </button>
          <button
            className="pd-btn pd-btn-buy"
            onClick={handleBuyNow}
            disabled={processing}
            aria-label="Buy now"
          >
            {processing ? 'Processing...' : 'Buy Now'}
          </button>
        </div>
      </div>

      <div className="pd-description">
        <h2>Product Description</h2>
        <p>
          {showFullDescription ? product.description : `${product.description?.substring(0, 200)}...`}
          {product.description?.length > 200 && (
            <button className="pd-show-more" onClick={toggleDescription}>
              {showFullDescription ? 'Show Less' : 'Show More'}
            </button>
          )}
        </p>
      </div>

      <div className="pd-specs">
        <h2>Product Specifications</h2>
        <table className="pd-specs-table">
          <tbody>
            {product.specifications?.map((spec, index) => (
              <tr key={index}>
                <th>{spec.name}</th>
                <td>{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pd-reviews">
        <h2>Customer Reviews</h2>
        {product.reviews?.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="pd-review-item">
              <div className="pd-review-rating">
                {renderStarRating(review.rating)}
              </div>
              <p><strong>{review.username}</strong>: {review.comment}</p>
              <p>Rating: {review.rating} / 5</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      <div className="pd-related-products">
        <h2>Related Products</h2>
        {relatedProducts.length > 0 ? (
          <div className="pd-related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <Link to={`/product/${relatedProduct.id}`} key={relatedProduct.id} className="pd-related-product">
                <img src={relatedProduct.images[0].url} alt={relatedProduct.name} />
                <div className="pd-related-product-info">
                  <p className="pd-related-product-name">{relatedProduct.name}</p>
                  <p className="pd-related-product-price">${relatedProduct.price?.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="pd-no-related-products">No related products available.</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
