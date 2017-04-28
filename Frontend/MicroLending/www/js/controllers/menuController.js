mycontrollerModule.controller('menuCtrl', ['$scope', '$stateParams', '$ionicPopover', '$state', '$ionicLoading', '$timeout', 'ionicToast', 'fileFactory', '$cordovaCamera', '$cordovaFile', 'registerFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, $ionicPopover, $state, $ionicLoading, $timeout, ionicToast, fileFactory, $cordovaCamera, $cordovaFile, registerFactory) {

    console.log("menuCtrl");
    var symmetricKey = null;
    $scope.user = {}
      //retrieve the use data from the localStorge

    if (window.cordova) {

      ss.get(
        function(value) {
          console.log('Success, got ' + value);
          var user_data = JSON.parse(value);


          $scope.user.name = user_data.fname + " " + user_data.lname
          $scope.user.eth_address = user_data.address
          $scope.user.email = user_data.email
          $scope.user.imagesrc = user_data.imagePath;


        },
        function(error) {
          console.log('Error ' + error);
        },
        'user_data');

      ss.get(
        function(value) {

          symmetricKey = value;
          console.log('symmetricKey ' + symmetricKey);

        },
        function(error) {
          console.log('Error ' + error);
        },
        'symkey');


    } else {

      console.log(localStorage.getItem("user_data"));
      var user_data = JSON.parse(localStorage.getItem("user_data"));
      $scope.user.name = user_data.fname + " " + user_data.lname
      $scope.user.eth_address = user_data.address
      $scope.user.email = user_data.email
      $scope.user.imagesrc = "null";

      symmetricKey = localStorage.getItem("symkey");
      console.log('symmetricKey :', symmetricKey);


    }


    // .fromTemplateUrl() method

    $ionicPopover.fromTemplateUrl('options-menu.html', {
      scope: $scope
    }).then(function(popover) {

      $scope.popover = popover;
    });
    document.body.classList.add('platform-android');


    $scope.openPopover = function($event) {


      $scope.popover.show($event);
    };

    $scope.closePopover = function() {
      $scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover.remov - e();
    });

    // Execute action on hidden popover
    $scope.$on('popover.hidden', function() {
      // Execute action
    });

    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
      // Execute action
    });

    $scope.exportProfile = function() {

      console.log(symmetricKey)
      console.log("exportProfile");

      $scope.closePopover();

      $ionicLoading.show({
        templateUrl: 'templates/loading.html',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });


      // create a JSON file with the user_profile content and zip it
      if (window.cordova) {
        ss.get(
          function(value) {

            console.log('Success, got ' + value);
            user_data_content = value;

            fileFactory.createFile("user_profile.json", "/micro_lending/user_data", function(res) {


              //encrypt user_data_content
              // var symKey = EthWallet.encryption_sign.getSymmetricKey256();
              //  console.log("symKey: ",symKey);

              EthWallet.encryption_sign.symEncrypt(user_data_content, symmetricKey, function(err, result) {


                console.log("Encrypted data: ", result)

                fileFactory.writeToFile("user_profile.json", "/micro_lending/user_data", result, function(result) {

                  fileFactory.createZip("micro_lending/user_data", "micro_lending/user_data", result, function(status) {

                    //TODO: delete the .json file as it is not needed anymore
                    console.log(status)
                    if (status.status == "0") {
                      $ionicLoading.hide();
                      ionicToast.show('Error Exporting. Please try again', 'bottom', true, 2500);
                    } else {

                      $ionicLoading.hide();
                      ionicToast.show('Profile Exported at ' + cordova.file.externalRootDirectory + 'micro_lending/user_profile.zip', 'bottom', true, 2500);

                    }

                  })


                });

              });

            })

          },
          function(error) {
            console.log('Error ' + error);
          },
          'user_data');
      } else {

        console.log('local storage', localStorage.getItem('user_data'))
        user_data_content = localStorage.getItem('user_data')

        //var symKey = EthWallet.encryption_sign.getSymmetricKey256();
        //console.log("symKey: ",symKey);

        EthWallet.encryption_sign.symEncrypt(user_data_content, symmetricKey, function(err, result) {

          console.log(err)
          console.log(result)
          fileFactory.createZip("user_profile.json", "/", result, function(status) {

            console.log(status)
            if (status.status == "0") {
              $ionicLoading.hide();
              ionicToast.show('Error Exporting. Please try again', 'bottom', true, 2500);
            } else {

              $ionicLoading.hide();
              ionicToast.show('Profile Exported at /Downloads/user_profile.zip', 'bottom', true, 2500);

            }


          })

        });

      }



    }

    $scope.Logout = function() {


      console.log("Logout");
      $scope.closePopover();
      $state.go('login');
    }

    $scope.uploadImage = function() {


      console.log("Upload Image")
      if (window.cordova) {

        var options = {

          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {

          console.log('ImageData: ', imageData)
          onImageSuccess(imageData);

          function onImageSuccess(fileURI) {

            console.log('fileURI: ', fileURI)
            createFileEntry(fileURI);
          }

          function createFileEntry(fileURI) {

            window.FilePath.resolveNativePath(fileURI, copyFile);

          }

          function copyFile(filepath) {

            console.log('filepath: ', filepath)
            var name = filepath.substr(filepath.lastIndexOf('/') + 1);
            console.log('name: ', name)
            var filepath = filepath.substr(0, filepath.lastIndexOf('/'));
            console.log('path: ', filepath);

            fileFactory.copyFile(filepath, name, "/micro_lending/user_data", function(response) {


              $scope.user.imagesrc = cordova.file.externalRootDirectory + "micro_lending/user_data/user_pic.png";
              console.log(response);

              ss.get(
                function(value) {
                  console.log('Success, got ' + value);
                  old_ss = JSON.parse(value);
                  old_ss.imagePath = cordova.file.externalRootDirectory + "micro_lending/user_data/user_pic.png"
                    //again store the user_data in the SS.
                  registerFactory.saveUserDataLocally(JSON.stringify(old_ss), 'user_data', function(res) {

                    console.log("image path set successfully.")

                  });

                },
                function(error) {
                  console.log('Error ' + error);
                },
                'user_data');
            });
          }



          function fail(error) {
            console.log("fail: " + error.code);
          }

        }, function(err) {

          console.log('camera error: ', err)
        });

      } else {


      }

    };

    $scope.loadDataforAllContacts = function() {

      console.log("loadDataforAllContacts")
      $state.go('menu.allContracts')


    }
    $scope.loadDataforPhonebook = function() {

      console.log("loadDataforPhonebook")
      $state.go('menu.phonebook', {
        flag: false
      })

    }
    $scope.loadDataforCreateDeal = function() {

      console.log("loadDataforCreateDeal")
      $state.go('menu.createdeal', {
        contact: null
      })

    }

  }
])
