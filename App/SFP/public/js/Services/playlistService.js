videoApp.factory('playlistService', ['$http', function ($http) {
    var server = {};
    server.add=  function(name,userId,cb){
        var req = {
            name: name,
            user_id: userId
        }
        console.log(req);
        
        $http.post('/playlist/add', req).then(function(res){
            if(res.data.playlist)            
                cb(res.data) 
            else console.log("playlist name exist")
        })
    }

    server.delete=  function(playlist,cb){
        var req = {
           playlist:playlist
        }
        $http.post('/playlist/delete', req).then(function(res){
            console.log(res.data)
            cb(res.data) 
        })
    }

    server.playlists = function(user_id,cb){
        $http.get('/playlist/'+user_id).then(function(res){
            console.log(res.data);
            
            cb(res.data.playlists)
        });
    }

    server.addVideoToPlaylist = function(video,playlist,cb){
        console.log("video add to playlist "+ JSON.stringify(video))
        var req = {
            video:video,
            playlist:playlist
         }
        $http.post('playlist/video/add',req).then(function(res){
            cb(res.data)
        });
    }
    return server;
}]);