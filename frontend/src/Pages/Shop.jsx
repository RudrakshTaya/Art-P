import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Shop.css';

const Shop = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:5002/cards');
        if (response.ok) {
          const data = await response.json();
          console.log(data); // Add this line to debug
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
    <div className="shop">
      <section className="shop-section">
        <div className="shop-heading">
          <h2>Showcase of Excellence</h2>
        </div>
       
        <div className='shop-1'>
        <div className='filter'><h2>filter</h2></div>
        <div className='shop-container'>
          {cards.map((card) => (
            <Link to={`/shop/${card._id}`} className="shop-card-link" key={card._id}>
 
              <div className="shop-card">
              <div className='shop-card-image-container'>
                <img src={card.imgSrc} alt={card.title} className="shop-card-image" />
                </div>
                <div className='shop-card-lower'>
                  <div className='shop-card-left'>
                    <div className="shop-card-title">{card.title}</div>
                    <div className="shop-card-body">{card.text}</div>
                  </div>
                  <div className='shop-card-right'>
                    <div className="shop-card-price">{card.price}</div>
                    <div className="shop-card-rating">{card.rating} ★</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          </div>
         
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
