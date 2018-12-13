var videoApp = angular.module('videoApp', ['ngCookies', 'ui.router', 'ngYoutubeEmbed']);

videoApp.controller('indexCtrl', ['$http', '$scope', '$cookies','$location', function ($http, $scope, $cookies, $location) {
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
        window.location.href = "https://localhost:8090/#!/search?site=" + site + "&input=" + searchInput
    }
    $scope.load = function () {
        console.log($cookies.get('token'));
        
        if (!$cookies.get('token')) {
            $location.path('/login');
            $scope.logged = false
            
        } else{
            $scope.logged = true
            // $location.path('/');

        }
        console.log($scope.logged);
        

    }
}]);