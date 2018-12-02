var express = require('express');
const https = require("https");
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = 8092;

https.createServer(options, app).listen(port, function () {
    console.log("Port : " + port);
  });