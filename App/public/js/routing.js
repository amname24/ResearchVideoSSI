var videoApp = angular.module('videoApp',  ['ngCookies','ui.router']);

videoApp.config(function ($stateProvider) {
    var homeState = {
        name: "home",
        url: "/",
        templateUrl: "home/home.html",
        // controller: "mainCtrl"
    };
    var loginState = {
        name: "login",
        url: "/login",
        templateUrl: "login/login.html",
        controller: "userCtrl"
    };
    var signinState = {
        name: "signin",
        url: "/signin",
        templateUrl: "signin/signin.html",
        controller: "signinController"
    };
    
    $stateProvider.state(homeState);
    $stateProvider.state(loginState);
    $stateProvider.state(signinState);
});

angular.module('videoApp').run(['$cookies', '$location', function ($cookies,$location) {
    
    if(!$cookies.get('token')){
        $location.path('/login');
        var logged = false
    }
    else  
        $location.path('/');
  }]);