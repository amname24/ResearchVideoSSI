videoApp.controller('historyCtrl', ['videoService','$http','$rootScope', '$scope', '$cookies','$location','blockUI', function (videoService,$http,$rootScope, $scope, $cookies, $location,blockUI) {
    $rootScope.userId;
    $scope.histories = [];
    $scope.load = function(){
        blockUI.start('Loading...');
        videoService.historysearch($rootScope.userId,function(res){
            if(res.success){
                $scope.histories = res.histories;
                
                $scope.histories.sort(function(a,b){
                    return new Date(b.date_watched) - new Date(a.date_watched);
                  })
                console.log(res.histories);
            }
            blockUI.stop();
        });
    }
    $scope.convertDate= function (inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/') + " at "+ [pad(d.getHours()), pad(d.getMinutes())].join(':');
      }
    $scope.playVideo = function (video) {
        $rootScope.searched = false;
        window.location.href = "https://localhost:8090/#!/home/player?site=" + video.site + "&videoId=" + video.video_id
    }
}]);