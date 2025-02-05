// routes/wish.js
const express = require('express');
const user = require('../Controllers/user'); // Importer user
const authenticateToken = require('../middleware/authenticateToken'); // Importer le middleware
const isOwnerOrAdminMiddleware = require('../middleware/isOwnerOrAdmin');

const router = express.Router();

router.post('/register', user.register); // Inscription (accessible sans authentification)
router.post('/login', user.login); // Connexion (accessible sans authentification)
router.get('/users', user.getAllUsers); // Lister tous les utilisateurs (accessible sans authentification)
router.get('/user', authenticateToken, isOwnerOrAdminMiddleware('Self'), user.getUser); // Obtenir les informations de l'utilisateur connecté (requiert authentification)
router.get('/:id/wishes', user.getUserWishes); // Lister les vœux d'un utilisateur (pas d'authentification requise)
router.put('/users/:id', authenticateToken, isOwnerOrAdminMiddleware('User'), user.updateUser); // Modifier un utilisateur (requiert authentification)
router.delete('/users/:id', authenticateToken, isOwnerOrAdminMiddleware('User'), user.deleteUser); // Supprimer un utilisateur (requiert authentification)

module.exports = router;
