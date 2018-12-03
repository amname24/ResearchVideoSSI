var videoApp = angular.module('videoApp',  ['ngCookies','ui.router','ngYoutubeEmbed']);

videoApp.controller('indexCtrl', ['$http', '$scope', '$location','$state','$window', function ($http, $scope, $location, $state, $window) {
    $scope.sites = [{
        siteName: 'Youtube',
        selected: 'true'
    }, {
        siteName: 'Vimeo',
        selected: 'false'
    }]
    $scope.search = function () {
        var searchInput = $scope.searchInput;
        var site = $scope.selectedSite.siteName;
        console.log('search')
    //    $state.go('searchPage', {site: site, input: searchInput})
        $window.location.href = "https://localhost:8090/#!/search?site=" + site + "&input=" + searchInput
    }
  
}]);