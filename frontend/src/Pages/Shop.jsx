import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Shop.css';

const Shop = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Fetch cards from the backend
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:5002/cards');
        if (response.ok) {
          const data = await response.json();
          setCards(data);
        } else {
          console.error('Failed to fetch cards');
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

  return (
    <div className="Shop">
      <section className="card-section">
        <div className="section-heading">
          <h2>All Cards</h2>
        </div>
        <div className="card-container">
          {cards.map((card, index) => (
            <Link to={card.link} className="card-link" key={index}>
            <div className="card">
            <div>
              <img src={card.imgSrc} alt={card.title} className="card-image" />
            </div>
            <div className='card-lower'>
              <div className='card-left'>
                <div className="card-title">{card.title}</div>
                <div className="card-body">{card.text}</div>
              </div>
              <div className='card-right'>
                <div className="card-price">{card.price}</div>
                <div className="card-rating">{card.rating} ★</div>
              </div>
            </div>
          </div>
            </Link>
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

export default Shop;
