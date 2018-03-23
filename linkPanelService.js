angular.module('app.spinalforge.plugin')
  .factory('linkPanelService', ["$rootScope", "$compile", "$templateCache", "$http", "linkPanelFactory",
    function ($rootScope, $compile, $templateCache, $http, linkPanelFactory) {
        var currentNote;
        var init = false;
        var myCallback = null;

        return {

            hideShowPanel: (note) => {
                if (init == false) {
                    init = true;
                    this.panel = linkPanelFactory.getPanel();
                }

                if (!this.panel.isVisible()) {
                    currentNote = note;
                    this.panel.setVisible(true);
                    this.panel.setTitle("Link | " + note.title);
                } else if (this.panel.isVisible() && note._server_id == currentNote._server_id) {
                    this.panel.setVisible(false);
                } else {
                    currentNote = note;
                    this.panel.setTitle("Link | " + note.title);
                }

                if (myCallback)
                    myCallback(currentNote);
            },

            register: (callback) => {
                myCallback = callback;
                callback(currentNote);
            }

        };

    }])