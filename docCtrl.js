// (function () {
    angular.module('app.spinalforge.plugin')
      .controller('docCtrl', ["$scope", "$rootScope", "$mdToast", "$mdDialog", "authService", "$compile", "$injector", "layout_uid", "spinalModelDictionary", "$q","$routeParams", "ngSpinalCore","messagePanelService","FilePanelService","docPanelService",
        function ($scope, $rootScope, $mdToast, $mdDialog, authService, $compile, $injector, layout_uid, spinalModelDictionary, $q, $routeParams,ngSpinalCore,messagePanelService,FilePanelService,docPanelService) {
          var viewer = v;



          spinalModelDictionary.init().then((m) => {
            if (m) {
              if (m.groupAnnotationPlugin) {
                m.groupAnnotationPlugin.load((mod) => {
                  $scope.themeListModel = mod;
                  $scope.themeListModel.bind($scope.onModelChange);
                });
              } else {
                $scope.themeListModel = new Lst();
                m.add_attr({
                  groupAnnotationPlugin: new Ptr($scope.themeListModel)
                });
                $scope.themeListModel.bind($scope.onModelChange);
              }
            }
          });

          $scope.onModelChange = () => {
            let promiseLst = [];
            for (var i = 0; i < $scope.themeListModel.length; i++) {
              let note = $scope.themeListModel[i];
              promiseLst.push(note.get_obj());
            }
  
            $q.all(promiseLst).then((res) => {
              $scope.themes = res;
            });
          };


          $scope.sendEvent = (eventName,annotation,other) => {
                switch (eventName) {
                  case "deletefile":
                    docPanelService.deleteFile(annotation,other);
                    break;

                  case "downloadfile":
                    docPanelService.downloadFile(annotation,other);
                    break;

                  case "deletelink":
                    docPanelService.deleteLink(annotation,other);
                    break;
                    
                  case "openlink":
                    docPanelService.openLink(annotation);
                    break;
                    
                }    

          }

          $scope.openMessage = (annotation) => {
            messagePanelService.hideShowPanel(annotation);
          }


          viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(){
            var ids = viewer.getSelection();
            var objecTemp;
            var doc = [];

            if(ids.length == 0)
                $scope.themes = $scope.themeListModel;

            for (var loop = 0; loop < ids.length; loop++) {
                let dbId = ids[loop];
                for (var k = 0; k < $scope.themeListModel.length; k++) {
                    var item = $scope.themeListModel[k];
                    
                    objecTemp = {
                        name : item.name,
                        listModel : []
                    }

                    for (var i = 0; i < item.listModel.length; i++) {
                        var annotation = item.listModel[i];
                        for (var j = 0; j < annotation.allObject.length; j++) {
                            var obj = annotation.allObject[j]
                            console
                            if(obj.dbId == dbId) {
                                objecTemp.listModel.push(annotation);
                            }
                        }
                    }
                    if(objecTemp.listModel.length > 0)
                        doc.push(objecTemp);
                }
                
            }
            if(ids.length > 0) {
                $scope.themes = doc;
                
            }
            $scope.$apply()

          });

          
          $scope.closeOpenList = (name,theme,annotation = null) => {
            var div,i;

            if(annotation == null) {
              div = $("#" + name + theme + 'div');
              i = $("i#" + name + theme);
            } else {
              div = $("#" + name + theme + annotation);
              i = $("i#i" + name + theme + annotation);

            }

            if(div.css('display') != 'block') {
              div.css('display','block');
              i.attr('class','fa fa-caret-down')
            } else {
              i.attr('class','fa fa-caret-right ')
              div.css('display','none');
            }
          }
            
          
          $scope.hideShowList = (name) => {
            var display = $("section." + name).css('display');

            if(display != 'block') {
              $("section." + name).css('display','block');
            } else {
              $("section." + name).css('display','none');
            }
          }

    }])
// })();