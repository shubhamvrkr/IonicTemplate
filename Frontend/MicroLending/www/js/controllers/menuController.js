mycontrollerModule.controller('menuCtrl', ['$scope', '$stateParams', '$ionicPopover', '$state', '$ionicLoading', '$timeout', 'ionicToast', 'fileFactory', '$cordovaCamera', '$cordovaFile', 'registerFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $ionicPopover, $state, $ionicLoading, $timeout, ionicToast, fileFactory, $cordovaCamera, $cordovaFile, registerFactory) {

    console.log("menuCtrl");
    $scope.user = {}
    //retrieve the use data from the localStorge

    if (window.cordova) {

      ss.get(
        function (value) {
          console.log('Success, got ' + value);
          var user_data = JSON.parse(value);


          $scope.user.name = user_data.fname + " " + user_data.lname
          $scope.user.eth_address = user_data.address
          $scope.user.email = user_data.email
          $scope.user.imagesrc = user_data.imagePath;
        },
        function (error) { console.log('Error ' + error); },
        'user_data');

    } else {

      console.log(localStorage.getItem("user_data"));
      var user_data = JSON.parse(localStorage.getItem("user_data"));
      $scope.user.name = user_data.fname + " " + user_data.lname
      $scope.user.eth_address = user_data.address
      $scope.user.email = user_data.email
      $scope.user.imagesrc = null;
    }


    // .fromTemplateUrl() method

    $ionicPopover.fromTemplateUrl('options-menu.html', {
      scope: $scope
    }).then(function (popover) {

      $scope.popover = popover;
    });
    document.body.classList.add('platform-android');


    $scope.openPopover = function ($event) {


      $scope.popover.show($event);
    };

    $scope.closePopover = function () {
      $scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.popover.remov - e();
    });

    // Execute action on hidden popover
    $scope.$on('popover.hidden', function () {
      // Execute action
    });

    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
      // Execute action
    });

    $scope.exportProfile = function () {

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
          function (value) {
            console.log('Success, got ' + value);
            user_data_content = value;

            fileFactory.createFile("user_profile.json", "/micro_lending/user_data", function (res) {

              fileFactory.writeToFile("user_profile.json", "/micro_lending/user_data", user_data_content, function (result) {

                fileFactory.createZip("micro_lending/user_data", "micro_lending/user_data", user_data_content, function (status) {

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


              })

            })

          },
          function (error) { console.log('Error ' + error); },
          'user_data');
      }

      else {
        console.log('local storage', localStorage.getItem('user_data'))
        user_data_content = localStorage.getItem('user_data')

        fileFactory.createZip("user_profile.json", "/", user_data_content, function (status) {

          console.log(status)
          if (status.status == "0") {
            $ionicLoading.hide();
            ionicToast.show('Error Exporting. Please try again', 'bottom', true, 2500);
          } else {

            $ionicLoading.hide();
            ionicToast.show('Profile Exported at /Downloads/user_profile.zip', 'bottom', true, 2500);

          }


        })
      }



    }

    $scope.Logout = function () {


      console.log("Logout");
      $scope.closePopover();
      $state.go('login');
    }

    $scope.uploadImage = function () {


      console.log("Upload Image")
      if (window.cordova) {

        var options = {

          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG
        };
        $cordovaCamera.getPicture(options).then(function (imageData) {

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

            fileFactory.copyFile(filepath, name, "/micro_lending/user_data", function (response) {


              $scope.user.imagesrc = cordova.file.externalRootDirectory + "micro_lending/user_data/user_pic.png";
              console.log(response);

              ss.get(
                function (value) {
                  console.log('Success, got ' + value);
                  old_ss = JSON.parse(value);
                  old_ss.imagePath = cordova.file.externalRootDirectory + "micro_lending/user_data/user_pic.png"
                  //again store the user_data in the SS.
                  registerFactory.saveUserDataLocally(JSON.stringify(old_ss), 'user_data', function (res) {

                    console.log("image path set successfully.")

                  });

                },
                function (error) { console.log('Error ' + error); },
                'user_data');
            });
          }





          function fail(error) {
            console.log("fail: " + error.code);
          }

        }, function (err) {

          console.log('camera error: ', err)
        });

      } else {


      }

    };



  }])
