videoApp.controller('resetPasswordCtrl', ['$http', 'resetPasswordService', 'encryptService', '$window', '$scope', '$location',
    function ($http, resetPasswordService, encryptService, $window, $scope, $location) {
        
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
]);
