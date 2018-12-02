var path = require('path');
const axios = require("axios");
var jwt = require('jsonwebtoken');
var Cookies = require("cookies");
const yml = require("js-yaml");
const https = require("https"),
fs = require("fs");


const options = {
  key: fs.readFileSync("C:/Users/me/Desktop/Etudes/5A/SISecuProjet/SSL/research.com.key",'utf8'),
  cert: fs.readFileSync("C:/Users/me/Desktop/Etudes/5A/SISecuProjet/SSL/research.com.crt",'utf8'),
};

var express = require('express');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));


// const silosConfigPath = "silos.config.yml";
// try {
// 	silosConfigTry = yml.safeLoad(fs.readFileSync(path.join(__dirname, silosConfigPath), "utf8"));
// 	console.log("Silos config file loaded.");
// } catch (e) {
// 	console.log("Could not load the silos config file");
// 	process.exit(1);
// }
// var silosConfig = silosConfigTry.silo;

app.post(`/user/register`,(req, res) => {    
    axios.post('http://localhost:8091/register',
      {
        name : req.body.name,
        email: req.body.email,
        password: req.body.password
      }
    ).then(function(response) {
      res.json(response.data);
    }).catch(function(error) {
      res.send(false);
    });
  }
);

const RSA_PRIVATE_KEY = fs.readFileSync('./config/private.pem');

app.post(`/user/login`,(req, res) => {  
  var that = this; 
  axios.post('http://localhost:8091/login',
    {
      email: req.body.email,
      password: req.body.password
    }
  ).then(function(response) {
    console.log(response.data.success)
    var token;
    if(response.data.success){
      console.log("user is found so creat token ")
      console.log(response.data.user)
      
      token = jwt.sign({
        id: response.data.user._id,
        email: response.data.user.email
      }, RSA_PRIVATE_KEY, {
        // algorithm: 'RS256',
        expiresIn: 120
      }) 
      console.log(token)
      res.send({
        success: true,
        username: response.data.user.username,
        token: token
      });
    }
  }).catch(function(error) {
    console.log("error in the login SFP "+error.message)
    res.send(error.message)
  });
}
);


var port = 8090;
https.createServer(options, app).listen(port, function () {
  console.log("Port : " + port);
});