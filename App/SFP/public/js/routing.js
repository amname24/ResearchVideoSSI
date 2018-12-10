var videoApp = angular.module('videoApp',  ['ngCookies','ui.router','ngYoutubeEmbed']);

videoApp.config(function ($stateProvider) {
    var homeState = {
        name: "home",
        url: "/",
        templateUrl: "index.html",
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
   
    var fogetPassword = {
        name: "fogetPassword",
        url: "/forgetPassword",
        template: "forget password page",
        controller: "",
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
    $stateProvider.state(fogetPassword);
    $stateProvider.state(searchPageState);
    $stateProvider.state(signinState);
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