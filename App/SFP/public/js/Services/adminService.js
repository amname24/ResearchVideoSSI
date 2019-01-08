videoApp.factory('adminService', ['$http', function ($http) {
    var server = {}
    
    server.createAccount = function(newAccount,cb){
       console.log('adminService', newAccount);
       
        $http.post('/admin/createAccount',newAccount).then(function(resp){
            console.log(resp);
            
            cb(resp.data.user);
        });
    }
    server.updateAccount = function(account, cb){
        console.log(account);
        
        $http.post('/admin/account/update', account).then(function(res){
            console.log(res);
            cb(res.data.data)
            
        })
    }
    return server;
}])