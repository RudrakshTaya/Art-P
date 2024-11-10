import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../Context/cartContext';
import { useAuth } from '../Components/useAuth';
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

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to load product details');
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
      addToCart(product, quantity);
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

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-detail">
      <div className="product-detail-content">
        <div className="product-images">
          {product.images && product.images.length > 0 ? (
            product.images.map((image, index) => (
              <img key={index} src={image.url} alt={`${product.name} ${index + 1}`} />
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>

        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">${product.price}</p>

          <div className="quantity-selector">
  <button className="quantity-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
  <input
    type="number"
    value={quantity}
    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
    min="1"
  />
  <button className="quantity-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
</div>


          <button
            className="btn add-to-cart"
            onClick={handleAddToCart}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Add to Cart'}
          </button>
          <button
            className="btn buy-now"
            onClick={handleBuyNow}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Buy Now'}
          </button>
        </div>
      </div>

      {/* Product Description */}
      <div className="product-description">
        <p>
          {showFullDescription ? product.description : `${product.description.substring(0, 100)}...`}
          {product.description.length > 100 && (
            <button className="show-more-btn" onClick={toggleDescription}>
              {showFullDescription ? 'Show Less' : 'Show More'}
            </button>
          )}
        </p>
      </div>

      {/* Review Section */}
      <div className="product-reviews">
        <h2>Customer Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="review">
              <p><strong>{review.username}</strong>: {review.comment}</p>
              <p>Rating: {review.rating} / 5</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
