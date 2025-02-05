// controllers/christmasWish.js
const ChristmasWish = require('../Models/christmasWish');

// Créer un nouveau vœu de Noël
exports.createWish = async (req, res) => {
    try {
        const { title, message, recipient } = req.body;
        const owner = req.user.userId; // Utilise l'ID de l'utilisateur authentifié
        const newWish = new ChristmasWish({ title, message, recipient, owner });
        await newWish.save();
        res.status(201).json(newWish);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Obtenir tous les vœux de Noël
exports.getAllWishes = async (req, res) => {
    try {
        // Vérifier si un titre est fourni dans la requête
        const { title } = req.query;

        // Construire la condition de recherche
        const query = title ? { title: { $regex: title, $options: 'i' } } : {};

        // Récupérer les vœux en fonction de la condition
        const wishes = await ChristmasWish.find(query).populate('owner', 'username email');
        
        res.status(200).json(wishes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Obtenir un vœu de Noël par son ID
exports.getWishById = async (req, res) => {
    try {
        const wish = await ChristmasWish.findById(req.params.id).populate('owner', 'username email');
        if (!wish) {
            return res.status(404).json({ message: 'Vœu non trouvé' });
        }
        res.status(200).json(wish);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour un vœu de Noël
exports.updateWish = async (req, res) => {
    try {
        const wish = await ChristmasWish.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!wish) {
            return res.status(404).json({ message: 'Vœu non trouvé' });
        }
        res.status(200).json(wish);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un vœu de Noël
exports.deleteWish = async (req, res) => {
    try {
        const wish = await ChristmasWish.findByIdAndDelete(req.params.id);
        if (!wish) {
            return res.status(404).json({ message: 'Vœu non trouvé' });
        }
        res.status(204).send(); // No content response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};