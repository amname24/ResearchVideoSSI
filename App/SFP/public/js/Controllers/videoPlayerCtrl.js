videoApp.controller('videoPlayerCtrl', ['videoService', '$sce','$rootScope', '$scope', '$location', function (videoService, $sce,$rootScope, $scope, $location) {
    $scope.loadVideo = function (site, videoId) {
        $scope.site = $location.search().site
        $scope.videoId = $location.search().videoId
        console.log($scope.site, $scope.videoId);

        if ($scope.site && $scope.videoId)
            videoService.getVideoInfo($scope.site, $scope.videoId, function (res) {
                $scope.video = res.data
                var video= {
                    name : res.data.name,
                    video_id : res.data.videoId,
                    thumbnailUrl: res.data.thumbnailUrl,
                    description: res.data.description,
                    site :res.data.site
                }
                console.log(video)
                $scope.url = $sce.trustAsResourceUrl($scope.video.embedUrl + $scope.videoId)
                videoService.addVideo(video,function (response) {
                    if (response.success) {
                        if($rootScope.searched){
                            var history = {
                                user_id: $rootScope.userId,
                                video_id: response.video._id
                            }
                            videoService.addHistory(history,function (res) {
                                if(res){
                                    console.log("video added to History");
                                }
                                else
                                    console.log("problem video NOT added to History");   
                            })
                            $rootScope.searched = false;
                        }
                    } else
                        console.log("problem video NOT added and Not found");                
                }
            );
        });
    }
    $scope.selectVideo = function(){
        console.log("$rootScope.selectedVideo: "+JSON.stringify($rootScope.selectedVideo))
    }
    $scope.goPrev = function(){
        var currentindex = $rootScope.videos.indexOf($rootScope.selectedVideo);
        if(currentindex>0){
            var prevVIdeo = $rootScope.videos[currentindex - 1];
            $rootScope.selectedVideo = prevVIdeo;
            window.location.href = "https://localhost:8090/#!/home/player?site=" + prevVIdeo.site + "&videoId=" + prevVIdeo.video_id ;
        }
        console.log(currentindex);
    }
    $scope.goNext = function(){
        var currentindex = $rootScope.videos.indexOf($rootScope.selectedVideo);
        if(currentindex<$rootScope.videos.length){
            var nextVIdeo = $rootScope.videos[currentindex + 1];
            $rootScope.selectedVideo = nextVIdeo;
            window.location.href = "https://localhost:8090/#!/home/player?site=" + nextVIdeo.site + "&videoId=" + nextVIdeo.video_id ;
        }
        console.log(currentindex);
    }
    $rootScope.$on("$locationChangeStart", function(event, next, current) { 
        $scope.loadVideo()
    });
}]);