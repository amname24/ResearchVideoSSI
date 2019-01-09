
videoApp.controller('homeCtrl', ['playlistService','videoService','loginService','$http', '$rootScope','$scope', '$cookies','$location',function (playlistService,videoService,loginService,$http,$rootScope, $scope, $cookies, $location) {
    
    $scope.sites = [{
        siteName: 'Youtube',
        selected: 'true'
    }, {
        siteName: 'Vimeo',
        selected: 'false'
    }]
    $scope.search = function () {
        var searchInput = $scope.searchInput;
        console.log($scope.selectedSite);
        var site = $scope.selectedSite.siteName;
        console.log('search')
        window.location.href = "https://localhost:8090/#!/home/search?site=" + site + "&input=" + searchInput
    }
    $scope.viewPlaylist = function(playlist){
        if(!$scope.delete)
        {
            console.log("here")
            $rootScope.playlistSelected = playlist;
            window.location.href = "https://localhost:8090/#!/home/playlist?name="+playlist.name;
        }
    }
    $scope.load = function () {
        $rootScope.username = $cookies.get('username');
        $rootScope.email = $cookies.get('email');
        $rootScope.userId = $cookies.get('userId');
        $scope.logged = true;
        $scope.delete=false;

        $scope.getPlaylists();
    }
    $scope.addSelectedVideoToPlaylist = function(playlist){
        videoService.addVideo($rootScope.selectedVideo,function (response) {
            if (response.success) {
                playlistService.addVideoToPlaylist(response.video,playlist,function (res) {
                    if (res.success) {
                        console.log("video added to playlist "+JSON.stringify(res.playlistvideo));
                    }
                })
            }
    })
    }
    $scope.isAdmin = function(){
        return false;
    }
    $scope.history=function(){
        window.location.href = "https://localhost:8090/#!/home/history";
    }
    $scope.savePlaylist =function(){
        if($scope.nameNewPlaylist){
            console.log($scope.nameNewPlaylist)
            playlistService.add($scope.nameNewPlaylist, $rootScope.userId, function (res) {
                if (res.success) {
                    $scope.getPlaylists();
                    console.log("add playlist "+res.data);
                }
            })
            $scope.nameNewPlaylist=''
        }
    }
    $scope.deletePlaylist = function(playlist){
        $scope.delete=true;
        playlistService.delete(playlist, function (res) {
            if (res.success) {
                $scope.getPlaylists();
                if($rootScope.playlistSelected==playlist){
                    $rootScope.playlistSelected = ''
                    window.location.href = "https://localhost:8090/";
                }
                console.log("delete "+ JSON.stringify(res.playlist));
            }
            $scope.delete = false;
        })
    }
    $scope.getPlaylists = function(){
        playlistService.playlists($rootScope.userId, function (playlists) {
            if (playlists) {
                $scope.playlists = playlists;
                $scope.playlists.sort(function(a,b){
                    return new Date(b.date_created) - new Date(a.date_created);
                })
            }
        })
    }

}]);