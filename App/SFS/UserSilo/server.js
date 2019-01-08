var express = require('express');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');
var userRepository = require('./user.bd');
const fs = require('fs')
var jwt = require('jsonwebtoken');
var Cookies = require('cookies');

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
app.post('/adminVerify', function (req, res) {

  res.send('something')

})

app.get('/admin/getAllUsers', (req, res) => {

  userRepository.getAllUsers(function (users) {
    // console.log(users);

    res.send(users)
  })
})


app.post('/admin/createAccount', (req, res) => {
  console.log(req.body);

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
      password: req.body.password,
      role_id: req.body.role,
      status: req.body.status
    };
    userRepository.createAccount(compte, function (user, ok) {
      console.log(user, ok);
      user.password = undefined
      if (ok) {
        res.send({
          success: ok,
          user: user
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
})
app.post('/admin/account/update', (req, res) => {
  var account = req.body

  userRepository.update(account, function (user) {
    console.log('here',user);
    res.send({
      data: user,
      success: true
    })

  })



})
var port = 8091;

app.listen(port, function () {
  console.log("Port : " + port);
});
