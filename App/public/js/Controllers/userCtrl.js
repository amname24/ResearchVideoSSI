// var loginPage = angular.module("loginPage", [])

videoApp.controller('userCtrl', ['userService', '$scope', '$state','$cookies',function (userService, $scope, $state, $cookies) {
    $scope.load = function () {

    };


    $scope.login = function () {
        userService.login($scope.email, $scope.password, function (res) {
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

    $scope.load();
}])