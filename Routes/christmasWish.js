// routes/christmasWish.js
const express = require('express');
const router = express.Router();
const ChristmasWish = require('../Controllers/christmasWish');
const authenticateToken = require('../middleware/authenticateToken');
const isOwnerOrAdminMiddleware = require('../middleware/isOwnerOrAdmin');

// Route pour créer un nouveau vœu de Noël (requiert authentification)
router.post('/', authenticateToken, ChristmasWish.createWish);

// Route pour obtenir tous les vœux de Noël (accessible sans authentification)
router.get('/', ChristmasWish.getAllWishes);

// Route pour obtenir un vœu de Noël par son ID (accessible sans authentification)
router.get('/:id', ChristmasWish.getWishById);

// Route pour mettre à jour un vœu de Noël (requiert authentification et propriété/admin)
router.put('/:id', authenticateToken, isOwnerOrAdminMiddleware('ChristmasWish'), ChristmasWish.updateWish);

// Route pour supprimer un vœu de Noël (requiert authentification et propriété/admin)
router.delete('/:id', authenticateToken, isOwnerOrAdminMiddleware('ChristmasWish'), ChristmasWish.deleteWish);

module.exports = router;
