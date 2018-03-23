angular.module('app.spinalforge.plugin')
  .controller('itemCtrl', ["$scope", "$mdDialog", "itemPanelService", "authService","$q",
    function ($scope, $mdDialog, itemPanelService, authService , $q) {


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
        let obj = FileSystem._objects[$scope.annotation._server_id];

        obj.get_obj().then(function (res) {
          $scope.annotation = res;
          $scope.$apply();
        })

      };

      itemPanelService.register((annotation) => {
        if ($scope.annotation) {

          getFileSystem($scope.annotation)
            .then((data) => {
              data.unbind(onChange);
            }, () => {
              console.log("error !");
            })
 
            
        }
        if (annotation) {
          $scope.annotation = annotation;
          getFileSystem($scope.annotation)
            .then((data) => {
              data.bind(onChange)
            }, () => {
              console.log("error !");
            })

        }
      });


      $scope.deleteObject = (id) => {
        var dialog = $mdDialog.confirm()
        .ok("Delete !")
        .title('Do you want to remove it?')
        .cancel('Cancel')
        .clickOutsideToClose(true);

      $mdDialog.show(dialog)
        .then((result) => {
          let mod = FileSystem._objects[$scope.annotation._server_id];
          if (mod) {
            for (var i = 0; i < mod.allObject.length; i++) {
              if (mod.allObject[i].dbId == id) {
                mod.allObject.splice(i, 1);
              } else {
                console.log(mod.files[i]._server_id);
                console.log(file._server_id);
              }
            }
          } else console.log("mod null");
        }, function () {});
      }

}])