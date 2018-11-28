
videoApp.controller('searchCtrl', ['$http','$scope', function($http, $scope) {
    videos = [];
    // $scope.search = function () {
    //     var searchInput = $scope.searchInput;
    //     console.log(searchInput);
        
    //     if (!searchInput){
    //         $scope.video = [];
    //         return;
    //     }
    //     $http.get("https://www.googleapis.com/youtube/v3/search?part=snippet&order=relevance&maxResults=10&q=" + searchInput + "&type=video&key=AIzaSyA670YSi6pImC-35QYETHPxp_rHItuNCvc", { cache: true }).then(function(res){
    //     console.log(res);
    //     $scope.videos = res.data.items;
        
    //     })  
    // }

    $scope.search = function(){
        var searchInput = $scope.searchInput;
        console.log(searchInput);
        
        if (!searchInput){
            $scope.video = [];
            return;
        }
        $http.get("https://api.vimeo.com/videos?query="+searchInput+"&access_token=d3266a4b836cde5f096ae6abe8de8c79", { cache: true }).then(function(res){
        console.log(res);
        $scope.videos = res.data.data;
        
        })  
    }
}]);