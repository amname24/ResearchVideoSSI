videoApp.controller('searchCtrl', ['videoService', '$http', '$scope', '$location', '$rootScope', function (videoService, $http, $scope, $location, $rootScope) {
 
    videos = [];
    var location = $location
    var searchInput
    var site
    $scope.load = function () {
        window.location.href= $rootScope.url
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
    $scope.playVideo = function (video) {
        window.location.href = "https://localhost:8090/#!/player?site=" + video.site + "&videoId=" + video.videoId
        // document.getElementById('resultContent').innerHTML = "aaa"
        // var ifrm = document.createElement("iframe");
        // ifrm.setAttribute("src", embedUrl + videoId);
        // ifrm.style.width = "640px";
        // ifrm.style.height = "480px";
        // var wrap = document.createElement('div');
        // wrap.appendChild(ifrm.cloneNode(true));
        // console.log('iframe', wrap.outerHTML);

        // document.getElementById('resultContent').innerHTML=wrap.outerHTML
    }
    $scope.$watch(function( $rootScope){
        $rootScope.url
    },function(){
        console.log('watch')
    $scope.load()
      });
}]);