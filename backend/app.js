//Variables d'environnements
const dotenv = require("dotenv");
dotenv.config();

const MONGOSRV = process.env.MONGOSRV;

//Importe express
const express = require('express');
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const path = require('path');

const userRoutes = require('./routes/user');

//Crée notre application express en appelant express dans la constante
const app = express();
//Middleware, It parses incoming JSON requests and puts the parsed data in req.body.
app.use(express.json());

//CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//MongoDB
mongoose.connect(MONGOSRV,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//router importer par sauceRoutes et appliquer à la route (api/stuff)
app.use('/api/sauces', sauceRoutes);
//Enregistre les routes :
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')))
//Exporte la constante pour y acceder depuis dautre fichier
module.exports = app;