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
      const response = await fetch('http://localhost:5002/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId, quantity }),
      });

      if (response.ok) {
        addToCart(product, quantity);
        alert('Added to cart successfully!');
        navigate('/cart');
      } else {
        const errorData = await response.json();
        alert(`Failed to add to cart: ${errorData.message || 'Unknown error'}`);
      }
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
          adminId: product.adminId, // Include adminId in the order request
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
  
  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-detail">
    <h1>{product.name}</h1>

    {/* Render each image in the images array */}
    <div className="product-images">
      {product.images && product.images.length > 0 ? (
       
        product.images.map((image, index) => (
          
          <img key={index} src={image.url} alt={`${product.name} ${index + 1}`} />
        ))
      ) : (
        <p>No images available</p>
      )}
    </div>
    
    <p>Price: ${product.price}</p>
    <p>{product.description}</p>

      <div className="quantity-selector">
        <label>Quantity: </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          min="1"
        />
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
  );
}

export default ProductDetail;
