videoApp.controller('signupCtrl', ['signupService', '$scope','$window','$state',function (signupService, $scope, $window,$state) {
    $scope.register = function(){
        signupService.register($scope.Name,$scope.Email,$scope.Password, function(resp){
                if(resp)
                {
                    $window.alert(" votre compte est créé !"); 
                    $state.go('login');
                }
                else
                    $window.alert("cette adresse email est deja utilisée pour un autre compte !"); 
            });
    }
}])