mycontrollerModule.controller('moredetailsCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', '$timeout', '$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $state, $ionicLoading, $timeout, $ionicHistory) {

    console.log("more details")

    $scope.dealData = $stateParams.contract;
    console.log($stateParams.contract);
    console.log($scope.dealData);
    $scope.backButtonPress = function () {

      console.log("back button pressed")
      $ionicHistory.goBack();
      console.log($ionicHistory.goBack())
    }

  }]);
