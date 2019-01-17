var path = require('path');
const axios = require("axios");
var jwt = require('jsonwebtoken');
const yml = require("js-yaml");
const https = require("https"),
  fs = require("fs");


const options = {
  key: fs.readFileSync("../../SSL/research.com.key", 'utf8'),
  cert: fs.readFileSync("../../SSL/research.com.crt", 'utf8'),
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

app.post(`/user/verify`, (req, res) => {
  axios.post('http://localhost:8091/verify', {
    userId: req.body.userId,
    token: req.body.token
  }).then(function (response) {
    console.log(response.data);
    res.json(response.data);
  }).catch(function (error) {
    res.send(false);
  });
});


app.post('/videos/search', (req, res) => {
  var site = req.body.site
  console.log(site);

  if (site.toLowerCase() == "youtube") {
    console.log('true');

    axios.post('http://localhost:8092/videos/youtube/search', {
      input: req.body.input
    }).then(function (response) {
      res.json(response.data);
    }).catch(function (error) {
      res.send(false);
    });
  } else if (site.toLowerCase() == "vimeo") {
    axios.post('http://localhost:8092/videos/vimeo/search', {
      input: req.body.input
    }).then(function (response) {
      res.json(response.data);
    }).catch(function (error) {
      res.send(false);
    });
  }

});


app.get('/video/:site/:videoId', (req, res) => {
  console.log('server', req.params.videoId);
  var site = req.params.site
  var videoId = req.params.videoId;
  if (site == "youtube")
    request.get('http://localhost:8092/video/youtube/' + videoId).pipe(res)
  else if (site == "vimeo")
    request.get('http://localhost:8092/video/vimeo/' + videoId).pipe(res)
});



app.post('/video/getVideoInfo', (req, res) => {
  var site = req.body.site
  if (site == "youtube") {
    axios.post('http://localhost:8092/video/youtube/getVideoInfo', {
      videoId: req.body.videoId
    }).then(function (response) {
      console.log(response.data);

      res.send(response.data);
    }).catch(function (error) {
      res.send(false);
    });
  } else if (site == "vimeo") {
    axios.post('http://localhost:8092/video/vimeo/getVideoInfo', {
      videoId: req.body.videoId
    }).then(function (response) {
      console.log(response.data);

      res.send(response.data);
    }).catch(function (error) {
      res.send(false);
    });
  }
});
app.post(`/video/add`, (req, res) => {
  axios.post('http://localhost:8092/video/add', {
    name: req.body.name,
    video_id: req.body.video_id,
    thumbnailUrl: req.body.thumbnailUrl,
    description: req.body.description,
    site: req.body.site
  }).then(function (response) {
    console.log("add video");
    res.send(response.data);
  }).catch(function (error) {
    res.send(false);
  });
});
app.post(`/video/history`, (req, res) => {
  axios.post('http://localhost:8092/video/history', {
    user_id: req.body.user_id,
    video_id: req.body.video_id,
  }).then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    res.send(false);
  });
});

app.get(`/history/:user_id`, (req, res) => {
  var user_id = req.params.user_id
  axios.get('http://localhost:8092/history/' + user_id).then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    res.send(false);
  });
});

app.get('/admin/getAllUsers', (req, res) => {
  axios.get('http://localhost:8091/admin/getAllUsers').then(function (response) {
    res.json(response.data);
  }).catch(function (error) {
    res.send(false);
  });
})

app.get(`/playlist/:user_id`, (req, res) => {
  var user_id = req.params.user_id 
  axios.get('http://localhost:8092/playlist/'+user_id).then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    res.send(false);
  });
});

app.post('/user/verifyAdmin', function (req, res) {
  axios.post('http://localhost:8091/adminVerify', req.body).then(function (resp) {
    // console.log(resp.data);    
    res.send(resp.data)
  }).catch(function (err) {
    res.send({auth: false, token: null})
  })
})

app.get('/admin/getAllUsers', (req, res) => {
  axios.get('http://localhost:8091/admin/getAllUsers').then(function (response) {
    res.json(response.data);
  }).catch(function (error) {
    res.send(false);
  });
})

app.post('/admin/account/create', (req, res) => {
  axios.post('http://localhost:8091/admin/createAccount', {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    status: req.body.status
  }).then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    res.send(false);
  });
})
app.get('/playlist/videos/:playlist_id', (req, res) => {
  var playlist_id = req.params.playlist_id
  axios.get('http://localhost:8092/playlist/videos/' + playlist_id).then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    res.send(false);
  });
});
app.post('/admin/account/update', (req, res) => {
  axios.post('http://localhost:8091/admin/account/update', {
    _id: req.body._id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role_id: req.body.role_id,
    status: req.body.status,
    last_login: req.body.last_login,
    created_at: req.body.created_at
  }).then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    res.send(false);
  });
})


app.post(`/playlist/add`, (req, res) => {
  axios.post('http://localhost:8092/playlist/add', {
    user_id: req.body.user_id,
    name: req.body.name,
  }).then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    res.send(false);
  });
});
app.post(`/playlist/delete`, (req, res) => {
  axios.post('http://localhost:8092/playlist/delete', {
    playlist: req.body.playlist,
  }).then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    res.send(false);
  });
});
app.post('/playlist/video/add', (req, res) => {
  axios.post('http://localhost:8092/playlist/video/add', {
    video: req.body.video,
    playlist: req.body.playlist
  }).then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    res.send(false);
  });
})

// app.post('/user/sendEmail', (req, res)=>{
//   axios.post('http://localhost:8091/user/sendEmail', {
//     email: req.body.email,
//   }).then(function (response) {
//     res.send(response.data);
//   }).catch(function (error) {
//     res.send(false);
//   });
// })
app.post('/user/sendEmail',(req, res)=>{
  axios.post('http://localhost:8091/forgot', {
    email: req.body.email,
  }).then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    res.send(false);
  });
})
app.post('/reset/:token',(req, res) => {
  var token = req.params.token
  var password = req.body.password
  axios.post('http://localhost:8091/reset/' + token,{password: password}).then(function (response) {
      res.send(response.data);
    }).catch(function (error) {
      res.send(false);
    });
});
app.post('/user/changepassword', (req, res)=>{
  axios.post('http://localhost:8091/user/changepassword', {
    id: req.body.id,
    current_password: req.body.current_password,
    new_password: req.body.new_password,
  }).then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    res.send(false);
  });
})
app.post('/playlist/videos/delete',(req,res)=>{
  var playlistvideo = req.body.playlistvideo
  axios.post('http://localhost:8092/playlist/videos/delete',{playlistvideo: playlistvideo }).then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    res.send(false);
  });
})
var port = 8090;
https.createServer(options, app).listen(port, function () {
  console.log("Port : " + port);
});