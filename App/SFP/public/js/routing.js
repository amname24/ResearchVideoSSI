videoApp.config(function ($stateProvider,$urlRouterProvider) {
    var homeState = {
        name: "requireauth.home",
        url: "/",
        templateUrl: "view/home/home.html",
        controller: "homeCtrl",
        
    };
    var loginState = {
        name: "login",
        url: "/login",
        templateUrl: "view/login/login.html",
        controller: "loginCtrl",
    };
    var signinState = {
        name: "signup",
        url: "/signup",
        templateUrl: "view/signup/signup.html",
        controller: "signupCtrl",
    };
    var searchPageState = {
        name: "requireauth.home.searchPage",
        url: "home/search",
        templateUrl: "view/search/search.html",
        controller: "searchCtrl",
    };
    var videoPlayerState = {
        name :"requireauth.home.videoPlayer",
        url: "home/player",
        templateUrl: "view/search/player.html",
        controller: "videoPlayerCtrl",
    }
    var historyPageState = {
        name: "requireauth.home.historyPage",
        url: "home/history",
        templateUrl: "view/search/history.html",
        controller: "historyCtrl",
    };
    var playlistState = {
        name: "requireauth.home.playlist",
        url: "home/playlist",
        templateUrl: "view/playlist/playlist.html",
        controller:"playlistCtrl",
    };
    var adminPageState =  {
        name: "requireauth.admin",
        url: "/admin",
        templateUrl: "view/admin/admin-home.html",
        controller: "adminCtrl",
    }
    var NotFound = {
        name: "404",
        url: "/404",
        templateUrl: "view/404.html",
    }
    var resetPassword = {
        name: "resetpassword",
        url: "/reset/:resettoken",
        templateUrl: "view/resetPassword/resetPassword.html",
        controller: "resetPasswordCtrl",
    };
    var sendEmailPage = {
        name: "sendEmail",
        url: "/sendEmail",
        templateUrl: "view/resetPassword/sendEmail.html",
        controller: "resetPasswordCtrl", 
    }  
    $stateProvider.state({
        name: "requireauth",
    })
    $stateProvider.state(homeState);
    $stateProvider.state(loginState);
    $stateProvider.state(signinState);
    $stateProvider.state(searchPageState);
    $stateProvider.state(videoPlayerState);
    $stateProvider.state(historyPageState);
    $stateProvider.state(playlistState);
    $stateProvider.state(adminPageState);
    $stateProvider.state(resetPassword);
    $stateProvider.state(sendEmailPage);
    $stateProvider.state(NotFound);
    $urlRouterProvider.otherwise("/");
})

angular.module('videoApp').run(['$cookies', '$location','$transitions','loginService', function ($cookies,$location,  $transitions,loginService) {
    $transitions.onBefore({to: 'requireauth.**'}, function (trans) {
        var token = $cookies.get('token');
        console.log(token);
         loginService.verify(token,function(res){
            if (!res.data.success) {
                console.log("NO authentification: "+ JSON.stringify(res))
                $location.path('/login');
                return trans.router.stateService.target('login');
            }
            else return true;
        })
    });
}]);

