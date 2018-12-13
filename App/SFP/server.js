var path = require('path');
const axios = require("axios");
var jwt = require('jsonwebtoken');
var Cookies = require("cookies");
const yml = require("js-yaml");
const https = require("https"),
  fs = require("fs");


const options = {
  key: fs.readFileSync("D:/AMU/Semestre 9/Securite avancee/ResearchVideoSSI/SSL/research.com.key", 'utf8'),
  cert: fs.readFileSync("D:/AMU/Semestre 9/Securite avancee/ResearchVideoSSI/SSL/research.com.crt", 'utf8'),
};

var express = require('express');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');
const request = require("request")
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));


// const silosConfigPath = "silos.config.yml";
// try {
// 	silosConfigTry = yml.safeLoad(fs.readFileSync(path.join(__dirname, silosConfigPath), "utf8"));
// 	console.log("Silos config file loaded.");
// } catch (e) {
// 	console.log("Could not load the silos config file");
// 	process.exit(1);
// }
// var silosConfig = silosConfigTry.silo;

app.post(`/user/register`, (req, res) => {
  axios.post('http://localhost:8091/register', {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }).then(function (response) {
    res.json(response.data);
  }).catch(function (error) {
    res.send(false);
  });
});

// const RSA_PRIVATE_KEY = fs.readFileSync('./config/private.pem');

app.post(`/user/login`, (req, res) => {
  axios.post('http://localhost:8091/login', {
    email: req.body.email,
    password: req.body.password
  }).then(function (response) {
    res.json(response.data);
  }).catch(function (error) {
    res.send(false);
  });
});

app.post('/videos/search', (req, res) => {
  axios.post('http://localhost:8092/videos/search', {
    input: req.body.input,
    site: req.body.site
  }).then(function (response) {
    res.json(response.data);
  }).catch(function (error) {
    res.send(false);
  });
});


app.get('/video/youtube/:videoId', (req, res) => {
  console.log('server', req.params.videoId);
  var videoId = req.params.videoId;

  request.get('http://localhost:8092/video/youtube/'  + videoId).pipe(res)
});



app.post('/video/getVideoInfo', (req, res) => {
  console.log(req.body);
  
  axios.post('http://localhost:8092/video/getVideoInfo', {
    site: req.body.site,
    videoId: req.body.videoId
  }).then(function (response) {
    console.log(response.data);
    
    res.send(response.data);
  }).catch(function (error) {
    res.send(false);
  });
});

var port = 8090;
https.createServer(options, app).listen(port, function () {
  console.log("Port : " + port);
}); 