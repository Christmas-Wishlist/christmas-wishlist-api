// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Récupérer le token

    if (!token) return res.status(401).json({ message: 'Token requis' }); // Pas de token

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalide' }); // Token invalide
        req.user = user; // Attacher les informations utilisateur à la requête
        next(); // Passer au prochain middleware ou route
    });
};

module.exports = authenticateToken;
