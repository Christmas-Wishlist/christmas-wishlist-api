const express = require('express');
const connectDB = require('./config/db');
const routes = require('./Routes');
const cors = require('cors');
const cookie_parser = require('cookie-parser')

const app = express();
const PORT = process.env.PORT || 8080;

// Configuration CORS pour autoriser uniquement le frontend sur le port 3000
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

// Appliquer le middleware CORS avec les options
app.use(cors(corsOptions));

// .env
const dotenv = require('dotenv');
dotenv.config();

// Middleware pour parser le JSON
app.use(express.json());
app.use(cookie_parser());

// Connect to DB
connectDB();

// Pointe vers index.js
app.use('/api', routes);

// Route simple pour tester le serveur
app.get('/', (req, res) => {
  res.send('Hello, Express.js with MongoDB!');
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
