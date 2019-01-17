videoApp.controller('playlistCtrl', ['videoService','$http','$rootScope', '$scope', '$cookies','$state',function (videoService,$http,$rootScope, $scope, $cookies, $state) {
    $scope.deletVideo = function(object){
        videoService.deletevideo(object.playlistvideo, function (success) {
            if (success) {
                console.log("video deleted from plylist")
                $scope.load();
            }
        });
    }
$scope.load = function(){
    $scope.objects=[];
   console.log($rootScope.playlistSelected)
   if($rootScope.playlistSelected){
        videoService.playlistvideos ($rootScope.playlistSelected, function (objects) {
            if (objects) {
                $scope.objects = objects;
                console.log(objects);
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
    $scope.objects = [];
    $scope.load()
});
}])