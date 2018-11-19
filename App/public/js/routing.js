var videoApp = angular.module('videoApp',  ['ngCookies','ui.router']);

videoApp.config(function ($stateProvider) {
    var homeState = {
        name: "home",
        url: "/",
        templateUrl: "index.html",
        // controller: "mainCtrl"
    };
    var loginState = {
        name: "login",
        url: "/login",
        templateUrl: "login/login.html",
        controller: "userCtrl"
    };
    
    $stateProvider.state(homeState);
    $stateProvider.state(loginState);
});

angular.module('videoApp').run(['$cookies', '$location', function ($cookies,$location) {
    
    if(!$cookies.get('token')){
        $location.path('/login');
        var logged = false
    }
    else  
        $location.path('/');
  }]);