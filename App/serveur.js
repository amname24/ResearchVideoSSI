var path = require('path');


const https = require("https"),
fs = require("fs");

const options = {
  key: fs.readFileSync("C:/Program Files/OpenSSL-Win64/bin/key.pem",'utf8'),
  cert: fs.readFileSync("C:/Program Files/OpenSSL-Win64/bin/csr.pem",'utf8')
};

var express = require('express');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');

var loginLayer = require('./repository/loginLayer.js');


var app = express();
var port = 8090;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.listen(port,function() {
    console.log("Port : " + port);
});
https.createServer(options, app).listen(8095);