videoApp.controller('videoPlayerCtrl', ['videoService', '$sce', '$scope', '$location', function (videoService, $sce, $scope, $location) {
    $scope.loadVideo = function (site, videoId) {
        $scope.site = $location.search().site
        $scope.videoId = $location.search().videoId
        console.log($scope.site, $scope.videoId);
        if ($scope.site && $scope.videoId)
            videoService.getVideoInfo($scope.site, $scope.videoId, function (res) {
                $scope.video = res.data
                $scope.url = $sce.trustAsResourceUrl($scope.video.embedUrl + $scope.videoId)

            });
    }
}]);