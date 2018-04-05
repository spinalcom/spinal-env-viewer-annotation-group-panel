
angular.module('app.spinalforge.plugin')
    .factory('docPanelService',["$rootScope","$mdDialog",
        function($rootScope,$mdDialog){

            var factory = {};

            factory.deleteFile = (annotation,file) => {
                var dialog = $mdDialog.confirm()
                .ok("Delete !")
                .title('Do you want to remove it?')
                .cancel('Cancel')
                .clickOutsideToClose(true);

                $mdDialog.show(dialog)
                .then((result) => {

                    let mod = FileSystem._objects[annotation._server_id];
                    if (mod) {
                        for (var i = 0; i < mod.files.length; i++) {
                          if (mod.files[i]._server_id == file._server_id) {
                            mod.files.splice(i, 1);
                          } else {
                            console.log(mod.files[i]._server_id);
                            console.log(file._server_id);
                          }
                        }
                    } else console.log("mod null");

                },() => {console.log("error")})  

            }

            factory.downloadPtrFunc = (selected) => {
                return (model, error) => {
                  if (model instanceof Path) {
                    // window.open("/sceen/_?u=" + model._server_id, "Download");
                    var element = document.createElement('a');
                    element.setAttribute('href', "/sceen/_?u=" + model._server_id);
                    element.setAttribute('download', selected.name);
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }
                };
            };

            factory.downloadFile = (annotation,file) => {
                let mod = FileSystem._objects[annotation._server_id];
                for (let i = 0; i < mod.files.length; i++) {
                if (mod.files[i]._server_id == file._server_id) {
                    
                    var dialog = $mdDialog.confirm()
                .ok("Download")
                .title('Do you want download ' + file.name + ' ?')
                .cancel('Cancel')
                .clickOutsideToClose(true);

                $mdDialog.show(dialog)
                .then((result) => {
                    file.load(factory.downloadPtrFunc(file));
                }, function () {});

                    break;
                }
                }
            }


            factory.deleteLink = (annotation,link) => {
                var dialog = $mdDialog.confirm()
                .ok("Delete !")
                .title('Do you want to remove it?')
                .cancel('Cancel')
                .clickOutsideToClose(true);

                $mdDialog.show(dialog)
                .then((result) => {
                    let mod = FileSystem._objects[annotation._server_id];
                    if (mod) {
                    for (var i = 0; i < mod.links.length; i++) {
                        if (mod.links[i]._server_id == link._server_id) {
                        mod.links.splice(i, 1);
                        } else {
                        console.log(mod.links[i]._server_id);
                        console.log(link._server_id);
                        }
                    }
                    } else console.log("mod null");
                }, function () {});
            }

            factory.openLink = (link) => {
                window.open(link.link);
            }

            return factory;
            

        }])