

angular.module('app.spinalforge.plugin')
    .controller("linkCtrl",["$scope","$mdDialog","authService","$q","linkPanelService","$templateCache","docPanelService",
      function($scope,$mdDialog,authService,$q,linkPanelService,$templateCache,docPanelService){
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
      
          linkPanelService.register((annotation) => {
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
      
          $scope.user = authService.get_user();


          $scope.addLink = (evt) => {
            let mod = FileSystem._objects[$scope.annotation._server_id];
            
            var dialog = $mdDialog.show({
              controller : ["$scope","$mdDialog",dialogCtrl],
              template : $templateCache.get('linkDialogTemplate.html'),
              parent : angular.element(document.body),
              targetEvent : evt,
              clickOutsideToClose : true
            })
            .then((result) => {
              var linkModel = new LinkModel();

              linkModel.label.set(result.label);
              linkModel.link.set(result.link);
              linkModel.owner.set($scope.user.id);
              linkModel.username.set($scope.user.username);

              if (mod) {
                mod.links.push(linkModel);
              }


            }, () => {
              console.log("error !");
            })
          }

          $scope.openLink = (link) => {
            window.open(link.link);
          }

          $scope.deleteLink = (link) => {

            docPanelService.deleteLink($scope.annotation,link);

            // var dialog = $mdDialog.confirm()
            // .ok("Delete !")
            // .title('Do you want to remove it?')
            // .cancel('Cancel')
            // .clickOutsideToClose(true);

            // $mdDialog.show(dialog)
            //   .then((result) => {
            //     let mod = FileSystem._objects[$scope.annotation._server_id];
            //     if (mod) {
            //       for (var i = 0; i < mod.links.length; i++) {
            //         if (mod.links[i]._server_id == link._server_id) {
            //           mod.links.splice(i, 1);
            //         } else {
            //           console.log(mod.links[i]._server_id);
            //           console.log(link._server_id);
            //         }
            //       }
            //     } else console.log("mod null");
            //   }, function () {});
          }

      }])

      // .controller("dialogController",["$scope","$mdDialog",function($scope,$mdDialog) {

      //   $scope.label = "";
      //   $scope.link = "";

      //   $scope.hide = function() {
      //     $mdDialog.hide()
      //   }

      //   $scope.cancel = function() {
      //     $mdDialog.cancel()
      //   }

      //   $scope.answer = function() {
      //     var params = {label : $scope.label, link : $scope.link}
      //     $mdDialog.hide(params);
      //   }

      // }])


      function dialogCtrl($scope,$mdDialog) {
        $scope.label = "";
        $scope.link = "";

        $scope.hide = function() {
          $mdDialog.hide()
        }

        $scope.cancel = function() {
          $mdDialog.cancel()
        }

        $scope.answer = function() {
          var params = {label : $scope.label, link : $scope.link}
          $mdDialog.hide(params);
        }


        $scope.$on("openlink",function(event,args) {
          console.log("download",args);
        })
  
        $scope.$on('deletelink',function(event,args) {
          console.log("delete",args);
        })

      }