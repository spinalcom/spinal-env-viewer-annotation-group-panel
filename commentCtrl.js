angular.module('app.spinalforge.plugin')
  .controller('commentCtrl', ["$scope", "messagePanelService", "authService","$mdDialog","$q", function ($scope, messagePanelService, authService, $mdDialog,$q) {


    function getFileSystem(model) {
      return $q((resolve, reject) => {
        if(FileSystem._objects[model._server_id] != null) {
          resolve(FileSystem._objects[model._server_id])
        } else {
          console.log(model)
          reject("error")
        }
      })
    }


    let onChange = () => {
      getFileSystem($scope.messages)
        .then((data) => {
          $scope.messages = data.get_obj();
          
        },() => {
          console.log("error");
        })
        $scope.$apply();
      
    };

    messagePanelService.register((annotation) => {
      if ($scope.messages) {
        getFileSystem($scope.messages)
          .then((data) => {
            data.unbind(onChange);
          },() => {
            console.log("error");
          })
      }

      if (annotation) {
        $scope.messages = annotation;
        getFileSystem($scope.messages)
          .then((data) => {
            data.bind(onChange);
          },() => {
            console.log("error");
          }) 
      }
    });

    $scope.user = authService.get_user();

    $scope.messageText = "";

    $scope.removeMessage = (message) => {

      var dialog = $mdDialog.confirm()
            .ok("Delete !")
            .title('Do you want to remove it?')
            .cancel('Cancel')
            .clickOutsideToClose(true);

          $mdDialog.show(dialog)
            .then((result) => {
              getFileSystem($scope.messages)
                .then((data) => {

                  for (var i = 0; i < data.notes.length; i++) {
                    if (data.notes[i]._server_id == message._server_id) {
                      data.notes.splice(i, 1);
                    }
                  }
                }, () => {
                  console.log("error");
                })

                
              
            },() => {})

      

    };

    $scope.SendMessage = () => {
      // let mod = FileSystem._objects[$scope.messages._server_id];

      getFileSystem($scope.messages)
        .then((data) => {
          if ($scope.messageText != "" && $scope.messageText.trim() != "") {
            var message = new MessageModel();
            message.owner.set($scope.user.id);
            message.username.set($scope.user.username);
            message.message.set($scope.messageText);
    
            data.notes.push(message);
            $scope.messageText = "";
          }
        }, () => {
          console.log("error");
        })

      // if ($scope.messageText != "" && $scope.messageText.trim() != "") {
      //   var message = new MessageModel();
      //   message.owner.set($scope.user.id);
      //   message.username.set($scope.user.username);
      //   message.message.set($scope.messageText);

      //   if (mod) {
      //     mod.notes.push(message);
      //     $scope.messageText = "";
      //   }
      // }
    };

  }]);