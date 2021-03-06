var express = require('express');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');
var userRepository = require('./user.bd');
const fs = require('fs')
var jwt = require('jsonwebtoken');
var Cookies = require('cookies');
var async = require("async");
var crypto = require("crypto");
// var bcrypt = require('bcrypt-nodejs');
var nodemailer = require("nodemailer");
// var sgTransport = require('nodemailer-sendgrid-transport');
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
  console.log("hello")
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
  var email = req.body.email
  var password = req.body.password
  userRepository.findByEmail(email, function (err, userFound) {

    if (err) return res.send({
      success: false,
      token: null
    })
    if (!userFound) return res.send({
      success: false,
      token: null
    })
    if (userFound.status == 'active' && userFound.password == password) {
      console.log('something');

      token = jwt.sign({
        id: userFound._id,
        email: userFound.email
      }, RSA_PRIVATE_KEY, {
        // algorithm: 'RS256',
        expiresIn: 86400
      });
      return res.send({
        success: true,
        username: userFound.name,
        userId: userFound._id,
        token: token
      });
    }
    return res.send({
      success: false,
      token: null
    })
  })

})


app.post('/adminVerify', function (req, res) {
  var token = req.body.token;
  var userId = req.body.userId
  if (!token) {
    return res.send({
      auth: false,
      token: null
    });
  }
  jwt.verify(token, RSA_PRIVATE_KEY, function (err, decoded) {
    if (err) {
      console.log('error', err);

      return res.send({
        auth: false,
        error: "BAD_TOKEN",
        token: null
      });
    } else {
      console.log('decoded', decoded);
      if (decoded.id == userId) {
        userRepository.findById(userId, function (err, userFound) {
          if (err) return res.send({
            auth: false,
            token: null
          })
          if (!userFound) return res.send({
            auth: false,
            token: null
          })
          if (userFound.status == 'active' && userFound.role_id == 'admin') {
            console.log('is Admin');

            return res.send({
              auth: true,
              token: token
            })
          }
          return res.send({
            auth: false,
            token: null
          })
        })

      }
    }
  });
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


app.post('/verify', (req, res) => {
  var token = req.body.token;
  var userId = req.body.userId
  if (!token) {
    return res.send({
      auth: false,
      token: null
    });
  }
  jwt.verify(token, RSA_PRIVATE_KEY, function (err, decoded) {
    if (err) {
      console.log('error', err);

      return res.send({
        auth: false,
        error: "BAD_TOKEN",
        token: null
      });
    } else {
      console.log('decoded', decoded);
      if (decoded.id == userId) {
        userRepository.findById(userId, function (err, userFound) {
          if (err) return res.send({
            auth: false,
            token: null
          })
          if (!userFound) return res.send({
            auth: false,
            token: null
          })
          if (userFound.status == 'active') {
            return res.send({
              auth: true,
              token: token
            })
          }
          return res.send({
            auth: false,
            token: null
          })
        })

      }
    }
  });
});


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
    console.log('here', user);
    res.send({
      data: user,
      success: true
    })

  })

})
app.post('/user/sendEmail', function (req, res) {
  var email = req.body.email


  userRepository.findByEmail(email, function (err, userFound) {
    console.log('sendEmail', userFound);
    if (err) {
      return res.send(false)
    }
    if (!userFound) return res.send(false)

    token = jwt.sign({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email
    }, RSA_PRIVATE_KEY, {
      expiresIn: 86400 //24h
    });
    return res.send({
      token: token,
      username: userFound.username
    })
  })
})

app.post('/user/changepassword', function (req, res) {
  var userId = req.body.id
  var current_password = req.body.current_password
  var new_password = req.body.new_password
  userRepository.findById(userId, function (err, accountFound) {
    if (err) {
      console.log('err', err);

      res.send({
        success: false,
      })
    }
    if (accountFound) {
      // console.log(accountFound, current_password);

      if (accountFound.password != current_password)
        return res.send({
          success: false,
          error: 'Current password is not correct'
        })
      accountFound.password = new_password
      userRepository.update(accountFound, function (updatedAccount) {

        if (updatedAccount) return res.send({
          success: true
        })
        return res.send({
          success: false
        })
      })

    }
  })


})

var port = 8091;

app.listen(port, function () {
  console.log("Port : " + port);
});