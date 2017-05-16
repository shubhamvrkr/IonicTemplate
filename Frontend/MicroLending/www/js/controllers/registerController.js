mycontrollerModule.controller('registerCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', '$timeout', 'registerFactory', 'firebaseFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $state, $ionicLoading, $timeout, registerFactory, firebaseFactory) {


    $scope.Register = function (data) {

      console.log(data)

      //Fetch all the data from the view
      $ionicLoading.show({
        templateUrl: 'templates/loading.html',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      var user_data = {}
      user_data.fname = data.firstname;
      user_data.lname = data.lastname;
      user_data.email = data.emailid;
      user_data.password = data.password;
      user_data.confirm_password = data.confirmpassword;

      if (user_data.password != user_data.confirm_password) {

        console.log('password does not match')
        $ionicLoading.hide();
        $scope.error = "Password does not match. Try again!"
        return
      }

      //get all users

      /*$http.get(apiUrl + "getOrganizationList")
                  .success(function (response) {
                      $scope.userList = response.Data.message;
                  });*/


      // check username
      /* $scope.enrollmentIdChange = function () {
             $http.post(apiUrl + "checkUsername", {
                     enrollmentId: $scope.user.email
                 })
                 .success(function (response) {
                     if (response.Status == "success") {
                         $scope.enrollmentIdMsg = "Username available";
                         $scope.emailStyle = {
                             color: 'green'
                         };
                     } else {
                         $scope.enrollmentIdMsg = "Username not available";
                         $scope.emailStyle = {
                             color: 'red'
                         };
                     }
                 });
         }*/


      //make an http.post call to the server to perform the email_verification


      //call Register Factory and send the user_data and get the response as temp id


      registerFactory.registerUser(user_data, function (response) {
        console.log(response);
        if (response.data.status == 409) {

          $ionicLoading.hide();
          $scope.error = "Email ID already exists!"

        } else if (response.data.status == 500) {
          $ionicLoading.hide();
          $scope.error = "Server Error. Please try after some time!"
        }else if (response.data.status == -1) {
          $ionicLoading.hide();
          $scope.error = "Connection Error. Please ensure that you are not behind a proxy!"
        }else {
          $ionicLoading.hide();
          console.log("register user: ", response);
          $state.go('emailVerification', { params: { temp_id: response.data._id, passphrase: user_data.password, user_data: user_data } });
        }

      })



      /*console.log("register data: ",data);
      $ionicLoading.show({
          templateUrl: 'templates/loading.html',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
      });
      $timeout(function () {

        $ionicLoading.hide();
        $state.go('emailVerification');

      }, 2000);*/

    }
  }])
