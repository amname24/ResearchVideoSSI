
videoApp.factory('loginService', ['$http', function ($http) {
    var server = {}
    var loggedState = false;
    server.login = function(email, password, cb){
        var user = {
            email: email,
            password: password
        };
        console.log(user);
        $http.post('/user/login', user).then(function(res){
            cb(res) 
        }).e
    }
    server.logged = function(){
        loggedState = true;
    }
    server.logout = function(){
        loggedState = false;
    }
    server.isLogged= function(){
        return loggedState
    }
    return server;
}])