videoApp.factory('resetPasswordService', ['$http', '$cookies', '$stateParams', function ($http, $cookies, $stateParams) {

    var server = {}

    server.sendEmail = function (email, cb) {
        var req = {
            email: email
        }
        $http.post('user/sendEmail', req).then(function(res){
            // console.log(res.data);
            cb(res.data)
        })
    }
    server.reset = function(password,cb){
        var req = {
            password: password
        }
        var token = $stateParams.resettoken;
        console.log("Token: "+$stateParams.resettoken)
        $http.post('reset/'+token, req).then(function(res){
            console.log(res.data);
            cb(res.data);
        })
    }
    server.verifyResetToken = function(token, cb){
        var req = {
            token: token
        }
        $http.post('/user/')
    }
    return server;
}])