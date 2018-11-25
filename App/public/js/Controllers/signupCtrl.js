videoApp.controller('signupCtrl', ['signupService', '$scope','$window',function (signupService, $scope, $window) {
    $scope.register = function(){
        signupService.register($scope.Name,$scope.Email,$scope.Password, function(resp){
                if(resp)
                    $window.alert(" votre compte est créé !"); 
                else
                    $window.alert("Erreur votre compte n'est pas créé !"); 
            });
    }
}])