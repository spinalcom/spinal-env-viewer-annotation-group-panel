angular.module('app.spinalcom')
  .factory('messagePanelService', ["$rootScope", "$compile", "$templateCache", "$http", "messagePanelFactory",
    function ($rootScope, $compile, $templateCache, $http, messagePanelFactory) {

      var currentNote;
      var init = false;
      var myCallback = null;

      return {

        hideShowPanel: (note) => {
          if (init == false) {
            init = true;
            this.panel = messagePanelFactory.getPanel();
          }

          if (!this.panel.isVisible()) {
            currentNote = note;
            this.panel.setVisible(true);
            this.panel.setTitle(note.title);
          } else if (this.panel.isVisible() && note._server_id == currentNote._server_id) {
            this.panel.setVisible(false);
          } else {
            currentNote = note;
            this.panel.setTitle(note.title);
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