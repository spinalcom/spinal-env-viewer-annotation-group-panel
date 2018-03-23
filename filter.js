

function objExist(item,dbId) {
    if(item.name) {
        for (var i = 0; i < item.listModel.length; i++) {
            var annotation = item.listModel[i];
            for (var j = 0; j < annotation.allObject.length; j++) {
                var obj = annotation.allObject[j]

                if(obj.dbId == dbId) {
                    return true;
                }
            }
        }
        return false;
    } else if(item.title) {
        for (var i = 0; i < item.allObject.length; i++) {
            var obj = item.allObject[i]
  
            if(obj.dbId == dbId) {
                return true;
            }
 
        }
        return false
    }
}

angular.module('app.spinalforge.plugin')
    .filter('searchFilter',function() {
        return function(items,searchValue) {
            var filtered = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if((item.name && item.name.indexOf(searchValue) != -1) || objExist(item,searchValue)) {  
                    filtered.push(item);
                } else if ((item.title && item.title.indexOf(searchValue) != -1) || objExist(item,searchValue)) {
                    filtered.push(item);   
                }
            }

            return filtered;
        }
    })