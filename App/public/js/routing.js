var videoApp = angular.module('videoApp',  ['ngCookies','ui.router']);

videoApp.config(function ($stateProvider) {
    var homeState = {
        name: "home",
        url: "/",
        templateUrl: "view/home/home.html",
        // controller: "mainCtrl"
    };
    var loginState = {
        name: "login",
        url: "/login",
        templateUrl: "view/login/login.html",
        controller: "loginCtrl"
    };
    var signinState = {
        name: "signup",
        url: "/signup",
        templateUrl: "view/signup/signup.html",
        controller: "signupCtrl"
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