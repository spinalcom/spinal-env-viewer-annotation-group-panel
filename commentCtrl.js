angular.module('app.spinalforge.plugin')
  .controller('commentCtrl', ["$scope", "messagePanelService", "authService", function ($scope, messagePanelService, authService) {

    let onChange = () => {
      let obj = FileSystem._objects[$scope.messages._server_id];
      $scope.messages = obj.get_obj();
      $scope.$apply();
    };

    messagePanelService.register((annotation) => {
      if ($scope.messages) {
        let obj = FileSystem._objects[$scope.messages._server_id];
        if (obj)
          obj.unbind(onChange);
      }
      if (annotation) {
        $scope.messages = annotation;
        let obj = FileSystem._objects[$scope.messages._server_id];
        if (obj)
          obj.bind(onChange);
      }
    });

    $scope.user = authService.get_user();

    $scope.messageText = "";

    $scope.removeMessage = (message) => {
      let mod = FileSystem._objects[$scope.messages._server_id];

      if (mod) {
        for (var i = 0; i < mod.notes.length; i++) {
          if (mod.notes[i]._server_id == message._server_id) {
            mod.notes.splice(i, 1);
          }
        }
      }

    };

    $scope.SendMessage = () => {
      let mod = FileSystem._objects[$scope.messages._server_id];
      if ($scope.messageText != "" && $scope.messageText.trim() != "") {
        var message = new MessageModel();
        message.owner.set($scope.user.id);
        message.username.set($scope.user.username);
        message.message.set($scope.messageText);

        if (mod) {
          mod.notes.push(message);
          $scope.messageText = "";
        }
      }
    };

  }]);