mycontrollerModule.controller('loginCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', '$timeout', 'fileFactory', 'loginFactory', "$cordovaZip", 'registerFactory', 'ionicToast', '$ionicPopup', '$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $state, $ionicLoading, $timeout, fileFactory, loginFactory, $cordovaZip, registerFactory, ionicToast, $ionicPopup, $rootScope) {


    function bufferToBase64(buf) {

      var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
      }).join('');
      return btoa(binstr);
    }

    $scope.Login = function (data) {

      console.log("Login");
      var user_name = data.username;
      var password = data.password;
      var login_data = {};

      login_data.username = data.username;
      login_data.password = data.password;

      console.log(login_data);

      $ionicLoading.show({
        templateUrl: 'templates/loading.html',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      if (window.cordova) {
        ss.get(
          function (value) {
            console.log('Success, got ' + value);
            login_data.ks = JSON.parse(value).ks;
            console.log(login_data.ks);
            emailId = JSON.parse(value).email;
            address = JSON.parse(value).address;
            //check for the email validation

            if (login_data.username == JSON.parse(value).email || login_data.username == JSON.parse(value).address) {

              loginFactory.login(login_data, function (err, result) {
                if (err) {
                  $ionicLoading.hide();
                  $scope.error = err;
                  console.error(err);
                  //console.log($scope.error)
                  return;
                } else {


                  $ionicLoading.hide();
                  console.log("Login", result);


                  var s_hex = buffer.from(result.pwDerivedKey, 'hex');
                  console.log('S_HEX: ', s_hex.toString('hex'));
                  var key = "pwDerivedKey"
                  ss.set(
                    function (key) { console.log('Set ' + key); 
                  
                
              
           
          
              



                  //sessionStorage.setItem('pwDerivedKey', s_hex.toString('hex'));
                  // sessionStorage.setItem('ks', JSON.stringify( currentUser.keystore));

                  //sessionStorage.setItem('pwDerivedKey', JSON.stringify( currentUser.pwDerivedKey));

                  console.log("Uintarray: ", result.pwDerivedKey);
                  // save the pwderived key in SS.
                  console.log("encoded base64: ", bufferToBase64("temp_password"));

                  registerFactory.saveSymmetricKeyDataLocally(bufferToBase64("temp_password"), "symkey", function (response) {

                    if (response.status == "0") {

                      $scope.error = "Oops something went wrong..Please try again!!!";

                    } else {

                      $state.go('menu.allContracts');

                    }

                  });

                  //$state.go('menu.allContracts');
                   },
                    function (error) { console.log('Error ' + error); },
                    key, s_hex.toString('hex'));

                }



              });


            } else {
              $ionicLoading.hide();
              $scope.error = "Incorrect username or password";
              console.log("incorrect email or address");
              return;
            }
          },
          function (error) {
            console.log('Error ' + error);
            $scope.error = "No local account details found. Please create a new account";
          },
          'user_data');
      }
      
      
      
      
      
       else {


        if (localStorage.getItem('user_data') === null) {

          $scope.error = "No local account details found. Please create a new account";

        }

        value = JSON.parse(localStorage.getItem('user_data'));
        login_data.ks = value.ks;
        console.log(value);
        //check for the email validation
        console.log(value.email);
        console.log(login_data.username == value.email);
        emailId = value.email;
        address = value.address;
        if (login_data.username == value.email || login_data.username == value.address) {

          loginFactory.login(login_data, function (err, result) {
            if (err) {

              $scope.error = "Invalid userrname or password!!";
              console.log("Login error", err);

            } else {

              console.log("Login", result);


              var s_hex = buffer.from(result.pwDerivedKey, 'hex');
              console.log('S_HEX: ', s_hex.toString('hex'));
              localStorage.setItem('pwDerivedKey', s_hex.toString('hex'));
              //sessionStorage.setItem('ks', JSON.stringify( currentUser.keystore));



              console.log("Uintarray: ", result.pwDerivedKey);
              console.log("encoded base64: ", bufferToBase64("temp_password"));

              registerFactory.saveSymmetricKeyDataLocally(bufferToBase64("temp_password"), "symkey", function (response) {

                if (response.status == "0") {

                  $scope.error = "Oops something went wrong..Please try again!!!";

                } else {

                  $state.go('menu.allContracts');

                }

              });

            }
            $ionicLoading.hide();
          });

        } else {
          $ionicLoading.hide();
          $scope.error = "Incorrect username or password";
          console.log("incorrect email or address");
          return;
        }
      }

    };

    $scope.onchangeinput = function () {

      $scope.error = "";
    };


    $scope.Import = function () {

      if (window.cordova) {

        console.log("Device");
        fileChooser.open(success, error);

      } else {

        var input = document.getElementById("fileLoader");
        input.value = "";
        console.log(input.value)
        input.click();

      }
    };

    var success = function (data) {


      console.log("new Data: ", data);
      var permissions = cordova.plugins.permissions;
      console.log(permissions);
      permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);

      function checkPermissionCallback(status) {
        console.log("status: ", status);

        if (!status.hasPermission) {
          permissions.requestPermission(
            permissions.READ_EXTERNAL_STORAGE,
            function (status) {
              if (!status.hasPermission) {
                errorCallback();
              } else {
                // continue with downloading/ Accessing operation
                resolveNativePath();
              }
            }, errorCallback);
        } else {
          resolveNativePath();
        }
      }

      function resolveNativePath() {

        window.FilePath.resolveNativePath(data, function (filepath) {
          console.log("File path: ", filepath);
          //create a directory micro_lending
          fileFactory.createDirectory("micro_lending", "/", function (res) {
            console.log("App creation", res);
            //handle unzipping here for android
            fileFactory.unZip("", filepath, function (data) {
              console.log("unzip status", data);
              if (data.status == "0") {
                $ionicLoading.hide();
                ionicToast.show('Please upload valid zip file', 'bottom', false, 2500);
              }

              fileFactory.readFile("user_profile.json", "micro_lending/user_data/", function (data) {


                var symKey = bufferToBase64("temp_password");

                console.log("symKey: ", symKey);
                console.log("data import: ", data.data)

                EthWallet.encryption_sign.symDecrypt(data.data, symKey, function (err, dec_result) {

                  console.log(err)

                  if (err != null) {

                    console.log("Error reading file after zipping");
                    $ionicLoading.hide();
                    ionicToast.show('Please upload valid zip file', 'bottom', false, 2500);
                    return;

                  } else {

                    console.log("Decrypted data: ", dec_result);

                    //take password and try to decrypt the key-store. call login service module

                    var login_data = {};

                    login_data.username = JSON.parse(dec_result).email;
                    login_data.ks = JSON.parse(dec_result).ks;

                    $ionicLoading.hide();
                    $ionicPopup.prompt({
                      title: 'Password',
                      subTitle: 'Enter your password to decrypt file',
                      inputType: 'password',
                      inputPlaceholder: 'Your password'
                    }).then((pass) => {

                      if (!pass) {
                        console.error("Password not entered");
                        ionicToast.show('You need to enter password!', 'bottom', false, 2500);
                        return;
                      }

                      login_data.password = pass;

                      // Show loading animation
                      $ionicLoading.show({
                        templateUrl: 'templates/loading.html',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                      });

                      loginFactory.login(login_data, function (err, result) {

                        console.log("android login result: ", result);

                       
                        //sessionStorage.setItem('pwDerivedKey', s_hex.toString('hex'));
                        //sessionStorage.setItem('ks', JSON.stringify( currentUser.keystore));



                        if (err) {
                          console.error(err);
                        } else {
                          // +save the pwderived key in SS.

                             var s_hex = buffer.from(result.pwDerivedKey, 'hex');
                        console.log('S_HEX: ', s_hex.toString('hex'));

                        var key = "pwDerivedKey"
                        ss.set(
                          function (key) { console.log('Set ' + key); 
                      
                  
               

                          registerFactory.saveUserDataLocally(dec_result, 'user_data', function (res) {

                            registerFactory.saveSymmetricKeyDataLocally(symKey, "symkey", function (response) {

                              if (response.status == "0") {

                                $scope.error = "Oops something went wrong..Please try again!!!";
                                $ionicLoading.hide();

                              } else {

                                $ionicLoading.hide();
                                console.log("saved in local Storage", res);
                                ionicToast.show('Profile successfully imported', 'bottom', false, 2500);
                                $state.go('menu.allContracts');

                              }
                            });

                          });

                      },
                          function (error) { console.log('Error ' + error); },
                          key, s_hex.toString('hex'));
                          
                        }
                      });

                    });

                  }
                });
              });
            });
          });
        }, function (code, message) {
          console.log(code);
          console.log(message);
        });
      }

    };

    var error = function (msg) {
      console.error("error: ", msg);

    };

    var errorCallback = function () {
      //user didnt grant permission
      //tell him export couldnot be done
      console.warn('Storage permission is not turned on');
    };

    $scope.fileNameChanged = function (element) {

      console.log(element.value)
      //browser
      $ionicLoading.show({
        templateUrl: 'templates/loading.html',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      fileFactory.unZip("", element.files[0], function (data) {
        //take password and then call login service to check if the password is correct or wrong. IF password is incorrect - display incorrect key-store

        var login_data = {};

        if (data.status == "0") {

          $ionicLoading.hide();
          ionicToast.show('Please upload valid zip file', 'bottom', false, 2500);

        } else {


          console.log("data import: ", data.data);

          $ionicLoading.hide();
          $ionicPopup.prompt({
            title: 'Password',
            subTitle: 'Enter your password to decrypt file',
            inputType: 'password',
            inputPlaceholder: 'Your password'
          }).then((pass) => {

            if (!pass) {
              console.error("Password not entered");
              ionicToast.show('You need to enter password!', 'bottom', false, 2500);
              return;
            }

            login_data.password = pass;

            console.log("Password: ", pass)
            // Show loading animation

            $ionicLoading.show({
              templateUrl: 'templates/loading.html',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
            });

            //generate same symmetric key and convert to base 64
            EthWallet.encryption_sign.deriveKeyFromPassword(pass, function (err, pwDerivedKey) {

              console.log(err);
              //decrypt the data
              console.log(pwDerivedKey);
              var symKey = bufferToBase64("temp_password");

              console.log("symKey: ", symKey);

              EthWallet.encryption_sign.symDecrypt(data.data, symKey, function (err, result) {


                if (err != null) {

                  console.log("Error ind ecrypting data: ", err);
                  $ionicLoading.hide();
                  ionicToast.show('File contents is not valid', 'bottom', false, 2500);

                } else {

                  console.log("Decrypted data: ", result);
                  data.data = JSON.parse(result);
                  login_data.username = data.data.email;
                  login_data.ks = data.data.ks;

                  loginFactory.login(login_data, function (err, login_result) {

                    console.log(err);
                    console.log("browser login result: ", login_result);


                    var s_hex = buffer.from(login_result.pwDerivedKey, 'hex');
                    console.log('S_HEX: ', s_hex.toString('hex'));
                    localStorage.setItem('pwDerivedKey', s_hex.toString('hex'));
                    // sessionStorage.setItem('ks', JSON.stringify( currentUser.keystore));


                    if (err) {

                      console.error(err);
                      $ionicLoading.hide();
                      ionicToast.show('Incorrect password!!', 'bottom', false, 2500);

                    } else {

                      registerFactory.saveUserDataLocally(JSON.stringify(data.data), 'user_data', function (res) {


                        registerFactory.saveSymmetricKeyDataLocally(symKey, "symkey", function (response) {

                          if (response.status == "0") {

                            $scope.error = "Oops something went wrong..Please try again!!!";
                            $ionicLoading.hide();

                          } else {

                            $ionicLoading.hide();
                            console.log("saved in local Storage", res);
                            ionicToast.show('Profile successfully imported', 'bottom', false, 2500);
                            $state.go('menu.allContracts');

                          }

                        });


                      });
                    }
                  });

                }
              });
            });
          });
        }
      });
    };

  }
]);
