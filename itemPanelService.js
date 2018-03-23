angular.module('app.spinalforge.plugin')
  .factory('itemPanelService', ["$rootScope", "$compile", "$templateCache", "$http", "itemPanelFactory",
    function ($rootScope, $compile, $templateCache, $http, itemPanelFactory) {

      var currentNote;
      var init = false;
      var myCallback = null;

      return {

        hideShowPanel: (note) => {
          if (init == false) {
            init = true;
            this.panel = itemPanelFactory.getPanel();
          }

          if (!this.panel.isVisible()) {
            currentNote = note;
            this.panel.setVisible(true);
            this.panel.setTitle("Objects | " + note.title);
          } else if (this.panel.isVisible() && note._server_id == currentNote._server_id) {
            this.panel.setVisible(false);
          } else {
            currentNote = note;
            this.panel.setTitle("Objects | " + note.title);
          }

          if (myCallback)
            myCallback(currentNote);
        },

        register: (callback) => {
          myCallback = callback;
          callback(currentNote);
        }

      };

    }
  ]);