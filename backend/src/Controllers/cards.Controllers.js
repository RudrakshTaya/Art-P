const Card = require('../Models/cards.Models');

// Get all cards
exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new card
exports.addCard = async (req, res) => {
  const newCard = new Card({
    title: req.body.title,
    text: req.body.text,
    imgSrc: req.body.imgSrc,
    link: req.body.link,
    price: req.body.price,
    rating: req.body.rating,
  });

  try {
    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a card by ID
exports.getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (card) {
      res.json(card);
    } else {
      res.status(404).json({ message: 'Card not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
