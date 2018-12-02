var express = require('express');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');
var userRepository = require('./user.db');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req,res,next){
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methodes","GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers","X-Requested-With,content-type");
    res.setHeader("Access-Control-Allow-Credentiels",true);
    next();
});

app.post('/register',function(req,res){
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
        userRepository.signup(compte,function(user, newUser){
            if(newUser)
            {
            res.send({success : true,compte : user});
            console.log("new User created :"+user);
            }
            else 
            {
            res.send({success : false});
            console.log("No user created : user exist ");
            }
        });
    };
});

app.post('/login', function (req, res) {
    console.log(req.body.email)
    var user = {
      email: req.body.email,
      password: req.body.password
    }
    userRepository.login(user, function (user, isFound) {
      if (isFound) {
        res.send({
          success: isFound,
          username: user.username,
        });
      } else
        res.send({
          success: isFound
        })
    })
  })


var port = 8091;

app.listen(port, function() {
    console.log("Port : " + port);
});
