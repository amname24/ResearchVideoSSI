videoApp.controller('playlistCtrl', ['videoService','$http','$rootScope', '$scope', '$cookies','$state',function (videoService,$http,$rootScope, $scope, $cookies, $state) {
    $scope.selectVideo = function(video){
        $rootScope.selectedVideo = video;
    }
$scope.load = function(){
    $scope.videos = [];
   console.log($rootScope.playlistSelected)
   if($rootScope.playlistSelected){
        videoService.playlistvideos ($rootScope.playlistSelected, function (res) {
            if (res) {
                $scope.videos = res
                console.log(res);
            }
        })
   }
}
$scope.playVideo = function (video) {
    $rootScope.searched = false;
    console.log(video);
    window.location.href = "https://localhost:8090/#!/home/player?site=" + video.site + "&videoId=" + video.video_id ;
}
$rootScope.$on("$locationChangeStart", function(event, next, current) { 
    $scope.videos = [];
    $scope.load()
});
}])