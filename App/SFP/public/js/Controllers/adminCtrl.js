videoApp.controller('adminCtrl', ['$http', '$mdDialog', '$state', 'authService', 'adminService', 'encryptService', 'playlistService', 'videoService', 'loginService', '$window', '$scope',
    function ($http, $mdDialog, $state, authService, adminService, encryptService, playlistService, videoService, loginService, $window, $scope) {
        var self = this
        this.getPlaylists = function (user) {
            playlistService.playlists(user._id, function (res) {
                user.playlist = res.length
            })
        }
        this.getVideosWatched = function (user) {
            videoService.historysearch(user._id, function (res) {
                if(res.histories )
                user.videosWatched = res.histories.length 
                else user.videosWatched = 0
            })
        }
        this.loadUsers = function () {
            authService.verifyAdmin(function (resp) {
                if (resp.auth) {
                    $http.get('/admin/getAllUsers').then(function (res) {
                        console.log(res.data);
                        $scope.users = res.data
                        $scope.users.forEach(user => {
                            self.getPlaylists(user)
                            self.getVideosWatched(user)
                        });
                        console.log($scope.users);

                        return $scope.users
                    })
                } 
            })


        }
        $scope.users = this.loadUsers()
        $scope.logout = function(){
            loginService.logout()
        }
        $scope.editDialog = function (user) {
            authService.verifyAdmin(function (resp) {
                if (resp.auth) {
                    $scope.selectedAccount = user
                    console.log($scope.selectedAccount);

                    $mdDialog.show({
                        controller: DialogController,
                        templateUrl: 'editAccount.tmpl.html',
                        parent: angular.element(document.body),
                        isolateScope: false,
                        locals: {
                            users: $scope.users,
                            selectedAccount: $scope.selectedAccount
                        },
                        clickOutsideToClose: true,
                    }).then(function (res) {
                        if (res) {
                            var confirm = $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Confirmation Dialog')
                                .textContent('Successfully updated')
                                .ok('Got it!')
                                .multiple(true)
                            $mdDialog.show(confirm)
                            $scope.users = res

                        }
                    })
                }
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
                        $scope.users.push(resp)
                        jQuery("#myModal").modal("hide");
                        var confirm = $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Confirmation Dialog')
                            .textContent('New account has been successfully created')
                            .ok('Got it!')
                            .targetEvent(ev)
                            .multiple(true)
                        $mdDialog.show(confirm).then(function (res) {

                            console.log($scope.users);
                            // window.location.reload()
                        });
                    } else
                        $window.alert("cette adresse email est deja utilisée pour un autre compte !");
                });
            }


        }


    }
]);

function DialogController($scope, $mdDialog, users, selectedAccount, adminService, authService) {
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
    $scope.update = function () {
        authService.verifyAdmin(function (resp) {
            if (resp.auth) {
                if ($scope.selectedAccount.role_id != $scope.roleSelected ||
                    $scope.selectedAccount.status != $scope.statusSelected) {

                    var accountToUpdate = users.find(x => x._id == $scope.selectedAccount._id)
                    console.log('account found', accountToUpdate);
                    accountToUpdate.role_id = $scope.roleSelected
                    accountToUpdate.status = $scope.statusSelected

                    adminService.updateAccount(accountToUpdate, function (res) {
                        accountToUpdate = res
                        $mdDialog.hide(users)

                    })
                } else {
                    $mdDialog.hide()
                }
            }
        })

    }
}
