angular.module( 'thorvarium.chat', [
  'ui.router',
  'luegg.directives'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'chat', {
    url: '/chat',
    views: {
      "main": {
        controller: 'ChatCtrl',
        templateUrl: 'chat/chat.tpl.html'
      }
    },
    data:{ pageTitle: 'Chat' }
  });
})

.controller( 'ChatCtrl', ['$rootScope', '$scope', 'Game', 'notificationService', 
  function ChatController( $rootScope, $scope, Game, $notify ) {

  $scope.message = '';
  $scope.members = [];
  $scope.messages = [];

  $scope.send = function() {
    if ($scope.message && $rootScope.ws) {
      if ($scope.message.length > 140) {
        $notify.error('Please don\'t abuse on the message size!');
      } else {
        $rootScope.ws.send(JSON.stringify({type: 'message', content: $scope.message}));
        $scope.message = '';  
      }
    }
  };

  $scope.invite = function(user) {

    $notify.notify({
      title: 'Confirmation Needed',
      text: 'You want to invite '+user.nickname+' to play?',
      addclass: 'confirmation',
      hide: false,
      icon: false,
      confirm: {
        confirm: true
      },
      buttons: {
        closer: false,
        sticker: false
      },
      history: {
        history: false
      }
    }).get().on('pnotify.confirm', function() {
      $rootScope.ws.send(JSON.stringify({type: 'invitation', to: user.id}));
    });
  };

  $scope.accept = function(invitation) {

    $notify.notify({
      title: 'Confirmation Needed',
      text: 'You want to start the game with '+invitation.from.nickname+'?',
      addclass: 'confirmation',
      hide: false,
      icon: false,
      confirm: {
        confirm: true
      },
      buttons: {
        closer: false,
        sticker: false
      },
      history: {
        history: false
      }
    }).get().on('pnotify.confirm', function() {
      $rootScope.ws.send(JSON.stringify({type: 'accept', from: invitation.from.id}));
    });
  };

  if (angular.isDefined($.cookie('auth')) && $.cookie('auth')) {

    $rootScope.ws = $rootScope.ws ? $rootScope.ws : new WebSocket(wsUrl);
    $rootScope.onMessageHandler = function(message) {
      
      switch(message.type) {
        case 'members':

          $scope.$apply(function(){
            $scope.members = _.filter(message.value, function(m) {
              return m.id != $rootScope.user.id;
            });
          });

        break;
        case 'message':

          var user = message.user == $scope.user.id ? angular.copy($scope.user) : 
          _.find($scope.members, function(x) {
            return x.id == message.user;
          });

          if (angular.isDefined(user)) {

            message.user = user;

            $scope.$apply(function(){
              $scope.messages.push(message);
            });
          }

          break;
        case 'invitation':

          var inviter = _.find($scope.members, function(x) {
            return x.id == message.from;
          });

          if (angular.isDefined(inviter)) {

            message.from = inviter;

            $scope.$apply(function(){
              $scope.messages.push(message);
            });
          }

          break;
        case 'game':

          if (angular.isDefined(message.id)) {

            $scope.$apply(function(){
              
              Game.create(message.id, 
                message.persons,
                message.weapons,
                new Date(message.now));

              $scope.go('/game');
            });
          }            

          break;
      }
    };

  } else {
    $scope.go('/login');
  }

}]);