videoApp.factory('authService', ['$http', '$cookies', '$state', function ($http, $cookies, $state) {

    var server = {}

    server.verifyAdmin = function (cb) {
        var token = $cookies.get('token')
        var userId = $cookies.get('userId')
        var req = {
            token: token,
            userId: userId
        }
        console.log('req', req);

        $http.post('user/verifyAdmin', req).then(function (res) {
            console.log(res.data);
            cb(res.data)
        })

    }
    server.verify= function(cb){
        var token = $cookies.get('token')
        var userId = $cookies.get('userId')
        var req = {
            token: token,
            userId: userId
        }
        $http.post('/user/verify',req).then(function(res){
            console.log(res.data);
            cb(res.data) 
        })
    }
    return server;
}])