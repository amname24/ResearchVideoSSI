// var loginPage = angular.module("loginPage", [])

videoApp.controller('loginCtrl', ['loginService', '$scope', '$state','$cookies',function (loginService, $scope, $state, $cookies) {

    $scope.login = function () {
        loginService.login($scope.email, $scope.password, function (res) {
            console.log(res.data)
            if (res.data.success) {
                username = res.data.username;
                var token = res.data.token;
                $cookies.put('token', token)
                $state.go('home')
                console.log($cookies.get('token'));
                
            } else
                alert('email or password is not correct');
        })
    };

}])