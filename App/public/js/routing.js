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
    var registerState = {
        name: "register",
        url: "/register",
        template: "register page",
        controller: "",
    };
    var fogetPassword = {
        name: "fogetPassword",
        url: "/forgetPassword",
        template: "forget password page",
        controller: "",
    };
    var searchPageState = {
        name: "searchPage",
        url: "/search",
        templateUrl: "search/search.html",
        controller: "searchCtrl"
    };
    $stateProvider.state(homeState);
    $stateProvider.state(loginState);
    $stateProvider.state(registerState);
    $stateProvider.state(fogetPassword);
    $stateProvider.state(searchPageState);
});

angular.module('videoApp').run(['$cookies', '$location', function ($cookies,$location) {
    
    if(!$cookies.get('token')){
        $location.path('/login');
        var logged = false
    }
    else  
        $location.path('/');
  }]);