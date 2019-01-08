videoApp.controller('adminCtrl', ['$http', '$mdDialog', 'adminService', 'encryptService', '$window', '$scope', function ($http, $mdDialog, adminService, encryptService, $window, $scope) {
    this.loadUsers = function () {
        // table = document.getElementById('data-table')
        $scope.selectedAccount
        $http.get('/admin/getAllUsers').then(function (res) {
            console.log(res.data);
            $scope.users = res.data

            return $scope.users
        })

    }

    $scope.showPrompt = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
            .title('What would you name your dog?')
            .textContent('Bowser is a common name.')
            .placeholder('Dog name')
            .ariaLabel('Dog name')
            .initialValue('Buddy')
            .targetEvent(ev)
            .ok('Okay!')
            .cancel('I\'m a cat person');

        $mdDialog.show(confirm).then(function (result) {
            $scope.status = 'You decided to name your dog ' + result + '.';
        }, function () {
            $scope.status = 'You didn\'t name your dog.';
        });
    };
    $scope.users = this.loadUsers()
    $scope.verify = function () {
        console.log('verify');

        $http.post('user/adminVerify').then(function (res) {
            console.log(res.data);
        });
    }
    $scope.editDialog = function (user) {
        $scope.selectedAccount = user
        console.log($scope.selectedAccount);
        
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'editAccount.tmpl.html',
            parent: angular.element(document.body),
            isolateScope: false,
            locals: {
                users : $scope.users,
                selectedAccount: $scope.selectedAccount
              },
            clickOutsideToClose:true,
          }).then(function(res){
              $scope.users = res
          })

    }

    $scope.create = function (ev) {
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

            adminService.createAccount(newUser, function (resp) {
                if (resp) {
                    jQuery("#myModal").modal("hide");
                    var confirm = $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Confirmation Dialog')
                        .textContent('New account has been successfully created')
                        .ok('Got it!')
                        .targetEvent(ev)
                        .multiple(true)
                    $mdDialog.show(confirm).then(function (res) {
                        $scope.users.push(resp)
                        console.log($scope.users);
                        window.location.reload()
                    });
                } else
                    $window.alert("cette adresse email est deja utilisée pour un autre compte !");
            });
        }


    }


}]);

function DialogController($scope, $mdDialog, users, selectedAccount, adminService) {
    $scope.selectedAccount = selectedAccount
    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
    $scope.update = function(){ 
        if($scope.selectedAccount.role_id != $scope.roleSelected ||
        $scope.selectedAccount.status != $scope.statusSelected){
            
            var accountToUpdate = users.find(x=>x._id == $scope.selectedAccount._id)
            console.log('account found', accountToUpdate);
            accountToUpdate.role_id = $scope.roleSelected
            accountToUpdate.status = $scope.statusSelected
                  
            adminService.updateAccount(accountToUpdate, function(res){
                accountToUpdate = res
                $mdDialog.hide(users)
                
            })
        }
      
        
    }
}
