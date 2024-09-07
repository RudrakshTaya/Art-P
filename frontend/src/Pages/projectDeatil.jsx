import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './projectDetail.css';
import { useCart } from '../Context/cartContext'; // Import CartContext for managing cart
import { useAuth } from '../Components/useAuth'; // Import AuthContext

const ProjectDetailPage = () => {
  const { Product_Id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // State for product quantity
  const [loading, setLoading] = useState(true); // Loading state for better UX
  const { addToCart } = useCart(); // Access cart context
  const { userId } = useAuth(); // Get userId from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:5002/cards/${Product_Id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          setError('Failed to fetch project details');
        }
      } catch (error) {
        setError('Error fetching project details');
      } finally {
        setLoading(false); // Stop loading once data is fetched or an error occurs
      }
    };

    fetchProject();
  }, [Product_Id]);

  // Handle Add to Cart functionality
  const handleAddToCart = async () => {
    if (!userId) {
      alert('You need to be logged in to add items to the cart.');
      navigate('/signin'); // Redirect to sign-in page
      return;
    }

    try {
      const response = await fetch('http://localhost:5002/api/addcart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,           // Include userId
          productId: project._id,
          quantity,
        }),
      });

      if (response.ok) {
        addToCart(project, quantity); // Update the cart state
        alert('Added to cart successfully!');
        navigate('/cart'); // Redirect to the cart page
      } else {
        alert('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Handle Buy Now functionality
  const handleBuyNow = async () => {
    if (!userId) {
      alert('You need to be logged in to complete the purchase.');
      navigate('/signin'); // Redirect to sign-in page
      return;
    }

    try {
      const response = await fetch('http://localhost:5002/api/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,           // Include userId
          productId: project._id,
        }),
      });

      if (response.ok) {
        alert('Purchase successful!');
        navigate('/confirmation'); // Redirect to confirmation page
      } else {
        alert('Failed to complete purchase');
      }
    } catch (error) {
      console.error('Error during purchase:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading spinner or message
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="project-detail">
      <div className="project-detail-container">
        <div className="project-image">
          <img src={project.imgSrc} alt={project.title} />
        </div>
        <div className="project-info">
          <h1>{project.title}</h1>
          <p>{project.text}</p>
          <h3 className="project-price">${project.price}</h3>

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
          <button className="btn add-to-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="btn buy-now" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
      <div className="reviews">
        <h2>Reviews</h2>
        <p>No reviews yet. Be the first to review!</p>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
