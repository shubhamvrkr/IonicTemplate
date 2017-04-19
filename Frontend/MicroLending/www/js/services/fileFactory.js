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
    
   
   
    
    service.createZip = function (fileName,path,data,callback) {
       
       if (window.cordova){
                  var PathToFileInString  = cordova.file.externalApplicationStorageDirectory+fileName,
                  PathToResultZip     = cordova.file.externalApplicationStorageDirectory;
                  JJzip.zip(PathToFileInString, {target:PathToResultZip,name:"abc"},function(data){

                     console.log("zipeed",data)
                      callback({status:"1",data:data})

             },function(error){

                     console.log("error",error)
                    callback({status:"0",data:error})

             })
       }
       
      else{
       
            var zip = new JSZip();
            zip.file(fileName, data);
            //var img = zip.folder("images");
            //img.file("smile.gif", imgData, {base64: true});
            zip.generateAsync({type:"blob"}).then(function(content) {
            // see FileSaver.js
            saveAs(content, "user.zip");
            callback({status:"1"})
         });

       }
};
  
   service.unZip = function (fileName,path,callback) {
       
       if (window.cordova){
                  var PathToFileInString  = path
                  PathToResultZip     = cordova.file.externalApplicationStorageDirectory+"/";
                  JJzip.unzip(PathToFileInString, {target:PathToResultZip},function(data){
                     console.log(data)
                      callback({status:"1",data:data})
               },function(error){
                     console.log(error)
                      callback({status:"0",data:error})
            })
      }
       
      else{
        
            var new_zip = new JSZip();
         
         JSZipUtils.getBinaryContent(path, function(err, data) {
                if(err) {
                    console.log( err); 
                }

             JSZip.loadAsync(data).then(function(zip) {

               console.log(new_zip.file("user_profile.json").async("string"));
         });

      })
   }
};   
   
   
   
   
    
return service
      

}]);
