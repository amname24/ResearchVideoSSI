
videoApp.factory('accountService', ['$http', function ($http) {
    var server = {}
    server.changePassword = function(userId, current, newpass, cb){
        
       var req = {
           id: userId,
           current_password: current,
           new_password: newpass
       }
        $http.post('/user/changepassword', req).then(function(res){
            console.log(res.data);
            
            cb(res.data) 
        })
    }
   
    return server;
}])