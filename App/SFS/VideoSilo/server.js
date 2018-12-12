var express = require('express');
const https = require("https");
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');
const request = require("request")
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
var youtubedl = require('youtube-dl');

var port = 8092;

// https.createServer(options, app).listen(port, function () {
//     console.log("Port : " + port);
//   });

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

app.get('/video/youtube/:videoId', function (req, res) {
  var videoId = req.params.videoId
  console.log("video silo get info", req.params);
  youtubedl("http://www.youtube.com/watch?v=" + videoId, // Optional arguments passed to youtube-dl.
    ['--format=18'],

    // start will be sent as a range header
    {
      cwd: __dirname
    }).pipe(res)
});

app.post('/video/getVideoInfo', function(req, res){

  var site = req.body.site
  var videoId =req.body.videoId
  console.log('video Silo', site, videoId);
  
  if (site && videoId) {
    switch (site) {
      case "vimeo":
        request.get("https://api.vimeo.com/videos/"+videoId+"?access_token=d3266a4b836cde5f096ae6abe8de8c79", function (err, response, body) {
          var item = JSON.parse(response.body)
          video = {
            videoId: videoId,
            site: site,
            name: item.name,
            watchUrl: "https://vimeo.com/",
            embedUrl: "https://player.vimeo.com/video/",
            thumbnailUrl: item.pictures[0].link,
            description: item.description
          }
          console.log('videoInfo', video);

          res.send({
            data: video,
            success: true,
          })
        })
        break;
      case "youtube":
        request.get("https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=" + videoId + "&key=AIzaSyA670YSi6pImC-35QYETHPxp_rHItuNCvc", function (err, response, body) {
          var items = JSON.parse(response.body).items
          video = {
            videoId: videoId,
            site: site,
            name: items[0].snippet.title,
            embedUrl: "https://www.youtube.com/embed/",
            watchUrl: "https://www.youtube.com//watch?v=",
            thumbnailUrl: items[0].snippet.thumbnails.default.url,
            description: items[0].snippet.description
          }
          console.log('videoInfo', video);

          res.send({
            data: video,
            success: true,
          })
        })
        break;
    }
  }
})

app.listen(port, function () {
  console.log("Port: ", port);

})