// // server.js
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./src/database/db'); 
// const Card = require('./src/Models/Cards'); // Import the Card model

// const app = express();
// const port = process.env.PORT || 5001;

// // Connect to the database
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // API route to get all cards
// app.get('/cards', async (req, res) => {
//   try {
//     const cards = await Card.find();
//     res.json(cards);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // API route to add a new card
// app.post('/cards', async (req, res) => {
//   const newCard = new Card({
//     title: req.body.title,
//     text: req.body.text,
//     imgSrc: req.body.imgSrc,
//     link: req.body.link,
//   });

//   try {
//     const savedCard = await newCard.save();
//     res.status(201).json(savedCard);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

const app = require('./app');
const port = process.env.PORT || 5002;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
