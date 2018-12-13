videoApp.config(function ($stateProvider) {
    var homeState = {
        name: "home",
        url: "/",
        templateUrl: "view/home/home.html",
        controller: "indexCtrl",
        resolve: {
            access: ["Access", function (Access) { return Access.isAuthenticated(); }],
        }
    };
    var loginState = {
        name: "login",
        url: "/login",
        templateUrl: "view/login/login.html",
        controller: "loginCtrl",
        resolve: {
            access: ["Access", function (Access) { return Access.isAnonymous(); }],
        }
    };
    var signinState = {
        name: "signup",
        url: "/signup",
        templateUrl: "view/signup/signup.html",
        controller: "signupCtrl",
        resolve: {
            access: ["Access", function (Access) { return Access.isAnonymous(); }],
        }
    };
    var searchPageState = {
        name: "searchPage",
        url: "/search",
        templateUrl: "view/search/search.html",
        controller: "searchCtrl",
        resolve: {
            access: ["Access", function (Access) { return Access.isAuthenticated(); }],
        }
    };
    var videoPlayerState = {
        name :"videoPlayer",
        url: "/player",
        templateUrl: "view/search/player.html",
        controller: "videoPlayerCtrl",
        resolve: {
            access: ["Access", function (Access) { return Access.isAuthenticated(); }],
        }
    }
    $stateProvider.state(homeState);
    $stateProvider.state(loginState);
    $stateProvider.state(signinState);
    $stateProvider.state(searchPageState);
    $stateProvider.state(videoPlayerState);
});

angular.module('videoApp').run(['$cookies', '$location','Access','loginService', function ($cookies,$location,Access,loginService) {
    
    if(!$cookies.get('token')){
        $location.path('/login');
        var logged = false
    }

    


    else  
        $location.path('/');
  }]);