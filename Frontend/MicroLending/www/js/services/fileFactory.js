angular.module('app.services')

  .factory('fileFactory', ['$cordovaFile', function ($cordovaFile) {

    var service = {};

    service.createDirectory = function (dirName, path, callback) {

      $cordovaFile.createDir(cordova.file.externalRootDirectory + path, dirName, true)
        .then(function (success) {
          // success
          console.log('directory created');
          callback({ status: "1" })
        }, function (error) {
          // error
          console.log(error)
          callback({ status: "0", error: error })
        });
    };

    service.createFile = function (fileName, path, callback) {

      $cordovaFile.createFile(cordova.file.externalRootDirectory + path, fileName, true)
        .then(function (success) {
          // success
          console.log('file created');
          callback({ status: "1" })
        }, function (error) {
          // error
          console.log(error)
          callback({ status: "0", error: error })
        });
    };

    service.copyFile = function (fullpath, fileName, path, callback) {

      $cordovaFile.copyFile(fullpath, fileName, cordova.file.externalRootDirectory + path, "user_pic.png")
        .then(function (success) {
          // success
          callback({ status: "1" })

        }, function (error) {
          // error
          callback({ status: "0", error: error })
        });
    }





    service.writeToFile = function (fileName, path, data, callback) {

      $cordovaFile.writeFile(cordova.file.externalRootDirectory + path, fileName, data, true)
        .then(function (success) {
          // success
          console.log('file written');
          callback({ status: "1" })
        }, function (error) {
          // error
          console.log(error)
          callback({ status: "0", error: error })
        });
    };


    service.readFile = function (fileName, path, callback) {

      $cordovaFile.readAsText(cordova.file.externalRootDirectory + path, fileName)
        .then(function (success) {
          // success
          console.log('file read', success);
          callback({ status: "1", data: success })
        }, function (error) {
          // error
          console.log(error)
          callback({ status: "0", error: error })
        });
    };


    service.checkDirectory = function (path, directory, callback) {

      $cordovaFile.checkDir(path, directory)
        .then(function (success) {
          // success
          console.log('directory is present', success);
          callback({ status: "1", data: success })
        }, function (error) {
          // error
          console.log(error)
          callback({ status: "0", error: error })
        });
    };

    service.createZip = function (fileName, path, data, callback) {



      var PathToFileInString = cordova.file.externalRootDirectory + path;
      console.log("PathToFileInString: ", PathToFileInString)

      var PathToResultZip = cordova.file.externalRootDirectory + "micro_lending/"
      JJzip.zip(PathToFileInString, { target: PathToResultZip, name: "user_profile" }, function (data) {

        console.log("zipeed", data)
        callback({ status: "1", data: data })

      }, function (error) {

        console.log("error", error)
        callback({ status: "0", data: error })

      })
    }

    service.createZipBrowser = function (user_data, contacts_data, contracts_data, callback) {

      var zip = new JSZip();
      var userProfileZip = zip.folder("user_data");
      // this call will create photos/README
      userProfileZip.file("contacts.json", contacts_data);
      userProfileZip.file("contracts.json", contracts_data);
      userProfileZip.file("user_profile.json", user_data);

      zip.generateAsync({ type: "blob" }).then(function (content) {
        // see FileSaver.js
        saveAs(content, "user_profile");
        callback({ status: "1" })
      });

    }


    service.unZip = function (fileName, path, callback) {

      if (window.cordova) {
        PathToResultZip = cordova.file.externalRootDirectory + "micro_lending";
        Zeep.unzip({
          from: path,
          to: PathToResultZip
        }, function () {
          console.log('unzip success!');
          callback({ status: "1" })
        }, function (e) {
          console.log('unzip error: ', e);
          callback({ status: "0" })
        });
      }






      // check if the folder micro_lending is present or not
      /*var PathToFileInString  = path
      PathToResultZip = cordova.file.externalRootDirectory;

console.log("PathToResultZip: ",PathToResultZip)

      JJzip.unzip(PathToFileInString,{target:PathToResultZip},function(data){
         console.log(data)
         callback({status:1,data:data})
      }
         ,function(error){
console.log(error)
          callback({status:"0",data:error})
      })*/


      else {
        console.log(path)

        var new_zip = new JSZip();
        new_zip.loadAsync(path)
          .then(function (zip) {
            new_zip.folder("user_data").file("user_profile.json").async("string").then(function (user_data_encrypted) {

              console.log(user_data_encrypted);

              new_zip.folder("user_data").file("contacts.json").async("string").then(function (contacts_encrypted) {

                console.log(contacts_encrypted);

                new_zip.folder("user_data").file("contracts.json").async("string").then(function (contracts_encrypted) {

                  console.log(contracts_encrypted);
                  callback({ status: "1", user_data_encrypted: user_data_encrypted, contacts_encrypted:contacts_encrypted,contracts_encrypted:contracts_encrypted});
                });

              });

            })

          }).catch(function (err) {
            console.log(err)
            callback({ status: "0", data: err })
          })
      }
    };


    return service


  }]);
