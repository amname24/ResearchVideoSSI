videoApp.controller('videoPlayerCtrl', ['videoService', '$sce', '$scope','$location', function (videoService, $sce, $scope, $location) {
    $scope.loadVideo = function (site, videoId) {
        var site = $location.search().site
        var videoId = $location.search().videoId
        console.log(site,videoId);
        if (site && videoId)
            videoService.getVideoInfo(site, videoId, function (res) {
                console.log(res);
                $scope.video = res.data
                $scope.url = $sce.trustAsResourceUrl($scope.video.embedUrl + videoId)

            });
    }
}]);