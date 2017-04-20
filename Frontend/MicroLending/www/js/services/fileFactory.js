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
    
	service.copyFile = function (fullpath,fileName,path,callback) {
      
	$cordovaFile.copyFile(fullpath, fileName, cordova.file.externalApplicationStorageDirectory+path, "user_pic.png")
				.then(function (success) {
						// success
						callback({status:"1"})
						
						}, function (error) {
							// error
							callback({status:"0",error:error})
						});
					}
		
	
	
	
    
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
    
   
     service.checkDirectory = function (path,directory,callback) {
       
       $cordovaFile.checkDir(path,directory)
                    .then(function (success) {
                        // success
                         console.log('directory is present',success);
                            callback({status:"1",data:success})
                    }, function (error) {
                        // error
                          console.log(error)
                           callback({status:"0",error:error})
                      });
         };
    
    service.createZip = function (fileName,path,data,callback) {
       
       if (window.cordova){
                  var PathToFileInString  = cordova.file.externalApplicationStorageDirectory+path;
				  console.log("PathToFileInString: ",PathToFileInString)

                  var PathToResultZip =cordova.file.externalApplicationStorageDirectory+"micro_lending/" 
                  JJzip.zip(PathToFileInString, {target:PathToResultZip,name:"user_profile"},function(data){

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
					
				  // check if the folder micro_lending is present or not
                  var PathToFileInString  = path
                  PathToResultZip = cordova.file.externalApplicationStorageDirectory+"micro_lending/";
				  
				  console.log("PathToResultZip: ",PathToResultZip)
				  
                  JJzip.unzip(PathToFileInString, {target:PathToResultZip},function(data){
                     console.log(data)
                     
                      callback({status:1,data:data})
                  })
                     
               ,function(error){
                     console.log(error)
                      callback({status:"0",data:error})
                  }
         }
       
      else{
                 
               var new_zip = new JSZip();
               new_zip.loadAsync(path)
               .then(function(zip) {

                new_zip.file("user_profile.json").async("string").then(function(result){
                  callback({status:"1",data:JSON.parse(result)})
                   
                     // save the result in the local storage 
                     /*registerFactory.saveUserDataLocally(result,'user_data',function(res){
                                             console.log(res)
                                              callback(res)
                              });*/
                    }).catch(function(err){
                           console.log(err)
                           callback({status:"0",data:err})
                }); 
            }).catch(function(err){
                           console.log(err)
                           callback({status:"0",data:err})
               })
      }
};   
   
 
return service
      

}]);
