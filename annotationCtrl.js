(function () {
  angular.module('app.spinalforge.plugin')
    .controller('annotationCtrl', ["$scope", "$rootScope", "$mdToast", "$mdDialog", "authService", "$compile", "$injector", "layout_uid", "spinalModelDictionary", "$q", "messagePanelService", "FilePanelService",
      function ($scope, $rootScope, $mdToast, $mdDialog, authService, $compile, $injector, layout_uid, spinalModelDictionary, $q, messagePanelService, FilePanelService) {
        var viewer = v;
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
            console.log(res);
            $scope.themes = res;
            for (var i = 0; i < res.length; i++) {
              if ($scope.selectedNote && $scope.selectedNote._server_id == res[i]._server_id) {
                $scope.selectedNote = mod;
              }
            }
          });
        };

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
          console.log(data1);
          console.log(data2);
          // update moedels via $scope.themes
          for (var i = 0; i < $scope.themes.length; i++) {
            let note = $scope.themes[i];
            for (var j = 0; j < note.listModel.length; j++) {
              let annotation = note.listModel[j];
              let mod = FileSystem._objects[annotation._server_id];
              if (mod) {
                mod.color.set(annotation.color);
              }
            }
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
          $mdDialog.show($mdDialog.prompt()
            .title("Rename")
            .placeholder('Please enter the title')
            .ariaLabel('Rename')
            .clickOutsideToClose(true)
            .required(true)
            .ok('Confirm').cancel('Cancel'))
            .then(function (result) {
              let mod = FileSystem._objects[note._server_id];
              if (mod) {
                if (mod.title)
                  mod.title.set(result);
                else {
                  mod.name.set(result);
                }
              }
            }, () => { });
        };

        $scope.ViewAllNotes = (theme) => {
          if (theme.display) {
            $scope.restoreColor(theme);
          } else {
            $scope.changeItemColor(theme);
          }
        };

        $scope.addNoteInTheme = (theme) => {
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
              let mod = FileSystem._objects[theme._server_id];
              var annotation = new NoteModel();
              annotation.title.set(result);
              annotation.color.set('#000000');
              annotation.owner.set($scope.user.id);
              annotation.username.set($scope.user.username);
              if (mod) {
                mod.listModel.push(annotation);
              } else {
                console.log("mod null");
              }
            }, () => {
              console.log("canceled");
            });
        };

        $scope.deleteNote = (theme, note = null) => {
          console.log(note);
          var dialog = $mdDialog.confirm()
            .ok("Delete !")
            .title('Do you want to remove it?')
            .cancel('Cancel')
            .clickOutsideToClose(true);

          $mdDialog.show(dialog)
            .then((result) => {
              if (note != null) {
                for (var i = 0; i < $scope.themeListModel.length; i++) {
                  var themeS = $scope.themeListModel[i];
                  if (themeS._server_id == theme._server_id) {
                    for (var j = 0; j < themeS.listModel.length; j++) {
                      var annotation = themeS.listModel[j];

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
                  var _themeS = $scope.themeListModel[_i];
                  if (_themeS._server_id == theme._server_id) {
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
            let mod = FileSystem._objects[annotation._server_id];
            if (mod) {
              for (var i = 0; i < models.length; i++) {
                mod.allObject.push(models[i]);
              }
              var toast = $mdToast.simple()
                .content("Item added !")
                .highlightAction(true)
                .position('bottom right')
                .parent("body");
              $mdToast.show(toast);
            }
          });
        };


        $scope.changeItemColor = (theme) => {
          var ids = [];
          let mod = FileSystem._objects[theme._server_id];

          if (mod) {
            for (var i = 0; i < mod.allObject.length; i++) {
              ids.push(mod.allObject[i]);
            }
            mod.display.set(true);
            console.log(mod.color);
            viewer.setColorMaterial(ids, theme.color, mod._server_id);
          }
        };


        $scope.restoreColor = (theme) => {
          var ids = [];
          let mod = FileSystem._objects[theme._server_id];

          if (mod) {
            for (var i = 0; i < mod.allObject.length; i++) {
              ids.push(mod.allObject[i]);
            }
            mod.display.set(false);
            viewer.restoreColorMaterial(ids, mod._server_id);
          }
        };

        $scope.commentNote = (theme) => {
          messagePanelService.hideShowPanel(theme);
        };

        $scope.sendFile = (theme) => {
          FilePanelService.hideShowPanel(theme);
        };



        // changeAllItemsColor() {
        //   var objects = [];
        //   var notes = this.model;
        //   for (var i = 0; i < notes.length; i++) {
        //     var ids = [];
        //     var color;
        //     for (var j = 0; j < notes[i].allObject.length; j++) {
        //       ids.push(notes[i].allObject[j].dbId.get());
        //     }
        //     color = notes[i].color.get();
        //     objects.push({
        //       ids: ids,
        //       color: color,
        //       id: notes[i].id
        //     });
        //   }
        //   this.viewer.colorAllMaterials(objects);
        // }

        // restoreAllItemsColor() {
        //   var objects = [];
        //   var notes = this.model;
        //   for (var i = 0; i < notes.length; i++) {
        //     var ids = [];

        //     for (var j = 0; j < notes[i].allObject.length; j++) {
        //       ids.push(notes[i].allObject[j].dbId.get());
        //     }
        //     objects.push({
        //       ids: ids,
        //       id: notes[i].id
        //     });
        //   }
        //   this.viewer.restoreAllMaterialColor(objects);
        // }

      }
    ]);
})();