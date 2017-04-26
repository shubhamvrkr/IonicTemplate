mycontrollerModule.controller('createDealCtrl', ['$scope', '$stateParams', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $state) {

    $scope.spinnerFlag = true;
    $scope.textFlag = false;
    $scope.CreateDeal = function (data) {

      $scope.spinnerFlag = false;
      $scope.textFlag = true;
    }

    // On success
    $scope.spinnerFlag = true;
    $scope.textFlag = false;

  }])
