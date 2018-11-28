
videoApp.factory('loginService', ['$http', function ($http) {
    var server = {}

    server.login = function(email, password, cb){
        var user = {
            email: email,
            password: password
        };
        console.log(user);
        $http.post('/login', user).then(function(res){
            cb(res) 
        }).e
    }
    return server;
}])