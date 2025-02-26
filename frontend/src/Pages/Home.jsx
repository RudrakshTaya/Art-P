import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Home.css';

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [randomCards, setRandomCards] = useState([]);

  const images = [
    {
      src: 'https://img.freepik.com/premium-photo/rainbow-leaf-with-rain-drops-it_1030138-2684.jpg',
      link: '/Shop',
    },
    {
      src: 'https://img.freepik.com/free-photo/abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg',
      link: '/Shop',
    },
    {
      src: 'https://img.freepik.com/free-photo/freshness-beauty-nature-wet-drops-generated-by-ai_188544-42230.jpg',
      link: '/Shop',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    // Fetch card data from the backend
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://craftaura-backend.onrender.com/api/products'); // Adjust the URL to your API endpoint
        if (response.ok) {
          const data = await response.json();
          // Function to shuffle array
          const shuffleArray = (array) => {
            let shuffledArray = array.slice();
            for (let i = shuffledArray.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }
            return shuffledArray;
          };

          // Function to select random cards
          const getRandomCards = (products, count) => {
            const shuffledCards = shuffleArray(products);
            return shuffledCards.slice(0, count);
          };

          // Get a random selection of cards
          setRandomCards(getRandomCards(data, 4)); // Change the count to the number of cards you want to display
        } else {
          console.error('Failed to fetch cards');
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchProducts();
  }, []);

  const reviews = [
    {
      reviewer: 'John Doe',
      rating: 5,
      comment: 'Excellent service! Highly recommend.',
    },
    {
      reviewer: 'Jane Smith',
      rating: 4,
      comment: 'Very good experience, but there is room for improvement.',
    },
    {
      reviewer: 'Alice Johnson',
      rating: 3,
      comment: 'Average experience, okay service.',
    },
  ];

  return (
    <div className="Home">
      <section className="intro-image">
        <div className="slideshow">
          {images.map((image, index) => (
            <Link to ={image.link} key={index}>
              <img
                src={image.src}
                alt={`Intro ${index + 1}`}
                className={`intro-img ${index === currentImageIndex ? 'active' : ''}`}
              />
            </Link>
          ))}
        </div>
      </section>
<section className='two'>

      <div className="card-section">
        <div className="section-heading">
          <h2>Artistic Highlights</h2>
        </div>
        <div className="card-container">
        
          {randomCards.map((products, index) => (
            <Link to={`/products/${products._id}`} className="card-link" key={index}>
            <div className="card">
            <div className='card-image-container'>
              <img src={products.images[0].url} alt={products.name} className="card-image" />
              </div>
              <div className="card-lower">
                <div className="card-left">
                  <div className="card-title">{products.name}</div>
                  <div className="card-body">{products.description}</div>
                </div>
                <div className="card-right">
                  <div className="card-price">$.{products.price}</div>
                  <div className="card-rating">{products.rating} </div>
                </div>
              </div>
            </div>
          </Link>
          ))}
   
          
        </div>
        <div className="view-shop-button">
          <Link to="/menu" className="shop-button">View All</Link>
        </div>
      </div>
      <div className='other'>
<h2>hello</h2>
</div>
      </section>
     


      <section className="reviews-section">
        <div className="section-heading">
          <h2>Reviews</h2>
        </div>
        <div className="reviews-container">
          {reviews.map((review, index) => (
            <div className="review" key={index}>
              <div className="reviewer">{review.reviewer}</div>
              <div className="rating">Rating: {review.rating} ★</div>
              <div className="comment">{review.comment}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Your Company Name. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
