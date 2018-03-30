
(function () {
require("./annotationGroupModel")
  let appSpinalforgePlugin = angular.module('app.spinalforge.plugin');
  appSpinalforgePlugin.run(["$rootScope", "$compile", "$templateCache", "$http", "spinalRegisterViewerPlugin",
    function ($rootScope, $compile, $templateCache, $http, spinalRegisterViewerPlugin) {
      spinalRegisterViewerPlugin.register("PanelAnnotation");

      let load_template = (uri, name) => {
        $http.get(uri).then((response) => {
          $templateCache.put(name, response.data);
        }, (errorResponse) => {
          console.log('Cannot load the file ' + uri);
        });
      };
      let toload = [{
        uri: '../templates/spinal-env-viewer-annotation-group-panel/annotationTemplate.html',
        name: 'annotationTemplate.html'
      }, {
        uri: '../templates/spinal-env-viewer-annotation-group-panel/commentTemplate.html',
        name: 'commentTemplate.html'
      },
      {
        uri: '../templates/spinal-env-viewer-annotation-group-panel/linkDialogTemplate.html',
        name: 'linkDialogTemplate.html'
      },
      {
        uri: '../templates/spinal-env-viewer-annotation-group-panel/docTemplate.html',
        name: 'docTemplate.html'
      }];
      
      for (var i = 0; i < toload.length; i++) {
        load_template(toload[i].uri, toload[i].name);
      }

      class PanelAnnotation {
        constructor(viewer, options) {
          Autodesk.Viewing.Extension.call(this, viewer, options);
          this.viewer = viewer;
          this.panel = null;
          this.docPanel;
        }

        load() {
          if (this.viewer.toolbar) {
            this.createUI();
          } else {
            this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
            this.viewer.addEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
          }
          return true;
        }

        onToolbarCreated() {
          this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
          this.onToolbarCreatedBinded = null;
          this.createUI();
        }

        unload() {
          this.viewer.toolbar.removeControl(this.subToolbar);
          return true;
        }

        createUI() {
          var title = 'Annotation';
          this.panel = new PanelClass(this.viewer, title);
          var button1 = new Autodesk.Viewing.UI.Button('Annotation');

          button1.onClick = (e) => {
            if (!this.panel.isVisible()) {
              this.panel.setVisible(true);
            } else {
              this.panel.setVisible(false);
            }
          };

          button1.addClass('fa');
          button1.addClass('fa-pencil');
          button1.addClass('fa-2x');
          button1.setToolTip('Annotation');


          var docTitle = 'Doc';
          this.docPanel = new PanelClass(this.viewer, docTitle);
          var button2 = new Autodesk.Viewing.UI.Button(docTitle);

          button2.onClick = (e) => {
            if(!this.docPanel.isVisible()) {
              this.docPanel.setVisible(true);
            } else {
              this.docPanel.setVisible(false);
            }
          }

          button2.addClass('fa');
          button2.addClass('fa-cogs');
          button2.addClass('fa-2x');
          button2.setToolTip('Documentation');


          this.subToolbar = this.viewer.toolbar.getControl("my-Annotation");
          if (!this.subToolbar) {
            this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('my-Annotation');
            this.viewer.toolbar.addControl(this.subToolbar);
          }
          this.subToolbar.addControl(button1);
          this.subToolbar.addControl(button2);
          this.initialize(this.panel,"annotationCtrl","annotationTemplate");
          this.initialize(this.docPanel,"docCtrl","docTemplate");
        }

        initialize(argPanel,argController,argTemplate) {

          var _container = document.createElement('div');
          _container.style.height = "calc(100% - 45px)";
          _container.style.overflowY = 'auto';

          argPanel.container.appendChild(_container);

          $(_container).html("<div ng-controller=" + argController + " class=\"panelContent\" ng-cloak>" +
          $templateCache.get(argTemplate + ".html") + "</div>");
          $compile($(_container).contents())($rootScope);
        }
      } // end class
      Autodesk.Viewing.theExtensionManager.registerExtension('PanelAnnotation', PanelAnnotation);
    } // end run
  ]);

  require("./filter")
  require("./annotationCtrl");

  require("./docCtrl");

  require("./FilePanelFactory");
  require("./FilePanelService");
  require("./fileCtrl");

  require("./MessagePanel");
  require("./messagePanelFactory");
  require("./messagePanelService");
  require("./commentCtrl");

  require("./linkCtrl");
  require("./linkPanelFactory");
  require("./linkPanelService");

  require("./itemCtrl");
  require("./itemPanelFactory");
  require("./itemPanelService");

})();