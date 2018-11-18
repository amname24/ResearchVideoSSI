var path = require('path');


const https = require("https"),
fs = require("fs");


const options = {
  key: fs.readFileSync("C:/Users/me/Desktop/Etudes/5A/SISecuProjet/SSL/research.com.key",'utf8'),
  cert: fs.readFileSync("C:/Users/me/Desktop/Etudes/5A/SISecuProjet/SSL/research.com.crt",'utf8'),
};

var express = require('express');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');

var loginLayer = require('./repository/loginLayer.js');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));

app.post('/addCompte',function(req,res){
  if(!req.body.name || !req.body.email || !req.body.password){
      res.send(
          {
              success: false, errorSet : ['Error no name or password or email']
          }
      );
  }else{
      var compte ={
          _id : uuidv4(),
          name : req.body.name,
          email : req.body.email,
          password : req.body.password
      };
      loginLayer.ajouterCompte(compte,function(){
          res.send({success : true,compte : compte});
      });
  };
});


var port = 8090;


https.createServer(options,app).listen(port,function() {
  console.log("Port : " + port);
});