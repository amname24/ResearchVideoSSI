var videoApp = angular.module('videoApp', ['ngCookies', 'ui.router', 'ngYoutubeEmbed']);

videoApp.controller('homeCtrl', ['loginService','$http', '$scope', '$cookies','$location',function (loginService,$http, $scope, $cookies, $location) {
    
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
        $scope.username = $cookies.get('username');
        $scope.email = $cookies.get('email');
        $scope.logged = true;
    }
    //toDo
    $scope.isAdmin = function(){
        return false;
    }
}]);