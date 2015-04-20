angular.module( 'thorvarium.login', [
  'ui.router',
  'angular-md5'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'login', {
    url: '/login',
    views: {
      "main": {
        controller: 'LoginCtrl',
        templateUrl: 'login/login.tpl.html'
      }
    },
    data:{ pageTitle: 'Login' }
  });
})

.controller( 'LoginCtrl', function LoginController( $rootScope, $scope, md5 ) {

  $scope.nickname = '';
  $scope.password = '';

  $scope.signin = function() {
    if ($scope.nickname && $scope.password) {
      
      var data = {nickname: $scope.nickname, password: md5.createHash($scope.password) };
      $.ajax({
        type: 'POST',
        url: apiUrl + '/login',
        data: data,
        dataType: 'json',
        success: function(result) {

          if (typeof result.uuid !== 'undefined') {
          
            $rootScope.user = result.user;

            var cookieOpts = { 
              expires: 7, 
              path: '/'
            };

            $.cookie('auth', result.uuid, cookieOpts);
            $.cookie('user', JSON.stringify($scope.user), cookieOpts);

            $scope.$apply(function() {
              $scope.go('/chat');
            });

          } else {
            $rootScope.errorHandler();
          }

        },
        error: $rootScope.errorHandler
      });
      
    }
  };

});