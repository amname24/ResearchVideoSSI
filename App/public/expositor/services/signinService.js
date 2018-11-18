myApp.factory('signinService',['$http',function($http){
    var serv = {};

    serv.add = function(Name,Email,Password,cb){
            var req = {
                name : Name,
                email : Email ,
                password : Password,
            }
            $http.post('/addCompte',req).then(function(resp){
                cb(resp.data.success);
            });
    }

    return serv;
}]);