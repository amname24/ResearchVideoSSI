var path = require('path');


const https = require("https"),
  fs = require("fs");

const http = require("http")
const request = require("request")
const options = {
  key: fs.readFileSync("D:/AMU/Semestre 9/Securite avancee/ResearchVideoSSI/SSL/research.com.key", 'utf8'),
  cert: fs.readFileSync("D:/AMU/Semestre 9/Securite avancee/ResearchVideoSSI/SSL/research.com.crt", 'utf8'),
};

var express = require('express');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');

var userRepository = require('./repository/userRepository.js');

var youtubedl = require('youtube-dl');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/signup', function (req, res) {
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
          success: true,
          compte: user
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
var port = 8090;
var jwt = require('jsonwebtoken');
// var Cookies = require("cookies");

const RSA_PRIVATE_KEY = fs.readFileSync('./config/private.pem');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

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
      })
      res.send({
        success: isFound,
        username: user.username,
        token: token
      });
    } else
      res.send({
        success: isFound
      })

  })
})
app.post('/videos/search', function (req, res) {
  var input = req.body.input
  var site = req.body.site
  var videos = []
  var isOk
  console.log(input, site);

  if (input) {
    switch (site) {
      case "Vimeo":
        request.get("https://api.vimeo.com/videos?query=" + input + "&per_page=20&access_token=d3266a4b836cde5f096ae6abe8de8c79", function (error, response, body) {
          // console.log( JSON.parse(res.body).data);
          if (response.statusCode == 200) {
            isOk = true;
            var items = JSON.parse(response.body).data
            for (var i in items) {
              var linkParts = items[i].uri.split('/')
              // console.log(linkParts);

              videos.push({
                videoId: linkParts[linkParts.length - 1],
                site: 'vimeo',
                name: items[i].name,
                watchUrl: "https://vimeo.com/",
                embedUrl: "https://player.vimeo.com/video/",
                thumbnailUrl: items[i].pictures[0].link,
                description: items[i].description
              })
            }
            console.log(videos);

            res.send({
              data: videos,
              success: isOk
            })
          }
        })
        break;

      case "Youtube":
        request.get("https://www.googleapis.com/youtube/v3/search?part=snippet&order=relevance&maxResults=20&q=" + input + "&type=video&key=AIzaSyA670YSi6pImC-35QYETHPxp_rHItuNCvc",
          function (err, response, body) {
            // console.log(res);
            if (response.statusCode == 200) {
              isOk = true
              var items = JSON.parse(response.body).items
              for (var i in items) {
                videos.push({
                  videoId: items[i].id.videoId,
                  site: 'youtube',
                  name: items[i].snippet.title,
                  embedUrl: "https://www.youtube.com/embed/",
                  watchUrl: "https://www.youtube.com//watch?v=",
                  thumbnailUrl: items[i].snippet.thumbnails.default.url,
                  description: items[i].snippet.description
                })
              }
              // console.log(videos);
              res.send({
                data: videos,
                success: isOk
              })
            }
          })
        break;
    }

  }
})

app.get('/video/getVideoInfo', function (req, res) {
  var site = req.body.site;
  var videoId = req.body.videoId
  var video
  var downloaded = 0
  console.log(req.body);
  video = youtubedl("http://www.youtube.com/watch?v=YQHsXMglC9A", // Optional arguments passed to youtube-dl.
    ['--format=18'],

    // start will be sent as a range header
    {
      cwd: __dirname + "/tmp"
    })
  video.on('info', function (info) {
    console.log('Download started');
    console.log('filename: ' + info._filename);
  });


  video.pipe(fs.createWriteStream("video.mp4", {
    flags: 'a'
  }));
  const path = 'video.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }

  // if (site && videoId) {
  //   switch (site) {
  //     case "vimeo":
  //       request.get("https://api.vimeo.com/videos/"+videoId+"?access_token=d3266a4b836cde5f096ae6abe8de8c79", function (err, response, body) {
  //         var item = JSON.parse(response.body)
  //         video = {
  //           videoId: videoId,
  //           site: site,
  //           name: item.name,
  //           watchUrl: "https://vimeo.com/",
  //           embedUrl: "https://player.vimeo.com/video/",
  //           thumbnailUrl: item.pictures[0].link,
  //           description: item.description
  //         }
  //         console.log('videoInfo', video);

  //         res.send({
  //           data: video,
  //           success: true,
  //         })
  //       })
  //       break;
  //     case "youtube":
  //       request.get("https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=" + videoId + "&key=AIzaSyA670YSi6pImC-35QYETHPxp_rHItuNCvc", function (err, response, body) {
  //         var items = JSON.parse(response.body).items
  //         video = {
  //           videoId: videoId,
  //           site: site,
  //           name: items[0].snippet.title,
  //           embedUrl: "https://www.youtube.com/embed/",
  //           watchUrl: "https://www.youtube.com//watch?v=",
  //           thumbnailUrl: items[0].snippet.thumbnails.default.url,
  //           description: items[0].snippet.description
  //         }
  //         console.log('videoInfo', video);

  //         res.send({
  //           data: video,
  //           success: true,
  //         })
  //       })
  //       break;
  //   }
  // }
})


https.createServer(options, app).listen(port, function () {
  console.log("Port : " + port);
});