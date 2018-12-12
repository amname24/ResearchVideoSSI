videoApp.config(function ($stateProvider) {
    var homeState = {
        name: "home",
        url: "/",
        templateUrl: "view/home/home.html",
        controller: "indexCtrl"
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
    var searchPageState = {
        name: "searchPage",
        url: "/search",
        templateUrl: "view/search/search.html",
        controller: "searchCtrl",
    };
    var videoPlayerState = {
        name :"videoPlayer",
        url: "/player",
        templateUrl: "view/search/player.html",
        controller: "videoPlayerCtrl"
    }
    $stateProvider.state(homeState);
    $stateProvider.state(loginState);
    $stateProvider.state(signinState);
    $stateProvider.state(searchPageState);
    $stateProvider.state(videoPlayerState);
});

// angular.module('videoApp').run(['$cookies', '$location', function ($cookies,$location) {
    
//     if(!$cookies.get('token')){
//         $location.path('/login');
//         var logged = false
//     }
//     else  
//         $location.path('/');
//   }]);