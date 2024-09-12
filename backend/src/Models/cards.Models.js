const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: String,
  text: String,
  imgSrc: String,
  
  price: String,
  rating: Number,
  category:String
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
