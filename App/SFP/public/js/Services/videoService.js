
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
    return server;
}])