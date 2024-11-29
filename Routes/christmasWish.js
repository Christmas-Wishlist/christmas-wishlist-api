// routes/christmasWish.js
const express = require('express');
const router = express.Router();
const ChristmasWish = require('../Controllers/christmasWish');

// Route pour créer un nouveau vœu de Noël
router.post('/', ChristmasWish.createWish);

// Route pour obtenir tous les vœux de Noël
router.get('/', ChristmasWish.getAllWishes);

// Route pour obtenir un vœu de Noël par son ID
router.get('/:id', ChristmasWish.getWishById);

// Route pour mettre à jour un vœu de Noël
router.put('/:id', ChristmasWish.updateWish);

// Route pour supprimer un vœu de Noël
router.delete('/:id', ChristmasWish.deleteWish);

module.exports = router;
