const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    //Supprime l’id car il va être généré automatiquement par la base de données
    delete sauceObject._id;
    //Supprime le champs userId qui correspond à la personne qui a créé l’objet
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        //Utilisation de userId qui vient du token d’authentification pour la sécurité
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !' })})
    .catch(error => { res.status(400).json( { error })})
  }

  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
          res.status(401).json({ message : 'Non-autorisé' });
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({message : 'Objet modifié!'}))
        .catch(error => res.status(401).json({ error }))
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
  });
  }

  exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
  }
  
  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
  }

  exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  }

  exports.likes = (req, res) => {
    if (req.body.like === 1 || req.body.like === -1){
      const addOne = req.body.like === 1 ? { likes: 1 } : { dislikes: 1 }
      const addOneUsers = req.body.like === 1 ? {usersLiked: req.body.userId} : {usersDisliked: req.body.userId}
      Sauce.updateOne({
        _id: req.params.id}, { $inc: addOne, $push: addOneUsers })
        .then(() => res.status(200).json({ message: 'Like ajouté !'}))
        .catch(() => res.status(400).json({ error }));
    } else { 
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          if (sauce.usersLiked.includes(req.body.userId) || sauce.usersDisliked.includes(req.body.userId)) {
            const deleteOne = sauce.usersLiked.includes(req.body.userId) ? { likes: -1 } : { dislikes: -1 }
            const deleteOneUser = sauce.usersLiked.includes(req.body.userId) ? { usersLiked: req.body.userId } : { usersDisliked: req.body.userId }
            Sauce.updateOne({ 
              _id: req.params.id }, { $inc: deleteOne, $pull: deleteOneUser })
              .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
              .catch(error => res.status(400).json({ error }))
          }
        })
        .catch(error => res.status(400).json({ error }));
   }
};
      
