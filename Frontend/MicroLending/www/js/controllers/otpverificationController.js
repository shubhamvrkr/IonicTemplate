mycontrollerModule.controller('emailVerificationCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', '$timeout', 'registerFactory', '$http', 'firebaseFactory', 'ionicToast',
  function ($scope, $stateParams, $state, $ionicLoading, $timeout, registerFactory, $http, firebaseFactory, ionicToast) {


    var userData = $stateParams.params.user_data;

    console.log(userData)
	console.log($stateParams)
    console.log($stateParams.params.temp_id)

    function bufferToBase64(buf) {

      var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
      }).join('');
      return btoa(binstr);
    }


    $scope.ResendOTP = function (data) {

      console.log("Resend OTP")


      console.log(userData)

      $ionicLoading.show({
        templateUrl: 'templates/loading.html',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      registerFactory.registerUser(userData, function (response) {

        if (response.status == "0") {

          $ionicLoading.hide();
          $scope.error = "Email ID already exits!! "

        } else {

          console.log("resent OTP user: ", response);
          $ionicLoading.hide();
          ionicToast.show('New OTP has been sent to you email id!!', 'bottom', false, 2500);


        }
        $state.go('emailVerification', { params: { temp_id: response._id, passphrase: userData.password, user_data: userData } })

      });
    }



    $scope.Verify = function (data) {


      //take state params from the register controller
      var otp_data = {}
      otp_data.otp = data.otp.toString()
      otp_data.tmp_id = $stateParams.params.temp_id
      console.log($stateParams)

      $ionicLoading.show({
        templateUrl: 'templates/loading.html',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      //call factory function verifyOTP to verify otp
      registerFactory.verifyOTP(otp_data, function (response, status) {

        console.log(response)
        console.log("verify OTP")

        //re -register
        if (status == 404) {
          //retry
          return
        }
        //wrong otp


        //if otp is verified then generate eth address and register with FCM
        console.log("Password: ", $stateParams.params.passphrase);

        registerFactory.generateEthAccount($stateParams.params.passphrase, function (err, result) {

          console.log(" generateEthAccount Called")
          if (err) {

            console.log(err)

          }
          //store the KVS in the localstorage;
          console.log("save the kvs", result)

          console.log("Verified: ", result.pwDerivedKey)

          local_data = {}
          local_data.fname = $stateParams.params.user_data.fname
          local_data.lname = $stateParams.params.user_data.lname
          local_data.email = $stateParams.params.user_data.email
          local_data.address = result.address
          local_data.ks = result.ks
          local_data.seedWord = result.seedPhrase

          local_data.imagePath = "null";


          // get firebase token
          firebaseFactory.getFirebaseToken(function (result_token) {


            //for mobile store it in a file && for browser on localStorage
            //{kvs:'',email:,eth_addr:,seed_word:}
            registerFactory.saveUserDataLocally(JSON.stringify(local_data), 'user_data', function (res) {


              symKey = bufferToBase64("temp_password")
              console.log("encoded base64: ", symKey);

              registerFactory.saveSymmetricKeyDataLocally(symKey, "symkey", function (res1) {

                if (window.cordova) {

                  ss.get(
                    function (value) { console.log('Success, got ' + value); },
                    function (error) { console.log('Error ' + error); },
                    'user_data');

                }
                else {
                  console.log('local storage', localStorage.getItem('user_data'))
                }

                var new_data = {}
                new_data.name = response.name
                new_data.ethAccount = result.address
                new_data.firebaseToken = result_token.token
                new_data.publicKey = result.publickey[0];


                //send to DB
                $http.post(apiUrl + "/api/users/" + response._id, new_data)
                  .success(function (response) {

                    console.log(response)

                    registerFactory.createAppDirectory(function (response) {

                      console.log("App creation", response)
                      $ionicLoading.hide();
                      $state.go('menu.allContracts');

                    })

                  });
              });

            });
            //end of main

          });

        });

      })
    }

  }])
