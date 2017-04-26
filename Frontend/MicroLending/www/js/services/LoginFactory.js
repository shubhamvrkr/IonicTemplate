angular.module('app.services')

  .factory('loginFactory', ['$http', 'fileFactory', function ($http, fileFactory) {

    var service = {};

    service.login = function (data, callback) {
      console.log(data.ks);
      console.log(data.username);
      ethdapp.retrieveKeystore(data.username, data.password, data.ks, function (error, result) {

        if (error) {

          console.log("Error in bundle", error)
          callback(error, null)
        }
        else {
          console.log(result);
          callback(null, result)

        }

      })

    }
	
    service.saveSymmetricKeyDataLocally = function (data, key, callback) {

      console.log("type of ", typeof data)
	  
      if (window.cordova) {
        ss.set(

          function (key) { console.log('Set user_data', key); callback({ status: "1" }) },
          function (error) { console.log('Error ' + error); callback({ status: "0" }) },
          key,data
        );

      }
      else {
        console.log('web')
        console.log("data local storage: ", data)
        localStorage.setItem(key, data)
        callback({ status: "1" })
      }


    }



    return service


  }]);
