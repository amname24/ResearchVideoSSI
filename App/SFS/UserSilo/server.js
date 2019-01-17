var express = require('express');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');
var userRepository = require('./user.bd');
const fs = require('fs')
var jwt = require('jsonwebtoken');
var Cookies = require('cookies');
var async = require("async");
var crypto = require("crypto");
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require("nodemailer");
var sgTransport = require('nodemailer-sendgrid-transport');
const yaml = require('js-yaml');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methodes", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentiels", true);
  next();
});

app.post('/register', function (req, res) {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.send({
      success: false,
      errorSet: ['Error no name or password or email']
    });
  } else {
    var compte = {
      _id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    userRepository.signup(compte, function (user, newUser) {
      if (newUser) {
        res.send({
          success: newUser,
          username: user.name,
          userId: user._id
        });
        console.log("new User created :" + user);
      } else {
        res.send({
          success: false
        });
        console.log("No user created : user exist ");
      }
    });
  };
});
const RSA_PRIVATE_KEY = fs.readFileSync('./config/private.pem');
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
      });
      res.send({
        success: isFound,
        username: user.name,
        userId: user._id,
        token: token
      });
    } else
      res.send({
        success: isFound
      })

  })
})

app.post('/verify', (req, res) => {
  var token = req.body.token;
  console.log(token);
  if (!token) {
    res.send(that.makeError("MISSING_PARAMS_TOKEN"));
    return;
  }
  jwt.verify(token, RSA_PRIVATE_KEY, function (err, decoded) {
    if (err) {
      console.error(err)
      return res.send({
        success: false,
        error: "BAD_TOKEN"
      });
    } else {
      // if everything is good, save to request for use in other routes
      return res.send({
        success: true
      });
    }
  });
});
app.post('/adminVerify', function(req, res){
  
  res.send('something')
  
})

app.post('/admin/getAllUsers', (req, res) => {
  
  userRepository.getAll(function (users) {
    res.send(users)
  })
})
app.post('/forgot', function(req, res) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },function(token, done) {
      userRepository.resetPassword(req.body.email,token,done);
    },function(token, user, done) {
      var options;
      try {
        options = yaml.safeLoad(fs.readFileSync('gmail.config.yml', 'utf8'));
      } catch (e) {
          console.log(e);
      }
      var smtpTransport = nodemailer.createTransport(options);
      var mailOptions = {
        to: user.email,
        from: 'projetsecuritewebresearchvideo@gmail.com',
        subject: 'Application search video Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'https://localhost:8090/#!/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err){
      console.error(err);
      res.send({
        success: false
      });
    }
    else  res.send({
      success: true
    });
  });
});

app.post('/reset/:token', function(req, res) {
  var token = req.params.token;
  var password = req.body.password;
  console.log("reset token "+JSON.stringify(token))
  async.waterfall([
    function(done) {
      userRepository.reset(token,password,done)
    },
    function(user, done) {
      var options;
      try {
        options = yaml.safeLoad(fs.readFileSync('gmail.config.yml', 'utf8'));
      } catch (e) {
          console.log(e);
      }
      var smtpTransport = nodemailer.createTransport(options);
      var mailOptions = {
        to: user.email,
        from: 'projetsecuritewebresearchvideo@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        done(err, 'done');
      });
    }
  ], function(err) {

    if (err){
      console.error(err);
      res.send({
        success: false
      });
    }
    else  res.send({
      success: true
    });
  });
});


var port = 8091;

app.listen(port, function(req, res, next) {
  console.log("Port : " + port);
});
