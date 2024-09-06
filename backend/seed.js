const mongoose = require('mongoose');
const connectDB = require('./src/database/db');
const Card = require('./src/Models/cards.Models');

const allCards = [
    {
        title: 'Card 1',
        text: 'This is card 1',
        imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
        link: '/card1', // Add link for each card
        price:'100',
        rating:5
      },
      {
        title: 'Card 2',
        text: 'This is card 2',
        imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5yRajIt8KX-DMiS8sp4BXEf02YjmqsqLvXFN9Y4Dz-hfpMUJnl4lcwhnVxo2bdbs5vQ&usqp=CAU',
        link: '/#card2', // Add link for each card\
        price:'100',
        rating:5
      },
      {
        title: 'Card 4',
        text: 'This is card 3',
        imgSrc: 'https://t4.ftcdn.net/jpg/09/23/69/97/360_F_923699743_J8Au3Dg23NwAmWWEMfZ7AYKS1LYDrBxE.jpg',
        link: '/#card3', // Add link for each card
        price:'100',
        rating:5
      },
      {
        title: 'Card 5',
        text: 'This is card 1',
        imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
        link: '/#card1', // Add link for each card
        price:'100',
        rating:5
      },
      {
        title: 'Card 6',
        text: 'This is card 2',
        imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5yRajIt8KX-DMiS8sp4BXEf02YjmqsqLvXFN9Y4Dz-hfpMUJnl4lcwhnVxo2bdbs5vQ&usqp=CAU',
        link: '/#card2' ,// Add link for each card
        price:'100',
        rating:5
      },
      {
        title: 'Card 7',
        text: 'This is card 3',
        imgSrc: 'https://t4.ftcdn.net/jpg/09/23/69/97/360_F_923699743_J8Au3Dg23NwAmWWEMfZ7AYKS1LYDrBxE.jpg',
        link: '/#card3', // Add link for each card
        price:'100',
        rating:5
      },
      {
        title: 'Card 8',
        text: 'This is card 1',
        imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
        link: '/#card1', // Add link for each card
        price:'100',
        rating:5
      },
      {
        title: 'Card 9',
        text: 'This is card 2',
        imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5yRajIt8KX-DMiS8sp4BXEf02YjmqsqLvXFN9Y4Dz-hfpMUJnl4lcwhnVxo2bdbs5vQ&usqp=CAU',
        link: '/#card2',
        price:'100',
        rating:5 
      },
      {
        title: 'Card 10',
        text: 'This is card 3',
        imgSrc: 'https://t4.ftcdn.net/jpg/09/23/69/97/360_F_923699743_J8Au3Dg23NwAmWWEMfZ7AYKS1LYDrBxE.jpg',
        link: '/#card3',price:'100',
        rating:5 // Add link for each card
      },{
        title: 'Card 3',
        text: 'This is card 1',
        imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
        link: '/#card1' ,price:'100',
        rating:5// Add link for each card
      },
      {
        title: 'Card 11',
        text: 'This is card 2',
        imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5yRajIt8KX-DMiS8sp4BXEf02YjmqsqLvXFN9Y4Dz-hfpMUJnl4lcwhnVxo2bdbs5vQ&usqp=CAU',
        link: '/#card2',price:'100',
        rating:5 // Add link for each card
      },
      {
        title: 'Card 12',
        text: 'This is card 3',
        imgSrc: 'https://t4.ftcdn.net/jpg/09/23/69/97/360_F_923699743_J8Au3Dg23NwAmWWEMfZ7AYKS1LYDrBxE.jpg',
        link: '/#card3',price:'100',
        rating:5 // Add link for each card
      },
      {
          title: 'Card 13',
          text: 'This is card 1',
          imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
          link: '/#card1' ,price:'100',
        rating:5// Add link for each card
        },
        {
          title: 'Card 14',
          text: 'This is card 2',
          imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5yRajIt8KX-DMiS8sp4BXEf02YjmqsqLvXFN9Y4Dz-hfpMUJnl4lcwhnVxo2bdbs5vQ&usqp=CAU',
          link: '/#card2' ,price:'100',
        rating:5// Add link for each card
        },
        {
          title: 'Card 15',
          text: 'This is card 3',
          imgSrc: 'https://t4.ftcdn.net/jpg/09/23/69/97/360_F_923699743_J8Au3Dg23NwAmWWEMfZ7AYKS1LYDrBxE.jpg',
          link: '/#card3',price:'100',
        rating:5 // Add link for each card
        },
        {
          title: 'Card 16',
          text: 'This is card 1',
          imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
          link: '/#card1',price:'100',
        rating:5 // Add link for each card
        },
        {
          title: 'Card 17',
          text: 'This is card 2',
          imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5yRajIt8KX-DMiS8sp4BXEf02YjmqsqLvXFN9Y4Dz-hfpMUJnl4lcwhnVxo2bdbs5vQ&usqp=CAU',
          link: '/#card2' ,price:'100',
        rating:5// Add link for each card
        },
        {
          title: 'Card 18',
          text: 'This is card 3',
          imgSrc: 'https://t4.ftcdn.net/jpg/09/23/69/97/360_F_923699743_J8Au3Dg23NwAmWWEMfZ7AYKS1LYDrBxE.jpg',
          link: '/#card3',price:'100',
        rating:5 // Add link for each card
        },
        {
          title: 'Card 19',
          text: 'This is card 1',
          imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
          link: '/#card1',
          price:'100',
        rating:5 // Add link for each card
        },
        {
          title: 'Card 20',
          text: 'This is card 2',
          imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5yRajIt8KX-DMiS8sp4BXEf02YjmqsqLvXFN9Y4Dz-hfpMUJnl4lcwhnVxo2bdbs5vQ&usqp=CAU',
          link: '/#card2',price:'100',
        rating:5 // Add link for each card
        },
        {
          title: 'Card 21',
          text: 'This is card 3',
          imgSrc: 'https://t4.ftcdn.net/jpg/09/23/69/97/360_F_923699743_J8Au3Dg23NwAmWWEMfZ7AYKS1LYDrBxE.jpg',
          link: '/#card3',price:'100',
        rating:5 // Add link for each card
        },{
          title: 'Card 22',
          text: 'This is card 1',
          imgSrc: 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg',
          link: '/#card1' ,price:'100',
        rating:5// Add link for each card
        },
        {
          title: 'Card 23',
          text: 'This is card 2',
          imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5yRajIt8KX-DMiS8sp4BXEf02YjmqsqLvXFN9Y4Dz-hfpMUJnl4lcwhnVxo2bdbs5vQ&usqp=CAU',
          link: '/#card2',price:'100',
        rating:5 // Add link for each card
        },
        {
          title: 'Card 24',
          text: 'This is card 3',
          imgSrc: 'https://t4.ftcdn.net/jpg/09/23/69/97/360_F_923699743_J8Au3Dg23NwAmWWEMfZ7AYKS1LYDrBxE.jpg',
          link: '/#card3',price:'100',
        rating:5 // Add link for each card
        },
  
];

const seedDB = async () => {
  await connectDB();
  await Card.deleteMany({});
  await Card.insertMany(allCards);
  console.log('Cards added to the database');
  mongoose.connection.close();
};

seedDB();
