videoApp.controller('playlistCtrl', ['videoService','$http','$rootScope', '$scope', '$location','$cookies',function (videoService,$http,$rootScope, $scope, $location, $cookies) {
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
//    console.log($rootScope.playlistSelected)
    var playlist_name = $location.search().name
    var userId = $cookies.get('userId')
    console.log(playlist_name);
    
   if(playlist_name){
       
        videoService.playlistvideos (playlist_name, userId, function (res) {
            console.log(res);
            
            if (res.success) {
                $scope.objects = res.objects;
            }
        })
   }
}
$scope.playVideo = function (video) {
    $rootScope.videos = [];
    $scope.objects.forEach(object => {
        $rootScope.videos.push(object.video);
    });
    $rootScope.searched = false;
    $rootScope.fromplaylist = true;
    $rootScope.selectedVideo = video;
    console.log(video);
    window.location.href = "https://localhost:8090/#!/home/player?site=" + video.site + "&videoId=" + video.video_id ;
}
$rootScope.$on("$locationChangeStart", function(event, next, current) { 
    $scope.objects = [];
    $scope.load()
});
}])