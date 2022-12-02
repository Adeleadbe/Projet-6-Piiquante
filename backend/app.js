//Variables d'environnements
const dotenv = require("dotenv");
dotenv.config();

const MONGOSRV = process.env.MONGOSRV;

const express = require('express');
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const path = require('path');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());

//CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Mongoose
mongoose.connect(MONGOSRV,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')))
//Exporte la constante pour y acceder depuis d'autres fichiers
module.exports = app;