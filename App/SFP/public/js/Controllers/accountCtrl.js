videoApp.controller('accountCtrl', ['$http', 'adminService', 'encryptService', '$window', '$scope', function ($http, adminService, encryptService, $window, $scope) {
    this.loadUsers = function () {
        // table = document.getElementById('data-table')
        $http.get('/admin/getAllUsers').then(function (res) {
            console.log(res.data);
            $scope.users = res.data

            return $scope.users
        })

    }
    $scope.users = this.loadUsers()
    $scope.verify = function () {
        console.log('verify');

        $http.post('user/adminVerify').then(function (res) {
            console.log(res.data);
        });
    }

    $scope.create = function () {
        console.log($scope.users);
        var hashPw
        encryptService.encrypt($scope.Password, function (res) {
            console.log(res);
            hashPw = res
        })
       
        if (hashPw != null) {
            var newUser = {
                name: $scope.Name,
                email: $scope.Email,
                password: hashPw,
                role: $scope.roleSelected,
                status: $scope.statusSelected
            }
            console.log(newUser);
            adminService.createAccount(newUser, function (resp) {
                if (resp) {
                    $window.alert(" Un compte est créé !");
                    jQuery("#myModal").modal("hide");
                    $scope.users.push(resp)
                    window.location.reload()
                    
                } else
                    $window.alert("cette adresse email est deja utilisée pour un autre compte !");
            });
        }


    }
    $scope.$watch($scope.users, function(){
        console.log('new users');
        
    }, true);
    
}]);
