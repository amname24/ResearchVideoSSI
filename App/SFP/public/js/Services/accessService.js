videoApp.factory("Access", ["$q", "loginService", function($q, loginService) {
		
    var Access = { OK: 200, UNAUTHORIZED: 401, FORBIDDEN: 403,
        isAuthenticated: function() {
            
            if (loginService.isLogged()) {
                return Access.OK;
            } else {
                return Promise.reject(Access.UNAUTHORIZED);
            }
            
        },
        isAnonymous: function() {
            
            if (UserFactory.isLogged()) {
                return Promise.reject(Access.FORBIDDEN);
            } else {
                return Access.OK;
            }
        } 
    };
    
    return Access;
    
}]);