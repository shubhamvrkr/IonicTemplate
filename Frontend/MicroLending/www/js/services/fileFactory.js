angular.module('app.services')

.factory('fileFactory',['$cordovaFile',function($cordovaFile) {
 
 var service = {};
    
     service.createDirectory = function (dirName,path,callback) {
       
        $cordovaFile.createDir(cordova.file.externalApplicationStorageDirectory+path, dirName, true)
                    .then(function (success) {
                        // success
                         console.log('directory created');
                            callback({status:"1"})
                    }, function (error) {
                        // error
                          console.log(error)
                           callback({status:"0",error:error})
                      });
                };
  
    service.createFile = function (fileName,path,callback) {
       
       $cordovaFile.createFile(cordova.file.externalApplicationStorageDirectory+path, fileName, true)
                    .then(function (success) {
                        // success
                         console.log('file created');
                            callback({status:"1"})
                    }, function (error) {
                        // error
                          console.log(error)
                           callback({status:"0",error:error})
                      });
                };
    
    
    service.writeToFile = function (fileName,path,data,callback) {
       
       $cordovaFile.writeFile(cordova.file.externalApplicationStorageDirectory+path,fileName, data,true)
                    .then(function (success) {
                        // success
                         console.log('file written');
                            callback({status:"1"})
                    }, function (error) {
                        // error
                          console.log(error)
                           callback({status:"0",error:error})
                      });
                };
    
    
     service.readFile = function (fileName,path,callback) {
       
       $cordovaFile.readAsText(cordova.file.externalApplicationStorageDirectory+path,fileName)
                    .then(function (success) {
                        // success
                         console.log('file read',success);
                            callback({status:"1",data:success})
                    }, function (error) {
                        // error
                          console.log(error)
                           callback({status:"0",error:error})
                      });
                };
    
    
return service
      

}]);
