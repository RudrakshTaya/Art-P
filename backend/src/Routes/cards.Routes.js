const express = require('express');
const { getCards, getCardById, addCard } = require('../Controllers/cards.Controllers');
const router = express.Router();

router.get('/', getCards);
router.post('/', addCard);
router.get('/:id', getCardById);

module.exports = router;
