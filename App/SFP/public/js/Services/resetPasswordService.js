videoApp.factory('reserPasswordService', ['$http', '$cookies', '$state', function ($http, $cookies, $state) {

    var server = {}

    server.sendEmail = function (email, cb) {
        $http.post('user/sendEmail', email).then(function(res){
            console.log(res.data);
            
        })
     
    }
    return server;
}])