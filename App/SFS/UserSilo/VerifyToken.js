var jwt = require('jsonwebtoken');
var config = require('../config'); 

module.exports = {
  /**
   * Verification d'un token et execution d'une fonction "next"
   */
  VerifyToken: function(req, res, next) {
    token = req.body.token ;        // recuperation du token
  
    if (!token) 
      return res.status(403).send({ auth: false, message: 'No token provided.' });      // Erreur si pas de token
  
    // Verification du token selon passe phrase serveur.
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) 
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });    
  
      // Si correct alors indiquer l'identifiant utilisateur a la requete.
      req.body.userid = decoded.id;
  
      next(req,res) ;       // Appel de la fonction demandée.
    });
  },
  
  /**
   * Recuperation des informations utilisateurs a partir du token
   */
  getParams: function(req, res) {
    token = req.body.token ;        // Recuperation du token

    if (!token) 
    return res.send({email: null, name: null}) ;        // Erreur si pas de token

    jwt.verify(token, config.secret, function(err, decoded) {      // Verification
      if (err) 
        return res.send({email: null, name: null});     // Erreur si pas de token
  
      return res.send({email: decoded.email, name: decoded.name}) ;   // Renvoie des informations si pas de soucis.
    });
  }
};