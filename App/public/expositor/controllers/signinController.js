

myApp.controller('signinController',['signinService','$scope','$window',function(signinService,$scope,$window){
    $scope.creer = function(){
        signinService.add($scope.Name,$scope.Email,$scope.Password, function(resp){
                if(resp)
                    $window.alert(" votre compte est créé !"); 
                else
                    $window.alert("Erreur votre compte n'est pas créé !"); 
            });
    }
    
}]);
