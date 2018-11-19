var path = require('path');


const https = require("https"),
<<<<<<< HEAD
fs = require("fs");


const options = {
  key: fs.readFileSync("C:/Users/me/Desktop/Etudes/5A/SISecuProjet/SSL/research.com.key",'utf8'),
  cert: fs.readFileSync("C:/Users/me/Desktop/Etudes/5A/SISecuProjet/SSL/research.com.crt",'utf8'),
=======
  fs = require("fs");
//helmet = require("helmet");


const options = {
  key: fs.readFileSync("D:/AMU/Semestre 9/Securite avancee/ResearchVideoSSI/SSL/research.com.key", 'utf8'),
  cert: fs.readFileSync("D:/AMU/Semestre 9/Securite avancee/ResearchVideoSSI/SSL/research.com.crt", 'utf8'),
  //dhparam: fs.readFileSync("C:/Users/me/Desktop/Etudes/5A/SISecuProjet/SSL/dh-strong.pem",'utf8')
>>>>>>> 8ed730460a9826e988135e55028fdb20832172a1
};

var express = require('express');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');

var userRepository = require('./repository/userRepository.js');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));

<<<<<<< HEAD
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
=======
var port = 8090;
var jwt = require('jsonwebtoken');
var Cookies = require("cookies");

const RSA_PRIVATE_KEY = fs.readFileSync('./config/private.pem');
>>>>>>> 8ed730460a9826e988135e55028fdb20832172a1

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', function (req, res) {
  console.log(req.body.email)
  var user = {
    email: req.body.email,
    password: req.body.password
  }

<<<<<<< HEAD

https.createServer(options,app).listen(port,function() {
=======
  userRepository.login(user, function (user, isFound) {
    var token;
    if (isFound) {
      token = jwt.sign({
        id: user._id,
        email: user.email
      }, RSA_PRIVATE_KEY, {
        // algorithm: 'RS256',
        expiresIn: 120
      })
      res.send({
        success: isFound,
        username: user.username,
        token: token
      });
    } else
      res.send({
        success: isFound
      })

  })
})


https.createServer(options, app).listen(port, function () {
>>>>>>> 8ed730460a9826e988135e55028fdb20832172a1
  console.log("Port : " + port);
});