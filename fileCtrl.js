angular.module('app.spinalforge.plugin')
  .controller('fileCtrl', ["$scope", "$mdDialog", "FilePanelService", "authService","$q","$rootScope","docPanelService",
    function ($scope, $mdDialog, FilePanelService, authService , $q, $rootScope,docPanelService) {


      $scope.$on("downloadfile",function(event,args) {
        console.log("download",args);
      })

      $scope.$on("deletefile",function(event,args) {
        console.log("delete",args);
      })


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
        let obj = FileSystem._objects[$scope.files._server_id];

        obj.get_obj().then(function (res) {
          $scope.files = res;
          $scope.$apply();
        })

      };

      FilePanelService.register((annotation) => {
        if ($scope.files) {

          getFileSystem($scope.files)
            .then((data) => {
              data.unbind(onChange);
            }, () => {
              console.log("error !");
            })
 
            
        }
        if (annotation) {
          $scope.files = annotation;
          getFileSystem($scope.files)
            .then((data) => {
              data.bind(onChange)
            }, () => {
              console.log("error !");
            })

        }
      });

      $scope.user = authService.get_user();

      $scope.deleteFile = (file) => {
        docPanelService.deleteFile($scope.files,file);
        
        // var dialog = $mdDialog.confirm()
        //   .ok("Delete !")
        //   .title('Do you want to remove it?')
        //   .cancel('Cancel')
        //   .clickOutsideToClose(true);

        // $mdDialog.show(dialog)
        //   .then((result) => {
        //     let mod = FileSystem._objects[$scope.files._server_id];
        //     if (mod) {
        //       for (var i = 0; i < mod.files.length; i++) {
        //         if (mod.files[i]._server_id == file._server_id) {
        //           mod.files.splice(i, 1);
        //         } else {
        //           console.log(mod.files[i]._server_id);
        //           console.log(file._server_id);
        //         }
        //       }
        //     } else console.log("mod null");
        //   }, function () {});
      };

      // $scope.downloadPtrFunc = (selected) => {
      //   return (model, error) => {
      //     if (model instanceof Path) {
      //       // window.open("/sceen/_?u=" + model._server_id, "Download");
      //       var element = document.createElement('a');
      //       element.setAttribute('href', "/sceen/_?u=" + model._server_id);
      //       element.setAttribute('download', selected.name);
      //       element.style.display = 'none';
      //       document.body.appendChild(element);
      //       element.click();
      //       document.body.removeChild(element);
      //     }
      //   };
      // };

      $scope.downloadFile = (file) => {
        docPanelService.downloadFile($scope.files,file);
        // let mod = FileSystem._objects[$scope.files._server_id];
        // for (let i = 0; i < mod.files.length; i++) {
        //   if (mod.files[i]._server_id == file._server_id) {
            
        //     var dialog = $mdDialog.confirm()
        //   .ok("Download")
        //   .title('Do you want download ' + file.name + ' ?')
        //   .cancel('Cancel')
        //   .clickOutsideToClose(true);

        // $mdDialog.show(dialog)
        //   .then((result) => {
        //     file.load($scope.downloadPtrFunc(file));
        //   }, function () {});

        //     break;
        //   }
        // }
      };

      window.handle_files = (event) => {
        let mod = FileSystem._objects[$scope.files._server_id];
        var filePath;
        if (event.target) {
          if (mod) {
            for (let i = 0; i < event.target.files.length; i++) {
              const element = event.target.files[i];
              filePath = new Path(element);
              mod.files.force_add_file(element.name, filePath);
              $scope.$apply();
            }
          }
        }
      };


      

    }
  ]);