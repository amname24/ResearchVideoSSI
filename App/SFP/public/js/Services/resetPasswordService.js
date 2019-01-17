videoApp.factory('resetPasswordService', ['$http', '$cookies', '$state', function ($http, $cookies, $state) {

    var server = {}

    server.sendEmail = function (email, cb) {
        var req ={
            email :email
        }
        $http.post('/user/sendEmail', req).then(function(res){
            console.log(res.data);
            cb(res.data.token)
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