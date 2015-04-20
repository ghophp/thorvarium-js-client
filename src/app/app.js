angular.module( 'thorvarium', [
  'templates-app',
  'templates-common',
  'thorvarium.home',
  'thorvarium.login',
  'thorvarium.chat',
  'thorvarium.game.bullet',
  'thorvarium.game.person',
  'thorvarium.game.loop',
  'thorvarium.game',
  'ui.bootstrap',
  'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $window, $rootScope, $scope, $location ) {
  
  $scope.go = function ( path ) {
    $location.path( path );
  };

  $scope.logout = function () {

    if(angular.isDefined($.cookie('auth'))) {

      var data = {auth: $.cookie('auth') };
      $.ajax({
        type: 'POST',
        url: apiUrl + '/logout',
        data: data,
        dataType: 'json',
        success: function(result) {

          $.removeCookie('auth');
          $.removeCookie('user');

          $scope.$apply(function() {
            $window.location.reload();
          });

        },
        error: $rootScope.errorHandler
      });

    } else {
      $scope.go('/login');
    }
  };

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if (angular.isDefined( toState.data.pageTitle)) {
      $scope.pageTitle = toState.data.pageTitle + ' | Thorvarium';
    }
  });

  $rootScope.errorHandler = function(error) {

    if (angular.isDefined(error.responseText) && error.responseText) {
      error = $.parseJSON(error.responseText);  
    }
    
    if (angular.isDefined(error.cause)) {

      if (error.cause === 'user_not_found') {
        alert('User not found!');
      } else if (error.cause === 'invalid_params') {
        alert('Invalid params!');
      }

    } else {
      alert('Some error occured, please try again!');
    }
  };

  if(angular.isDefined($.cookie('user'))) {
    $rootScope.user = $.parseJSON($.cookie('user'));
  }

  $rootScope.ws = null;

})

;

