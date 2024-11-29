// middleware/isOwnerOrAdmin.js
const User = require('../Models/user');
const ChristmasWish = require('../Models/christmasWish');

const isOwnerOrAdmin = (model) => async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur est authentifié
        if (!req.user) {
            return res.status(401).json({ message: 'Authentification requise' });
        }

        const userId = req.user.userId;
        const resourceId = req.params.id;

        // Récupérer l'utilisateur de la base de données
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Si l'utilisateur est un admin, autoriser l'accès
        if (user.role === 'admin') {
            return next();
        }

        let resource;
        if (model === 'User') {
            // Pour les opérations sur l'utilisateur lui-même
            resource = await User.findById(resourceId);
        } else if (model === 'ChristmasWish') {
            // Pour les opérations sur les vœux de Noël
            resource = await ChristmasWish.findById(resourceId);
        }

        if (!resource) {
            return res.status(404).json({ message: 'Ressource non trouvée' });
        }

        // Vérifier si l'utilisateur est le propriétaire
        if (model === 'User' && resource._id.toString() !== userId) {
            return res.status(403).json({ message: 'Accès refusé. Vous n\'êtes pas autorisé à modifier ces informations.' });
        }

        if (model === 'ChristmasWish' && resource.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Accès refusé. Vous n\'êtes pas le propriétaire de ce vœu.' });
        }

        // Si tout est en ordre, passer au middleware suivant
        next();
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la vérification des droits', error: error.message });
    }
};

module.exports = isOwnerOrAdmin;
