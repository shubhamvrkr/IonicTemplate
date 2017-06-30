angular.module('app.services')

  .factory('registerFactory', ['$http', 'fileFactory', 'firebaseFactory', function ($http, fileFactory, firebaseFactory) {

    var service = {};

    service.registerUser = function (data, callback) {

      console.log(data);
      var post_data = {};

      post_data.email = data.email;
      post_data.name = data.fname +" "+ data.lname;


      console.log("Register user ", post_data);

      $http.post(apiUrl + "/api/users", post_data)
        .success(function (response) {

          console.log(response);
          callback({ data: response })

        }).catch(function (err) {

          console.log(err)
          callback({ data: err })


        });

    };



    service.verifyOTP = function (data, callback) {
      console.log("Inside verify OTP ");

      console.log(data);
      $http.post(apiUrl + "/api/users/verify/" + data.tmp_id, data)
        .success(function (response, status) {
          console.log(response)
           callback({data:response});

        }).catch(function (err, status) {
          console.log(err, status);
          callback({data:err});
        });
    }


    service.saveUserDataLocally = function (data, key, callback) {

      console.log("type of ", typeof data)
      if (window.cordova) {
        ss.set(

          function (key) { console.log('Set user_data', key); callback({ status: "1" }) },
          function (error) { console.log('Error ' + error); callback({ status: "0" }) },
          'user_data', data
        );

      }

      else {
        console.log('web')
        console.log("data local storage: ", data)
        localStorage.setItem(key, data)
        callback({ status: "1" })
      }


    }
	
	service.isLogoutClicked= function (data, key, callback) {

      console.log("type of ", typeof data)
      if (window.cordova) {
        ss.set(

          function (key) { console.log('Set user_data', key); callback({ status: "1" }) },
          function (error) { console.log('Error ' + error); callback({ status: "0" }) },
          key, data
        );

      }else {
        console.log('web')
        console.log("data local storage: ", data)
        localStorage.setItem(key, data)
        callback({ status: "1" })
      }

    }
	

    service.generateEthAccount = function (password, callback) {

      //get the passphrase
      ethdapp.generateKeystore(password, null, function (error, result) {

        if (error) {

          console.log(error)
          callback(error, null)
        }
        console.log(result);
        callback(null, result)

      })

    }


    service.createAppDirectory = function (callback) {

      if (window.cordova) {
        //create micro-lending folder inside the package
        fileFactory.createDirectory("micro_lending", "/", function (res) {
          //create contacts folder
          fileFactory.createDirectory("contacts", "/micro_lending", function (res) {
            //create deals folder
            fileFactory.createDirectory("deals", "/micro_lending", function (res) {
              //create deals folder
              console.log(res)
              //create user_data folder
              fileFactory.createDirectory("user_data", "/micro_lending", function (res) {
                console.log(res)
                callback(res)
              })
            })

          })

        })
      } else {

        callback({ status: "1" })

      }
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
