
videoApp.factory('videoService', ['$http', function ($http) {
    var server = {}
    var selectedVideo;
    server.search = function(input, site, cb){
        var req = {
            input: input,
            site: site
        }
        console.log(req);
        
        $http.post('/videos/search', req).then(function(res){
            console.log(res.data)            
            cb(res.data) 
        })
    }
 
    server.getVideoInfo = function(site, videoId, cb){
        var req = {
            site: site,
            videoId: videoId
        }
        console.log(req);
        
        $http.post('/video/getVideoInfo', req).then(function(res){
            console.log(res.data);
            cb(res.data)
            
        })
    }

    server.addHistory = function(history,cb){
        var req = {
            user_id:history.user_id,
            video_id : history.video_id,
        }
        $http.post('/video/history',req).then(function(res){
            cb(res.data)
        })
    }

    server.addPlayList= function(playlist,cb){
        var req = {
            user_id:playlist.user_id,
            video_id : playlist.video_id,
            name:playlist.name
        }
        $http.post('/video/playlist/add',req).then(function(res){
            console.log("savePlaylist");
            cb(res.data)
        })
    }

    server.addVideo = function(video,cb){
        var req = {
            name : video.name,
            video_id : video.video_id,
            thumbnailUrl: video.thumbnailUrl,
            description: video.description,
            site :video.site
        }
        $http.post('/video/add',req).then(function(res){
            cb(res.data);
        })
    }
    return server;
}])