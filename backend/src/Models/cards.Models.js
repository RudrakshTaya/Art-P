const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: String,
  text: String,
  imgSrc: String,
  link: String,
  price: String,
  rating: Number
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
