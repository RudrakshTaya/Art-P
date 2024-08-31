const express = require('express');
const { getCards, addCard } = require('../Controllers/cards.Controllers');
const router = express.Router();

router.get('/', getCards);
router.post('/', addCard);

module.exports = router;
