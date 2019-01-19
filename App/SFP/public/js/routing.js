videoApp.config(function ($stateProvider, $urlRouterProvider) {
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
        controller: "playlistCtrl",
    };
    var adminPageState =  {
        name: "requireauth.admin",
        url: "/admin",
        templateUrl: "view/admin/admin-home.html",
        controller: "adminCtrl",
    };
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

videoApp.run(['$state', '$location','$transitions','authService', function ($state,$location,  $transitions,authService) {
    $transitions.onBefore({to: 'requireauth.**'}, function (trans) {
        authService.verify(function (resp) {
            console.log(resp);
            
            if (!resp.auth) {
                console.log("NO authentification: "+ JSON.stringify(resp))
                // $location.path('/login');                
                $state.go('login')
                return trans.router.stateService.target('login');
            } else {                
                if (trans.to().name =='requireauth.admin') {
                    authService.verifyAdmin(function (res) {
                        if (res.auth) { console.log(res);
                        }
                        else {
                            $state.go('404')
                        } 
                    })
                } else return true;
            }
        })
    });
}]);

// angular.module('videoApp').run(['$cookies', '$rootScope', '$location', 'loginService', 'authService',
//     function ($cookies, $rootScope, $location, loginService, authService) {



//         $rootScope.$on('$locationChangeStart', function (event, next, current) {
//             if (next == "https://localhost:8090/#!/signup" 
//                 || next == "https://localhost:8090/#!/login"
//                 || next == "https://localhost:8090/#!/resetPassword"
//                 || next == "https://localhost:8090/#!/404"
//                 || next == "https://localhost:8090/#!/sendEmail") {}
//             else {
//                 var token = $cookies.get('token');
//                 console.log(token);

//                 authService.verify(function (resp) {
//                     if (!resp.auth) {
//                         $location.path('/login');
//                     } else {
//                         if (next == "https://localhost:8090/#!/admin") {
//                             authService.verifyAdmin(function (res) {
//                                 if (res.auth) {}
//                                 else $location.path('/404');
//                             })
//                         } else
//                             {}
//                     }
//                 })
//             }


//         });


//     }
// ]);
