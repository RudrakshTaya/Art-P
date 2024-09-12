import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Shop.css';

const Shop = () => {
  const [cards, setCards] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]); // Store the filtered cards
const [priceRangeFilter, setPriceRangeFilter] = useState([0, 1000]); // Default price range


  const toggleCategory = (category) => {
    if (categoryFilter.includes(category)) {
      // Remove the category if it's already selected
      setCategoryFilter(categoryFilter.filter(c => c !== category));
    } else {
      // Add the category to the filter if not selected
      setCategoryFilter([...categoryFilter, category]);
    }
  };
  
  const clearCategories = () => {
    setCategoryFilter([]); // Clears all selected categories
  };
  

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:5002/cards');
        if (response.ok) {
          const data = await response.json();
          console.log(data); // Add this line to debug
          setCards(data);
          setFilteredCards(data); 
        } else {
          console.error('Failed to fetch cards');
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };
  
    fetchCards();
  }, []);
    // Filter cards whenever filters change
    useEffect(() => {
      let filtered = cards;
    
      // Category filter
      if (categoryFilter.length > 0) {
        filtered = filtered.filter(card => categoryFilter.includes(card.category));
      }
    
      // Price range filter
      filtered = filtered.filter(card => card.price >= priceRangeFilter[0] && card.price <= priceRangeFilter[1]);
    
      setFilteredCards(filtered);
    }, [categoryFilter, priceRangeFilter, cards]);
  

  return (
    <div className="shop">
      <section className="shop-section">
        <div className="shop-heading">
          <h2>Showcase of Excellence</h2>
        </div>
       
        <div className='shop-1'>
         {/* Filter Section */}
         <div className="filter">
  {/* Category Filter */}
  <div className="category-filter">
    <h3>Category</h3>
    <button
      className={`category-btn ${categoryFilter.length === 0 ? 'selected' : ''}`}
      onClick={() => clearCategories()}
    >
      All Categories {categoryFilter.length === 0 && '✔'}
    </button>
    <button
      className={`category-btn ${categoryFilter.includes('Art') ? 'selected' : ''}`}
      onClick={() => toggleCategory('Art')}
    >
      Art {categoryFilter.includes('Art') && '✔'}
    </button>
    <button
      className={`category-btn ${categoryFilter.includes('Sculpture') ? 'selected' : ''}`}
      onClick={() => toggleCategory('Sculpture')}
    >
      Sculpture {categoryFilter.includes('Sculpture') && '✔'}
    </button>
    <button
      className={`category-btn ${categoryFilter.includes('Photography') ? 'selected' : ''}`}
      onClick={() => toggleCategory('Photography')}
    >
      Photography {categoryFilter.includes('Photography') && '✔'}
    </button>
    
  </div>

  {/* Price Range Filter */}
  <div className="price-range-filter">
    <h3>Price Range</h3>
    <div className="slider-container">
      <input
        type="range"
        min="0"
        max="1000"
        value={priceRangeFilter[1]}
        onChange={(e) => setPriceRangeFilter([0, parseInt(e.target.value)])}
      />
      <span>Price Range: $0 - ${priceRangeFilter[1]}</span>
    </div>
  </div>
</div>

       
       
        <div className='shop-container'>
          {filteredCards.map((card) => (
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
                    <div className="shop-card-price">$.{card.price}</div>
                    <div className="shop-card-rating">{card.ratng} </div>
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
