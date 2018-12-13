// var loginPage = angular.module("loginPage", [])

videoApp.controller('loginCtrl', ['loginService', 'encryptService', '$scope', '$state', '$cookies','$location', function (loginService, encryptService, $scope, $state, $cookies, $location) {

    $scope.login = function () {
        var hashPw
        encryptService.encrypt($scope.password, function (res) {
            console.log(res);            
            hashPw = res
        })
        if (hashPw != null)
            loginService.login($scope.email, hashPw, function (res) {
                console.log(res.data)
                if (res.data.success) {
                    username = res.data.username;
                    var token = res.data.token;
                    var now = new Date()
                    $cookies.put('token', token, {expires: new Date(now.getFullYear(), now.getMonth()+1, now.getDate())})
                    $state.go('/home')
                    // $location.path('/');
                    console.log($cookies.get('token'));

                } else
                    alert('email or password is not correct');
            })
    };

}])