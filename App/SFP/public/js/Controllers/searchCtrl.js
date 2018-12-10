videoApp.controller('searchCtrl', ['videoService', '$http', '$scope', '$location', '$rootScope', function (videoService, $http, $scope, $location, $rootScope) {
 
    videos = [];
    var searchInput;
    var site;
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

    }
    // $scope.playVideo = function (video) {
    //     window.location.href = "https://localhost:8090/#!/player?site=" + video.site + "&videoId=" + video.videoId
    // }    
    $rootScope.$on("$locationChangeStart", function(event, next, current) { 
        $scope.load()
        
    });
}]);