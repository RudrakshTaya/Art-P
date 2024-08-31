const Card = require('../Models/cards.Models');

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
