mycontrollerModule.controller('loginCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', '$timeout', 'fileFactory', 'loginFactory', "$cordovaZip", 'registerFactory', '$ionicPush', 'ionicToast', '$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $state, $ionicLoading, $timeout, fileFactory, loginFactory, $cordovaZip, registerFactory, $ionicPush, ionicToast, $ionicPopup) {

    $scope.$on('cloud:push:notification', function (event, data) {
      var msg = data.message;
      alert(msg.title + ': ' + msg.text);
    });

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

                  console.log("Uintarray: ", result.pwDerivedKey)
                  // save the pwderived key in SS.
                  console.log("encoded base64: ", bufferToBase64(result.pwDerivedKey));

                  loginFactory.saveSymmetricKeyDataLocally(bufferToBase64(result.pwDerivedKey), "symkey", function (response) {

                    if (response.status == "0") {

                      $scope.error = "Oops something went wrong..Please try again!!!";

                    } else {

                      $state.go('menu.allContracts');

                    }

                  });

                  //$state.go('menu.allContracts');

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
          },
          'user_data');
      } else {



        value = JSON.parse(localStorage.getItem('user_data'));
        login_data.ks = value.ks;
        console.log(value);
        //check for the email validation
        console.log(value.email);
        console.log(login_data.username == value.email);
        if (login_data.username == value.email || login_data.username == value.address) {

          loginFactory.login(login_data, function (err, result) {
            if (err) {

              $scope.error = "Invalid userrname or password!!";
              console.log("Login error", err);

            } else {

              console.log("Login", result);

              console.log("Uintarray: ", result.pwDerivedKey)

              // save the pwderived key in SS.
              console.log("encoded base64: ", bufferToBase64(result.pwDerivedKey));

              loginFactory.saveSymmetricKeyDataLocally(bufferToBase64(result.pwDerivedKey), "symkey", function (response) {

                if (response.status == "0") {

                  $scope.error = "Oops something went wrong..Please try again!!!";

                } else {

                  $state.go('menu.allContracts');

                }

              });

              // $state.go('menu.allContracts');
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
        console.log("Browser");
        console.log();
        var input = document.getElementById("fileLoader");
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
                if (data.status == "0") {
                  console.log("Error reading file after zipping");
                  $ionicLoading.hide();
                  ionicToast.show('Please upload valid zip file', 'bottom', false, 2500);
                } else {
                  console.log(data);
                  //take password and try to decrypt the key-store. call login service module
                  var login_data = {};
                  login_data.username = JSON.parse(data.data).email;
                  login_data.ks = JSON.parse(data.data).ks;
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

                      console.log("android login result: ", result)
                      if (err) {
                        console.error(err);
                      } else {
                        // +save the pwderived key in SS.
                        registerFactory.saveUserDataLocally(data.data, 'user_data', function (res) {


                          console.log(res);
                          $ionicLoading.hide();
                          ionicToast.show('Profile successfully imported', 'bottom', false, 2500);
                          $state.go('menu.allContracts');

                        });
                      }
                    });
                  });
                }
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

          login_data.username = data.data.email;
          login_data.ks = data.data.ks;

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

            //generate same symmetric key and convert to base 64


            // Show loading animation
            $ionicLoading.show({
              templateUrl: 'templates/loading.html',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
            });

            loginFactory.login(login_data, function (err, result) {

              console.log("browser login result: ", result)

              if (err) {
                console.error(err);
              } else {
                // +save the pwderived key in secure storage


                registerFactory.saveUserDataLocally(JSON.stringify(data.data), 'user_data', function (res) {

                  $ionicLoading.hide();
                  console.log("saved in local Storage", res);
                  ionicToast.show('Profile successfully imported', 'bottom', false, 2500);
                  $state.go('menu.allContracts');

                });
              }
            });
          });
        }
      });
    };
  }
]);
