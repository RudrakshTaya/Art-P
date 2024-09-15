import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../Context/cartContext'; // CartContext for managing cart
import { useAuth } from '../Components/useAuth';
import './productDetailPage.css';
function ProductDetail() {
  const { productId } = useParams(); // Get the productId from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Loader state
  const [error, setError] = useState(null); // Error state
  const [quantity, setQuantity] = useState(1); // Quantity state
  const { addToCart } = useCart(); // Access cart context
  const { userId } = useAuth(); // Get userId from AuthContext
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false); // State for button disabling

  useEffect(() => {
    // Fetch product details using the productId
    axios.get(`http://localhost:5002/api/products/${productId}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false); // Turn off loading once product is fetched
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
        setError('Failed to load product details');
        setLoading(false); // Turn off loading even in error
      });
  }, [productId]);

  // Handle Add to Cart functionality
  const handleAddToCart = async () => {
    if (!userId) {
      alert('You need to be logged in to add items to the cart.');
      navigate('/signin');
      return;
    }
    setProcessing(true); // Start processing
    try {
      const response = await fetch('http://localhost:5002/api/addcart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity,
        }),
      });

      if (response.ok) {
        addToCart(product, quantity); // Update the cart state
        alert('Added to cart successfully!');
        navigate('/cart');
      } else {
        alert('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setProcessing(false); // Stop processing
    }
  };

  // Handle Buy Now functionality
  const handleBuyNow = async () => {
    if (!userId) {
      alert('You need to be logged in to complete the purchase.');
      navigate('/signin');
      return;
    }
    setProcessing(true); // Start processing
    try {
      const response = await fetch('http://localhost:5002/api/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
        }),
      });

      if (response.ok) {
        alert('Purchase successful!');
        navigate('/confirmation');
      } else {
        alert('Failed to complete purchase');
      }
    } catch (error) {
      console.error('Error during purchase:', error);
    } finally {
      setProcessing(false); // Stop processing
    }
  };

  if (loading) {
    return <p>Loading product details...</p>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error state
  }

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <img src={product.imageLink} alt={product.name} />
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>

      {/* Quantity Input */}
      <div className="quantity-selector">
        <label>Quantity: </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
        />
      </div>

      {/* Add to Cart and Buy Now Buttons */}
      <button
        className="btn add-to-cart"
        onClick={handleAddToCart}
        disabled={processing} // Disable button while processing
      >
        {processing ? 'Processing...' : 'Add to Cart'}
      </button>
      <button
        className="btn buy-now"
        onClick={handleBuyNow}
        disabled={processing} // Disable button while processing
      >
        {processing ? 'Processing...' : 'Buy Now'}
      </button>
    </div>
  );
}

export default ProductDetail;
