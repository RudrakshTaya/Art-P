const mongoose = require('mongoose');
const connectDB = require('./src/database/db');
const Card = require('./src/Models/cards.Models');
const allCards = [
  {
      title: 'Cyber Kitty Art',
      text: 'A vibrant digital art piece showcasing a futuristic cat with cybernetic elements.',
      imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
      price: '200',
      rating: 5,
      category: 'Art'
  },
  {
      title: 'Urban Cityscape Photography',
      text: 'A stunning photograph capturing the modern skyline of a bustling city at dusk.',
      imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5yRajIt8KX-DMiS8sp4BXEf02YjmqsqLvXFN9Y4Dz-hfpMUJnl4lcwhnVxo2bdbs5vQ&usqp=CAU',
      price: '150',
      rating: 4.5,
      category: 'Photography'
  },
  {
      title: 'Abstract Metal Sculpture',
      text: 'A contemporary sculpture crafted from metal, designed to represent fluid motion.',
      imgSrc: 'https://t4.ftcdn.net/jpg/09/23/69/97/360_F_923699743_J8Au3Dg23NwAmWWEMfZ7AYKS1LYDrBxE.jpg',
      price: '300',
      rating: 5,
      category: 'Sculpture'
  },
  {
      title: 'Dreamy Landscape Art',
      text: 'A dreamlike painting of a serene landscape blending nature with surreal elements.',
      imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
      price: '180',
      rating: 4.8,
      category: 'Art'
  },
  {
      title: 'Black and White Portrait Photography',
      text: 'A powerful black and white portrait that captures the essence of human emotion.',
      imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5yRajIt8KX-DMiS8sp4BXEf02YjmqsqLvXFN9Y4Dz-hfpMUJnl4lcwhnVxo2bdbs5vQ&usqp=CAU',
      price: '120',
      rating: 4.6,
      category: 'Photography'
  },
  {
      title: 'Modern Marble Sculpture',
      text: 'A sleek, modern sculpture carved from marble, symbolizing balance and harmony.',
      imgSrc: 'https://t4.ftcdn.net/jpg/09/23/69/97/360_F_923699743_J8Au3Dg23NwAmWWEMfZ7AYKS1LYDrBxE.jpg',
      price: '350',
      rating: 5,
      category: 'Sculpture'
  },
  {
      title: 'Surreal Cat Art',
      text: 'A surrealist interpretation of a cat, blending vivid colors and abstract patterns.',
      imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
      price: '220',
      rating: 5,
      category: 'Art'
  },
  {
      title: 'Architectural Photography',
      text: 'An awe-inspiring photograph of modern architecture, showcasing intricate designs.',
      imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5yRajIt8KX-DMiS8sp4BXEf02YjmqsqLvXFN9Y4Dz-hfpMUJnl4lcwhnVxo2bdbs5vQ&usqp=CAU',
      price: '170',
      rating: 4.7,
      category: 'Photography'
  },
  {
      title: 'Abstract Metal Sculpture II',
      text: 'A second version of the abstract metal sculpture, showcasing different fluid forms.',
      imgSrc: 'https://t4.ftcdn.net/jpg/09/23/69/97/360_F_923699743_J8Au3Dg23NwAmWWEMfZ7AYKS1LYDrBxE.jpg',
      price: '310',
      rating: 5,
      category: 'Sculpture'
  },
  {
      title: 'Celestial Dream Art',
      text: 'A celestial-themed painting that brings the night sky to life with abstract imagery.',
      imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
      price: '210',
      rating: 4.9,
      category: 'Art'
  },
  {
    title: 'Cyber Kitty Art',
    text: 'A vibrant digital art piece showcasing a futuristic cat with cybernetic elements.',
    imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
    price: '200',
    rating: 5,
    category: 'Art'
},
{
    title: 'Urban Cityscape Photography',
    text: 'A stunning photograph capturing the modern skyline of a bustling city at dusk.',
    imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5yRajIt8KX-DMiS8sp4BXEf02YjmqsqLvXFN9Y4Dz-hfpMUJnl4lcwhnVxo2bdbs5vQ&usqp=CAU',
    price: '150',
    rating: 4.5,
    category: 'Photography'
},
{
    title: 'Abstract Metal Sculpture',
    text: 'A contemporary sculpture crafted from metal, designed to represent fluid motion.',
    imgSrc: 'https://t4.ftcdn.net/jpg/09/23/69/97/360_F_923699743_J8Au3Dg23NwAmWWEMfZ7AYKS1LYDrBxE.jpg',
    price: '300',
    rating: 5,
    category: 'Sculpture'
},
{
    title: 'Dreamy Landscape Art',
    text: 'A dreamlike painting of a serene landscape blending nature with surreal elements.',
    imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
    price: '180',
    rating: 4.8,
    category: 'Art'
},
{
    title: 'Black and White Portrait Photography',
    text: 'A powerful black and white portrait that captures the essence of human emotion.',
    imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5yRajIt8KX-DMiS8sp4BXEf02YjmqsqLvXFN9Y4Dz-hfpMUJnl4lcwhnVxo2bdbs5vQ&usqp=CAU',
    price: '120',
    rating: 4.6,
    category: 'Photography'
},
{
    title: 'Modern Marble Sculpture',
    text: 'A sleek, modern sculpture carved from marble, symbolizing balance and harmony.',
    imgSrc: 'https://t4.ftcdn.net/jpg/09/23/69/97/360_F_923699743_J8Au3Dg23NwAmWWEMfZ7AYKS1LYDrBxE.jpg',
    price: '350',
    rating: 5,
    category: 'Sculpture'
},
{
    title: 'Surreal Cat Art',
    text: 'A surrealist interpretation of a cat, blending vivid colors and abstract patterns.',
    imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
    price: '220',
    rating: 5,
    category: 'Art'
},
{
    title: 'Architectural Photography',
    text: 'An awe-inspiring photograph of modern architecture, showcasing intricate designs.',
    imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5yRajIt8KX-DMiS8sp4BXEf02YjmqsqLvXFN9Y4Dz-hfpMUJnl4lcwhnVxo2bdbs5vQ&usqp=CAU',
    price: '170',
    rating: 4.7,
    category: 'Photography'
},
{
    title: 'Abstract Metal Sculpture II',
    text: 'A second version of the abstract metal sculpture, showcasing different fluid forms.',
    imgSrc: 'https://t4.ftcdn.net/jpg/09/23/69/97/360_F_923699743_J8Au3Dg23NwAmWWEMfZ7AYKS1LYDrBxE.jpg',
    price: '310',
    rating: 5,
    category: 'Sculpture'
},
{
    title: 'Celestial Dream Art',
    text: 'A celestial-themed painting that brings the night sky to life with abstract imagery.',
    imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
    price: '210',
    rating: 4.9,
    category: 'Art'
}
];

const seedDB = async () => {
  await connectDB();
  await Card.deleteMany({});
  await Card.insertMany(allCards);
  console.log('Cards added to the database');
  mongoose.connection.close();
};

seedDB();
