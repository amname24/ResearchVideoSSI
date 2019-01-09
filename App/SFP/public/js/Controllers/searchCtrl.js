videoApp.controller('searchCtrl', ['videoService', '$http', '$scope', '$location', '$rootScope', function (videoService, $http, $scope, $location, $rootScope) {
    var searchInput;
    var site;
    $scope.selectVideo = function(video){
        $rootScope.selectedVideo = video;
    }
    $scope.load = function () {
        searchInput = $location.search().input
        site = $location.search().site
        console.log(searchInput);

        if (!searchInput) {
            $scope.video = [];
            return;
        }
        videoService.search(searchInput, site, function (res) {
            if (res.success) {

                $scope.videos = res.data
                console.log(res.data);

            }
                    
        })
        console.log($scope.videos);
    }
    $scope.playVideo = function (video) {
        $rootScope.searched = true;
        window.location.href = "https://localhost:8090/#!/home/player?site=" + video.site + "&videoId=" + video.videoId
    }
    $rootScope.$on("$locationChangeStart", function(event, next, current) { 
        $scope.load()
        
    });
}]);