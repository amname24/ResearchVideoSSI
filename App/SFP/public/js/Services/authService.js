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
        
        $http.post('user/verifyAdmin', req).then(function(res){
            console.log(res.data);
            if(res.data.auth==true)
                cb(res.data)
            else{
                // $cookies.remove('')
                $state.go('404')
            }
            
        })
     
    }
    return server;
}])