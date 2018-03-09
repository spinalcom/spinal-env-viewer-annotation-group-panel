(function () {
  angular.module('app.spinalforge.plugin')
    .controller('annotationCtrl', ["$scope", "$rootScope", "$mdToast", "$mdDialog", "authService", "$compile", "$injector", "layout_uid", "spinalModelDictionary", "$q", "messagePanelService", "FilePanelService",
      function ($scope, $rootScope, $mdToast, $mdDialog, authService, $compile, $injector, layout_uid, spinalModelDictionary, $q, messagePanelService, FilePanelService) {
        var viewer = v;

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

        $scope.user = authService.get_user();
        $scope.headerBtnClick = (btn) => {
          if (btn.label == "add theme") {
            $scope.addTheme();
          }
        };

        $scope.headerBtn = [{
          label: "add theme",
          icon: "note_add"
        }];

        $scope.currentVisibleObj = [];

        $scope.themes = [];

        $scope.currentTheme;
        
        spinalModelDictionary.init().then((m) => {
          if (m) {
            if (m.groupAnnotationPlugin) {
              m.groupAnnotationPlugin.load((mod) => {
                $scope.themeListModel = mod;
                $scope.themeListModel.bind($scope.onModelChange);
                $scope.changeColorOnLoad(mod);
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


        $scope.changeColorOnLoad = (mod) => {
          console.log("changeColorOnLoad called !")
          for (var i = 0; i < mod.length; i++) {
            var theme = mod[i];
            for (var j = 0; j < theme.listModel.length; j++) {
              var annotation = theme.listModel[j];
              if(annotation.display.get() == true) {
                $scope.changeItemColor(theme,annotation);
                console.log("display true");
              }
            }
          }
        }

        $scope.onModelChange = () => {
          let promiseLst = [];
          for (var i = 0; i < $scope.themeListModel.length; i++) {
            let note = $scope.themeListModel[i];
            promiseLst.push(note.get_obj());
          }
          $q.all(promiseLst).then((res) => {
            $scope.themes = res;
            for (var i = 0; i < res.length; i++) {
              if ($scope.selectedNote && $scope.selectedNote._server_id == res[i]._server_id) {
                $scope.selectedNote = mod;
              }
              if ($scope.themes[i]._server_id == $scope.currentTheme){
                $scope.currentThemeSelected = $scope.themes[i];
                break;
              }

            }

            $scope.onDisplayChanged();
            
          });
        };


        $scope.onDisplayChanged = () => {
          let obj = []
          for (var i = 0; i < $scope.themes.length; i++) {
            let theme = $scope.themes[i]
            for (var j = 0; j < theme.listModel.length; j++) {
              var annotation = theme.listModel[j];
              if(annotation.display == true) {
                $scope.changeItemColor(theme,annotation)
              } else {
                $scope.restoreColor(theme,annotation)
              }
            }
          }





          // old_display_obj = obj;
        }

        $scope.addTheme = () => {
          $mdDialog.show($mdDialog.prompt()
            .title("Add Theme")
            .placeholder('Please enter the Name')
            .ariaLabel('Add Theme')
            .clickOutsideToClose(true)
            .required(true)
            .ok('Confirm').cancel('Cancel'))
            .then(function (result) {
              var newTheme = new ThemeModel();
              newTheme.name.set(result);
              newTheme.owner.set($scope.user.id);
              newTheme.username.set($scope.user.username);
              $scope.themeListModel.push(newTheme);
            }, () => { });
        };

        $scope.$on('colorpicker-closed', function (data1, data2) {
          
          console.log("currentThemeSelected",$scope.currentThemeSelected);

          for (var i = 0; i < $scope.currentThemeSelected.listModel.length; i++) {
            let annotation = $scope.currentThemeSelected.listModel[i];

              getFileSystem(annotation)
                .then((data) => {
                  data.color.set(annotation.color)
                },() => {
                  console.log("error !")
                })
                
          }
          
        });

        $scope.selectedNote = null;

        $scope.selectedStyle = (note) => {
          // if (note.listModel) {
          // }

          return note === $scope.selectedNote ? "background-color: #4185f4" : '';
        };

        $scope.getViewIcon = (note) => {
          return note.display ? "fa-eye-slash" : "fa-eye";
        };

        $scope.selectNote = (note) => {
          $scope.selectedNote = note;
        };

        $scope.renameNote = (note) => {
          // let mod = FileSystem._objects[note._server_id];
          
          $mdDialog.show($mdDialog.prompt()
            .title("Rename")
            .placeholder('Please enter the title')
            .ariaLabel('Rename')
            .clickOutsideToClose(true)
            .required(true)
            .ok('Confirm').cancel('Cancel'))
            .then(function (result) {

              //let mod = FileSystem._objects[note._server_id];
              getFileSystem(note)
                .then((data) => {
                  if(data.title) {
                    data.title.set(result)
                  } else {
                    data.name.set(result);
                  }
                })
              // if (mod) {
              //   if (mod.title)
              //     mod.title.set(result);
              //   else {
              //     mod.name.set(result);
              //   }
              // }
            }, () => { });
        };

        $scope.ViewAllNotes = (annotation) => {
          
          getFileSystem(annotation)
            .then((data) => {
              data.display.set(!annotation.display);
            })
        };

        $scope.addNoteInTheme = (theme) => {
          // let mod = FileSystem._objects[theme._server_id];
          $mdDialog.show($mdDialog.prompt()
            .title("Add Note")
            .placeholder('Please enter the title')
            .ariaLabel('Add Note')
            .clickOutsideToClose(true)
            .required(true)
            .ok('Confirm')
            .cancel('Cancel')
          )
            .then(function (result) {
            
              var annotation = new NoteModel();
              annotation.title.set(result);
              annotation.color.set('#000000');
              annotation.owner.set($scope.user.id);
              annotation.username.set($scope.user.username);

              getFileSystem(theme).then((data) => {
                data.listModel.push(annotation);
              },() => {
                console.log("error");
              })

              // if (mod) {
              //   mod.listModel.push(annotation);
              // } else {
              //   console.log("mod null");
              // }
            }, () => {
              console.log("canceled");
            });
        };

        $scope.deleteNote = (theme, note = null) => {
   
          var dialog = $mdDialog.confirm()
            .ok("Delete !")
            .title('Do you want to remove it?')
            .cancel('Cancel')
            .clickOutsideToClose(true);

          $mdDialog.show(dialog)
            .then((result) => {
              if (note != null) {
                for (var i = 0; i < $scope.themeListModel.length; i++) {
                  if ($scope.themeListModel[i]._server_id == theme._server_id) {
                    for (var j = 0; j < $scope.themeListModel[i].listModel.length; j++) {
                      var annotation = $scope.themeListModel[i].listModel[j];

                      if (annotation._server_id == note._server_id) {
                        $scope.themeListModel[i].listModel.splice(j, 1);
                        break;
                      }
                    }
                    break;
                  }
                }
              } else {
                for (var _i = 0; _i < $scope.themeListModel.length; _i++) {
                  if ($scope.themeListModel[_i]._server_id == theme._server_id) {
                    $scope.themeListModel.splice(_i, 1);
                    break;
                  }
                }
              }
            }, () => { });
        };

        $scope.addItemInNote = (annotation) => {
          var items = viewer.getSelection();

          if (items.length == 0) {
            alert('No model selected !');
            return;
          }

          viewer.model.getBulkProperties(items, {
            propFilter: ['name']
          }, (models) => {
            getFileSystem(annotation)
            .then((data) => {
              for (var i = 0; i < models.length; i++) {
                data.allObject.push(models[i]);
              }

              var toast = $mdToast.simple()
                .content("Item added !")
                .highlightAction(true)
                .position('bottom right')
                .parent('body');
              $mdToast.show(toast);

            },() => {
              console.log("error");
            })
          });
        };

        $scope.changeItemColor = (theme,annotation) => {
          var ids = [];
          
          getFileSystem(annotation).then((data) => {
            data.display.set(true);
            
            for (var i = 0; i < data.allObject.length; i++) {
              ids.push(data.allObject[i]);
            }

            viewer.setColorMaterial(ids,data.color.get(),data._server_id);
            $scope.verifyTheme(theme);

          },() => {
            console.log("error");
          })
        };

        $scope.restoreColor = (theme,annotation) => {
          var ids = [];

          getFileSystem(annotation).then((data) => {
            data.display.set(false)
            for(var i= 0; i < data.allObject.length;i++) {
              ids.push(data.allObject[i]);
            }
            viewer.restoreColorMaterial(ids,data._server_id);
            $scope.verifyTheme(theme);
          },() => {
            console.log("error");
          })
        };

        $scope.commentNote = (theme) => {
          messagePanelService.hideShowPanel(theme);
        };

        $scope.sendFile = (theme) => {
          FilePanelService.hideShowPanel(theme);
        };

        $scope.themeChanged = () => {
          for (let index = 0; index < $scope.themes.length; index++) {
            if ($scope.themes[index]._server_id == $scope.currentTheme){
              $scope.currentThemeSelected = $scope.themes[index];
              break;
            }
          }
        }

        $scope.exportTheme = (theme) => {
          
        }

        $scope.getViewIconTheme = (theme) => {
          return theme.viewAll ? "fa-eye-slash" : "fa-eye";
        }

        $scope.viewOrHideAllNote = (theme) => {
          if(theme.viewAll == true) {
            $scope.restoreAllItemColor(theme);
          } else {
            $scope.changeAllItemsColor(theme);
          }
        }


        $scope.changeAllItemsColor = (theme) => {
          var objects = [];
          var ids,color;
          getFileSystem(theme)
            .then((data) => {
              data.viewAll.set(true);
              for (var i = 0; i < data.listModel.length; i++) {
                data.listModel[i].display.set(true);
                let annotation = data.listModel[i]
                ids = [];
                for (var j = 0; j < annotation.allObject.length; j++) {
                  ids.push(annotation.allObject[j].dbId.get());
                }
                color = data.listModel[i].color.get();

                objects.push({
                  ids : ids,
                  color : color,
                  id : annotation._server_id
                })
              }

              viewer.colorAllMaterials(objects);
              
            },() => {
              console.log("error !")
            })
        }

        $scope.restoreAllItemColor = (theme) => {
          var objects = []
          var ids;

          getFileSystem(theme)
            .then((data) => {
              data.viewAll.set(false);
              for (var i = 0; i < data.listModel.length; i++) {
                data.listModel[i].display.set(false);
                let annotation = data.listModel[i]
                ids = [];
                for (var j = 0; j < annotation.allObject.length; j++) {
                  ids.push(annotation.allObject[j].dbId.get());
                }
                objects.push({
                  ids : ids,
                  id : annotation._server_id
                })
              }

              viewer.restoreAllMaterialColor(objects);
              
            },() => {
              console.log("error !")
            })

        }

        $scope.verifyTheme = (theme) => {

          getFileSystem(theme)
            .then((data) => {
              for (var i = 0; i < data.listModel.length; i++) {
                let annotation = data.listModel[i];
                if(annotation.display.get() == false) {
                  data.viewAll.set(false);
                  return;
                }
              }

              data.viewAll.set(true);
              
            },()=>{
              console.log("error !")
            })
        }

      }
    ]);
})();