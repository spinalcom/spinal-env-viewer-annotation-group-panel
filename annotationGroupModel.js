// Copyright 2015 SpinalCom  www.spinalcom.com

// This file is part of SpinalCore.

// SpinalCore is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Soda is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with Soda. If not, see <http://www.gnu.org/licenses/>.
var exports = module.exports = {};

function modelRdy_defer(model, promise) {
  if (!model._server_id || FileSystem._tmp_objects[model._server_id]) {
    setTimeout(() => {
      modelRdy_defer(model, promise);
    }, 200);
    return;
  }
  promise(model);
}

function waitModelReady(model) {
  return new Promise(function (resolve, reject) {
    modelRdy_defer(model, resolve);
  });
}

// var ForgeFileDerivativesItem = class ForgeFileDerivativesItem extends Model {
//   constructor(params) {
//     super();
//     if (!params) {
//       params = {};
//     }
//     if ((params != null ? params.name : void 0) == null) {
//       params.name = "unnamed";
//     }
//     if ((params != null ? params.path : void 0) == null) {
//       params.path = ".";
//     }
//     this.add_attr({
//       name: params.name,
//       path: params.path
//     });
//     this._name = this.name;
//   }

//   add_child(child) {
//     this._children.push(child);
//   }

//   accept_child(ch) {
//     return false;
//   }
// };

// exports.ForgeFileDerivativesItem = ForgeFileDerivativesItem;

// var ForgeFileItem = class ForgeFileItem extends Model {
//   constructor(name = "Forge File") {
//     super();
//     let tmp = {
//       _name: name,
//       _viewable: false,
//       _children: [],
//       name: name,
//       filepath: new Path(),
//       state: new Choice(0, ["Initial",
//         "Uploading", "Uploading completed",
//         "Uploading to forge", "Upload to forge completed",
//         "Translating", "Translating completed",
//         "Export completed", "Failed"
//       ]),
//       urn: "",
//       ask_token: false,
//       oauth: "",
//       bucket_key: ""
//     };
//     this.add_attr(tmp);
//   }
//   add_child(child) {
//     this._children.push(child);
//   }
//   accept_child(ch) {
//     return (ch instanceof ForgeFileDerivativesItem);
//   }
// };

// exports.ForgeFileItem = ForgeFileItem;


var ThemeModel = class ThemeModel extends Model {
  constructor() {
    super();
    this.add_attr({
      name: "",
      owner: "",
      username: "",
      creation: Date.now(),
      viewAll : false,
      listModel: []
    });
  }

  get_obj() {
    let _self = this;
    return new Promise((resolve, reject) => {
      waitModelReady(_self).then(() => {
        let obj = {
          name: _self.name.get(),
          owner: _self.owner.get(),
          username: _self.username.get(),
          creation: _self.creation.get(),
          viewAll : _self.viewAll.get(),
          _server_id: _self._server_id
        };
        let listModel = [], i = 0;
        for (; i < _self.listModel.length; i++) {
          listModel.push(_self.listModel[i].get_obj());
        }
        Promise.all(listModel).then(function (res) {
          obj.listModel = res;
          resolve(obj);
        });
      });
    });
  }
};
exports.ThemeModel = ThemeModel;

var NoteModel = class NoteModel extends Model {
  constructor(name = "NoteModel") {
    super();

    this.add_attr({
      title: '',
      color: '',
      owner: '',
      username: '',
      date: Date.now(),
      allObject: [],
      notes: [],
      display: false,
      files: new Directory(),
      links : [],
    });
  }

  get_obj() {
    let _self = this;
    return new Promise(function (resolve, reject) {
      waitModelReady(_self).then(function () {
        let obj = {
          title: _self.title.get(),
          color: _self.color.get(),
          owner: _self.owner.get(),
          username: _self.username.get(),
          date: _self.date.get(),
          display: _self.display.get(),
          // files: _self.files.get(),
          // allObject : _self.allObject.get(),
          _server_id: _self._server_id
        };
        let allObject = [], notes = [], files = [], links = [], i = 0;
        
        for (i = 0; i < _self.notes.length; i++) {
          notes.push(_self.notes[i].get_obj());
        }

        for (i = 0; i < _self.files.length; i++) {
          files.push(waitModelReady(_self.files[i]));
        }

        for (i = 0; i < _self.links.length; i++) {
          links.push(waitModelReady(_self.links[i]));
        }

        for (let index = 0; index < _self.allObject.length; index++) {
          const element = _self.allObject[index];
          allObject.push(waitModelReady(element));
        }

        Promise.all(links).then(function (links) {
          obj.links = links;
          Promise.all(allObject).then(function (objects) {
            obj.allObject = objects;

            Promise.all(files).then(function (files) {
              obj.files = files;
              Promise.all(notes).then(function (note) {
                obj.notes = note;
                resolve(obj);
              });
            });
          });
        })
      });
    });
  }
};
exports.NoteModel = NoteModel;



var LinkModel = class LinkModel extends Model {
  constructor() {
    super()
    this.add_attr({
      label : "",
      link : "",
      owner : "",
      username : ""
    })
  }

  get_obj() {
    let _self = this;

    return new Promise((resolve,reject) => {
      waitModelReady(_self).then(() => {
        let obj = {
          label : _self.label.get(),
          link : _self.link.get(),
          owner : _self.owner.get(),
          username : _self.username.get(),
          _server_id: _self._server_id
        }

        resolve(obj);
      })
    })
  }
}


var MessageModel = class MessageModel extends Model {
  constructor() {
    super();
    this.add_attr({
      username: '',
      owner: '',
      message: '',
      date: Date.now()
    });
  }

  get_obj() {
    let _self = this;
    return new Promise((resolve, reject) => {
      waitModelReady(_self).then(() => {
        let obj = {
          username: _self.username.get(),
          owner: _self.owner.get(),
          message: _self.message.get(),
          date: _self.date.get(),
          _server_id: _self._server_id
        };
        resolve(obj);
      });
    });

  }
};

exports.MessageModel = MessageModel;


var FileModel = class FileModel extends Model {
  constructor(file) {
    super();
    this.add_attr({
      username: '',
      owner: '',
      name: '',
      date: '',
      path: new Path()
    });
  }

  get_obj() {
    let _self = this;
    return new Promise((resolve, reject) => {
      waitModelReady(_self).then(() => {
        let obj = {
          username: _self.username.get(),
          owner: _self.owner.get(),
          name: _self.name.get(),
          date: _self.date.get(),
          _server_id: _self._server_id
        };
        resolve(obj);
      });
    });
  }
};
exports.FileModel = FileModel;
