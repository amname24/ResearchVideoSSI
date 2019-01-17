videoApp.controller('resetPasswordCtrl', ['$http', 'resetPasswordService', 'encryptService', '$window', '$scope','$state', function ($http, resetPasswordService, encryptService, $window, $scope,$state) {
    $scope.sendEmail = function(){
        
        $scope.sendEmail = function () {
            console.log($scope.email);


            resetPasswordService.sendEmail($scope.email, function (res) {
                console.log(res);

            })
        }
        $scope.verifyToken = function(){
            var token = $location.search().token
            resetPasswordService.verifyResetToken(token, function(res){
                console.log(res);
                
            })

        }
    }
    $scope.resetPassword = function(){
        var hashPw
        encryptService.encrypt($scope.Password, function (res) {
            console.log(res);
            hashPw = res
        })
        if (hashPw != null)
            resetPasswordService.reset(hashPw , function (resp) {
                if (resp.success) {
                    $window.alert(" votre mot de passe est changé !");
                    $state.go('login');
                } else{
                    $window.alert("une erreure est produite verifier le lien !");
                    $state.go('login');
                }
            });
    }
}]);
