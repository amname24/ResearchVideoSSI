videoApp.controller('resetPasswordCtrl', ['$http', 'resetPasswordService', 'encryptService', '$window', '$scope', function ($http, resetPasswordService, encryptService, $window, $scope) {
    $scope.sendEmail = function(){
        
        resetPasswordService.sendEmail($scope.email, function(res){
            console.log(res);
            
        })
    }
}]);
