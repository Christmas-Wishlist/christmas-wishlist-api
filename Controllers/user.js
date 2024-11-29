// controllers/user.js
const User = require('../Models/user');
const ChristmasWish = require('../Models/christmasWish');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Fonction pour l'inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà" });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur avec le rôle 'user' par défaut
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user' // Définir le rôle par défaut à 'user'
        });

        // Sauvegarder l'utilisateur dans la base de données
        await newUser.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
    }
};

// Fonction pour la connexion d'un utilisateur
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect" });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect" });
        }

        // Créer et envoyer un token JWT
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token,{
            httpOnly:true,
            sameSite:'lax',
            maxAge:3600000,
        })

        res.status(200).json({ message: "Connexion réussie"});
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
    }
};

// Fonction pour lister les vœux d'un utilisateur
exports.getUserWishes = async (req, res) => {
    const userId = req.params.id; // Récupérer l'ID de l'utilisateur depuis les paramètres de l'URL

    try {
        // Récupérer les vœux de l'utilisateur
        const wishes = await ChristmasWish.find({ owner: userId }).populate('owner', 'username');

        if (!wishes.length) {
            return res.status(404).json({ message: "Aucun vœu trouvé pour cet utilisateur." });
        }

        res.status(200).json(wishes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des vœux de l'utilisateur", error: error.message });
    }
};

// Fonction pour supprimer un utilisateur et ses vœux associés
exports.deleteUser = async (req, res) => {
    const { id } = req.params; // Récupérer l'ID de l'utilisateur à partir des paramètres de l'URL

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Supprimer les vœux associés
        await ChristmasWish.deleteMany({ owner: id });

        // Supprimer l'utilisateur
        await User.findByIdAndDelete(id);

        res.status(200).json({ message: "Utilisateur et ses vœux supprimés avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error: error.message });
    }
};

// Fonction pour afficher tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        // Récupérer tous les utilisateurs, en ne sélectionnant que l'id et le username
        const users = await User.find().select('_id username');

        // Retourner la liste des utilisateurs
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: error.message });
    }
};

// Fonction pour obtenir les informations de l'utilisateur connecté
exports.getUser = async (req, res) => {
    try {
        // L'ID de l'utilisateur est extrait du token JWT dans le middleware d'authentification
        const userId = req.user.userId;

        // Récupérer l'utilisateur de la base de données
        const user = await User.findById(userId).select('-password'); // Exclure le mot de passe

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des informations de l'utilisateur", error: error.message });
    }
};

// Fonction pour modifier un utilisateur
exports.updateUser = async (req, res) => {
    const { id } = req.params; // Récupérer l'ID de l'utilisateur à partir des paramètres de l'URL
    const { username, email } = req.body; // Récupérer les nouvelles valeurs du corps de la requête

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Mettre à jour les champs souhaités
        if (username) user.username = username;
        if (email) user.email = email;

        // Sauvegarder les modifications
        await user.save();

        // Convertir l'utilisateur en objet et supprimer le mot de passe
        const userResponse = user.toObject(); // Convertir en objet JavaScript
        delete userResponse.password; // Supprimer le mot de passe

        res.status(200).json({ message: "Utilisateur mis à jour avec succès", user: userResponse });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error: error.message });
    }
};
