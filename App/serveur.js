var path = require('path');


const https = require("https"),
fs = require("fs");
//helmet = require("helmet");


const options = {
  key: fs.readFileSync("D:/AMU/Semestre 9/Securite avancee/ResearchVideoSSI/SSL/research.com.key",'utf8'),
  cert: fs.readFileSync("D:/AMU/Semestre 9/Securite avancee/ResearchVideoSSI/SSL/research.com.crt",'utf8'),
  //dhparam: fs.readFileSync("C:/Users/me/Desktop/Etudes/5A/SISecuProjet/SSL/dh-strong.pem",'utf8')
};

var express = require('express');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');

var loginLayer = require('./repository/loginLayer.js');


var app = express();

//app.use(helmet()); // Add Helmet as a middleware



var port = 8090;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
https.createServer(options,app).listen(port,function() {
  console.log("Port : " + port);
});