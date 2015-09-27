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
  'ui.router',
  'jlareau.pnotify'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, notificationServiceProvider ) {

  notificationServiceProvider.setDefaults({
    styling: 'bootstrap3',
    hide: false,
    icon: false,
    buttons: {
      sticker: false
    }
  });
  
  $urlRouterProvider.otherwise( '/home' );

})

.run( function run () {
})

.controller( 'AppCtrl', ['$window', '$rootScope', '$scope', '$location', 'notificationService',
  function AppCtrl ( $window, $rootScope, $scope, $location, $notify ) {
  
  $scope.go = function ( path ) {
    $location.path( path );
  };
  $scope.asset = function ( path ) {
    return assetsUrl + '/' + path;
  };

  $scope.logout = function () {

    if(angular.isDefined($.cookie('auth')) && $.cookie('auth')) {

      var data = {auth: $.cookie('auth') };
      $.ajax({
        type: 'POST',
        url: apiUrl + '/logout',
        data: data,
        dataType: 'json',
        success: function(result) {

          $.removeCookie('auth', { path: '/' });
          $.removeCookie('user', { path: '/' });

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
      try {
        error = $.parseJSON(error.responseText);  
      } catch(e) {
        console.log(e);
      }
      
    }
    
    if (angular.isDefined(error.cause)) {

      if (error.cause === 'user_not_found') {
        $notify.error('User not found!');
      } else if (error.cause === 'invalid_params') {
        $notify.error('Invalid params!');
      }

    } else {
      $notify.error('Some error occured, please try again!');
    }
  };

  if(angular.isDefined($.cookie('user')) && $.cookie('user')) {
    $rootScope.user = $.parseJSON($.cookie('user'));
  }

  $rootScope.ws = null;
  $rootScope.onMessageHandler = null;

  $rootScope.messageWrapper = function(message, callback) {
    
    message = $.parseJSON(message.data);
    console.log('Received message: ', message);

    if (angular.isDefined(message.type)) {

        switch(message.type) {
          case 'ping':
            $rootScope.ws.send(JSON.stringify({"type": "pong"}));
            break;
          default:
            callback(message);
            break;
        }
    }
  };

  $rootScope.$watch('ws', function(newValue, oldValue) {
    if ($rootScope.ws != null) {
      $rootScope.ws.onmessage = function(message) {
        $rootScope.messageWrapper(message, $rootScope.onMessageHandler);
      };
      $rootScope.ws.onclose = function() {
        $notify.error('Your connection with the server was lost.');
      };
    }
  });

}])

;

