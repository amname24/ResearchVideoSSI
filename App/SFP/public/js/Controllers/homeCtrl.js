videoApp.controller('homeCtrl', ['playlistService', 'videoService', 'authService', 'accountService', 'loginService',
    '$rootScope', '$scope', '$cookies', '$location', 'encryptService', '$mdDialog',
    function (playlistService, videoService, authService, accountService, loginService,
        $rootScope, $scope, $cookies, $location, encryptService, $mdDialog) {
   
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
            // $rootScope.playlistSelected = playlist;
            window.location.href = "https://localhost:8090/#!/home/playlist?name="+playlist.name
        }
    }
    $scope.load = function () {
        $rootScope.username = $cookies.get('username');
        $rootScope.email = $cookies.get('email');
        $rootScope.userId = $cookies.get('userId');
        $scope.logged = true;
        $scope.delete = false;
        $scope.getPlaylists();
        authService.verifyAdmin(function (res) {
            $scope.isAdmin = res.auth
        })
    }
    $scope.addSelectedVideoToPlaylist = function (playlist) {
        
        var video = {
            name : $rootScope.selectedVideo.name,
            video_id : $rootScope.selectedVideo.video_id,
            thumbnailUrl: $rootScope.selectedVideo.thumbnailUrl,
            description: $rootScope.selectedVideo.description,
            site : $rootScope.selectedVideo.site
        }
        videoService.addVideo(video, function (response) {
            if (response.success) {
                playlistService.addVideoToPlaylist(response.video, playlist, function (res) {
                    if (res.success) {
                        console.log(playlist);
                        
                        console.log("video added to playlist " + JSON.stringify(res.playlistvideo));
                    }
                })
            }
        })
    }

    $scope.history = function () {
        window.location.href = "https://localhost:8090/#!/home/history";
    }
    $scope.savePlaylist = function () {
        if ($scope.nameNewPlaylist) {
            console.log($scope.nameNewPlaylist)
            playlistService.add($scope.nameNewPlaylist, $rootScope.userId, function (res) {
                if (res.success) {
                    $scope.getPlaylists();
                    console.log("add playlist " + res.data);
                }
            })
            $scope.nameNewPlaylist = ''
        }
    }
    $scope.deletePlaylist = function (playlist) {
        $scope.delete = true;
        playlistService.delete(playlist, function (res) {
            if (res.success) {
                $scope.getPlaylists();
                if ($rootScope.playlistSelected == playlist) {
                    $rootScope.playlistSelected = ''
                    window.location.href = "https://localhost:8090/";
                }
                console.log("delete " + JSON.stringify(res.playlist));
            }
            $scope.delete = false;
        })
    }
    $scope.getPlaylists = function () {
        var userId = $cookies.get('userId')
        playlistService.playlists(userId, function (playlists) {
            if (playlists) {
                $scope.playlists = playlists;
                $scope.playlists.sort(function (a, b) {
                    return new Date(b.date_created) - new Date(a.date_created);
                })
            }
        })
    }
    $scope.changePassword = function () {
        var userId = $cookies.get('userId')
        var currentHash, newHash
        encryptService.encrypt($scope.CurrentPassword, function (res) {
            console.log(res);
            currentHash = res
        })
        encryptService.encrypt($scope.Password, function (res) {
            console.log(res);
            newHash = res
        })
        if (currentHash && newHash)
            accountService.changePassword(userId, currentHash, newHash, function (res) {
                if(res.error)
                    $scope.password_error = true
                else if(res.success) {
                    jQuery("#changePasswordModal").modal("hide");
                    $scope.password_error = false
                    var confirm = $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Confirmation Dialog')
                    .textContent('Your password has been successfully changed')
                    .ok('Got it!')
                $mdDialog.show(confirm);
                }
                else {
                    jQuery("#changePasswordModal").modal("hide");
                    $scope.password_error = false
                    var confirm = $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Error Information')
                    .textContent('Please try again')
                    .ok('Got it!')
                $mdDialog.show(confirm);
                }
        })
    }
    $scope.logout = function(){
        loginService.logout()
    }
}]);