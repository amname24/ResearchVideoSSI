var path = require('path');


const https = require("https"),
  fs = require("fs");
//helmet = require("helmet");


const options = {
  key: fs.readFileSync("D:/AMU/Semestre 9/Securite avancee/ResearchVideoSSI/SSL/research.com.key", 'utf8'),
  cert: fs.readFileSync("D:/AMU/Semestre 9/Securite avancee/ResearchVideoSSI/SSL/research.com.crt", 'utf8'),
  //dhparam: fs.readFileSync("C:/Users/me/Desktop/Etudes/5A/SISecuProjet/SSL/dh-strong.pem",'utf8')
};

var express = require('express');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');

var userRepository = require('./repository/userRepository.js');


var app = express();

var port = 8090;
var jwt = require('jsonwebtoken');
var Cookies = require("cookies");

const RSA_PRIVATE_KEY = fs.readFileSync('./config/private.pem');

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
  console.log("Port : " + port);
});