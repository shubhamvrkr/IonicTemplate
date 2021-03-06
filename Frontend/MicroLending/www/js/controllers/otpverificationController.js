mycontrollerModule.controller('emailVerificationCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', '$timeout', 'registerFactory', '$http', 'firebaseFactory', 'ionicToast', '$rootScope',
  function ($scope, $stateParams, $state, $ionicLoading, $timeout, registerFactory, $http, firebaseFactory, ionicToast, $rootScope) {


    var userData = $stateParams.params.user_data;

    console.log(userData);
    console.log($stateParams);
    console.log($stateParams.params.temp_id);

    $scope.emailid = $stateParams.params.user_data.email;

    $scope.$on("$ionicView.beforeEnter", function () {
      $("#otpnumber").keypress(function (e) {
        console.log("OTP keypress listener")
        var maxChars = 6;
        if (e.which < 0x20) {
          // e.which < 0x20, then it's not a printable character
          // e.which === 0 - Not a character
          return;     // Do nothing
        }
        if (this.value.length == maxChars) {
          e.preventDefault();
        } else if (this.value.length > maxChars) {
          // Maximum exceeded
          this.value = this.value.substring(0, maxChars);
        }
      });
    });


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

        
       if (response.data.status == 409) {

          $ionicLoading.hide();
          $scope.error = "Email ID already exists!"

        } else if (response.data.status == 500) {
          $ionicLoading.hide();
          $scope.error = "Server Error. Please try after some time!"
        } else {

          console.log("resent OTP user: ", response);
          $ionicLoading.hide();
          ionicToast.show('New OTP has been sent to you email id!!', 'bottom', false, 2500);


        }
        $state.go('emailVerification', {
          params: {
            temp_id: response.data._id,
            passphrase: userData.password,
            user_data: userData
          }
        })

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
      registerFactory.verifyOTP(otp_data, function (otp_data) {

        console.log(otp_data);
        console.log("verify OTP");

        //re -register
        if (otp_data.data.status == 404) {
          $ionicLoading.hide();
          $scope.error = "Error: Please try again!"

        } else if (otp_data.data.status == 401) {
          $ionicLoading.hide();
          $scope.error = "Invalid OTP. Please try again!"

        } else if (otp_data.data.status == 400) {
          $ionicLoading.hide();
          $scope.error = "OTP expired! Resend OTP"

        } else if (otp_data.data.status == 429) {
          $ionicLoading.hide();
          $scope.error = "No. of attempts exceeded! Please register again"

        } else if (otp_data.data.status == 500) {
          $ionicLoading.hide();
          $scope.error = "Server Error. Please try after some time."

        }
        //wrong otp
        else {
          response = otp_data.data;
          //if otp is verified then generate eth address and register with FCM
          console.log("Password: ", $stateParams.params.passphrase);

          registerFactory.generateEthAccount($stateParams.params.passphrase, function (err, result) {

            console.log(" generateEthAccount Called");
            if (err) {

              console.log(err)

            }
            //store the KVS in the localstorage;
            console.log("save the kvs", result);

            console.log("Verified: ", result.pwDerivedKey);



            local_data = {};
            local_data.fname = $stateParams.params.user_data.fname;
            local_data.lname = $stateParams.params.user_data.lname;
            local_data.email = $stateParams.params.user_data.email;
            local_data.address = result.address;
            local_data.ks = result.ks;
            local_data.publicKey = result.publickey[0];

            local_data.imagePath = "null";


            // get firebase token
            firebaseFactory.getFirebaseToken(function (result_token) {


              console.log(result_token);
              if (result_token.status == "0" || result_token.token == "") {
                console.log("No token found.");
                $ionicLoading.hide();
                ionicToast.show('New OTP has been sent to you email id!!', 'bottom', false, 2500);
              }
              else {
                //for mobile store it in a file && for browser on localStorage
                //{kvs:'',email:,eth_addr:,seed_word:}
                registerFactory.saveUserDataLocally(JSON.stringify(local_data), 'user_data', function (res) {


                  symKey = bufferToBase64("temp_password")
                  console.log("encoded base64: ", symKey);

                  registerFactory.saveSymmetricKeyDataLocally(symKey, "symkey", function (res1) {

                    if (window.cordova) {

                      ss.get(
                        function (value) {
                          console.log('Success, got ' + value);
                        },
                        function (error) {
                          console.log('Error ' + error);
                        },
                        'user_data');

                    } else {
                      console.log('local storage', localStorage.getItem('user_data'))
                    }

                    var new_data = {};
                    new_data.name = response.name;
                    new_data.ethAccount = result.address;
                    new_data.firebaseToken = result_token.token;
                    new_data.publicKey = result.publickey[0];


                    //send to DB
                    $http.post(apiUrl + "/api/users/" + response._id + "/account", new_data)
                      .success(function (post_response) {

                        console.log(post_response);

                        registerFactory.createAppDirectory(function (response) {

                          console.log("App creation", response);
                          $ionicLoading.hide();
                          currentUser = {};
                          currentUser.address = result.address;
                          currentUser.pwDerivedKey = result.pwDerivedKey;
                          currentUser.keystore = result.ks;
                          currentUser.email = $stateParams.params.user_data.email;
                          currentUser.publicKey = result.publickey[0];


                          var s_hex = buffer.from(result.pwDerivedKey, 'hex');
                          console.log('S_HEX: ', s_hex.toString('hex'));
						  
						  registerFactory.isLogoutClicked("false","islogoutclicked",function(res10){});
						  
                          if (window.cordova) {

                            var key = "pwDerivedKey"
                            ss.set(
                              function (key) { console.log('Set ' + key); $state.go('menu.allContracts'); },
                              function (error) { console.log('Error ' + error); },
                              key, s_hex.toString('hex'));

                          }
                          else {
                            localStorage.setItem('pwDerivedKey', s_hex.toString('hex'));
                            $state.go('menu.allContracts');
                          }
                          // sessionStorage.setItem('ks', JSON.stringify( currentUser.keystore));


                        });

                        ionicToast.show('We are seeding some ethers in your account! Please wait for some time.', 'bottom', false, 8000);

                      }).catch(function (error) {

                        if (error.status == 400) {
                          $ionicLoading.hide();
                          console.log(error);
                          $scope.error = "Bad Data. Please try again!";
                        } else if (error.status == 404) {
                          $ionicLoading.hide();
                          console.log(error);
                          $scope.error = "User Account already exists!";
                        } else if (error.status == 500) {
                          $ionicLoading.hide();
                          console.log(error);
                          $scope.error = "Server Error. Please try after some time!";
                        }


                      });
                  });

                });
                //end of main
              }
            });

          });
        }
      });
    };

  }
]);
