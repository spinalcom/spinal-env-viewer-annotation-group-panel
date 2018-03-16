angular.module('app.spinalforge.plugin')
  .factory('linkPanelFactory', ["$rootScope", "$compile", "$templateCache", "$http",
    function ($rootScope, $compile, $templateCache, $http) {
      let load_template = (uri, name) => {
        $http.get(uri).then((response) => {
          $templateCache.put(name, response.data);
        }, (errorResponse) => {
          console.log('Cannot load the file ' + uri);
        });
      };
      let toload = [{
        uri: '../templates/spinal-env-viewer-annotation-group-panel/linkTemplate.html',
        name: 'linkTemplate.html'
      }];
      for (var i = 0; i < toload.length; i++) {
        load_template(toload[i].uri, toload[i].name);
      }

      this.panel = new PanelClass(v, "message Panel");
      this.panel.container.style.right = "0px";
      this.panel.container.style.width = "400px";
      this.panel.container.style.height = "600px";
      this.panel.container.padding = "0px";

      var _container = document.createElement('div');
      _container.style.height = "calc(100% - 45px)";
      _container.style.overflowY = 'auto';
      this.panel.container.appendChild(_container);

      var init = false;
      return {
        getPanel: () => {
          if (init == false) {
            init = true;
            $(_container).html("<div ng-controller=\"linkCtrl\" class=\"panelContent\" ng-cloak>" +
              $templateCache.get("linkTemplate.html") + "</div>");
            $compile($(_container).contents())($rootScope);
          }
          return this.panel;
        }
      };

    }
  ]);