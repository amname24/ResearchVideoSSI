
videoApp.controller('homeCtrl', ['loginService','$http', '$rootScope','$scope', '$cookies','$location',function (loginService,$http,$rootScope, $scope, $cookies, $location) {
    
    $scope.sites = [{
        siteName: 'Youtube',
        selected: 'true'
    }, {
        siteName: 'Vimeo',
        selected: 'false'
    }]
    $scope.search = function () {
        var searchInput = $scope.searchInput;
        console.log($scope.selectedSite);
        
        var site = $scope.selectedSite.siteName;
        console.log('search')
        window.location.href = "https://localhost:8090/#!/home/search?site=" + site + "&input=" + searchInput
    }
    $scope.load = function () {
        $rootScope.username = $cookies.get('username');
        $rootScope.email = $cookies.get('email');
        $rootScope.userId = $cookies.get('userId');
        $scope.logged = true;
    }
    //toDo
    $scope.isAdmin = function(){
        return false;
    }
    $scope.history=function(){
        window.location.href = "https://localhost:8090/#!/home/history";
    }
}]);