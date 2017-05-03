mycontrollerModule.controller('moredetailsCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', '$timeout','$ionicHistory',
  function ($scope, $stateParams, $state, $ionicLoading, $timeout, $ionicHistory) {

    console.log("more details")

    $scope.dealData = $stateParams.contract;
    console.log($stateParams.contract);
    console.log("Deal data: ",$scope.dealData);

   // perform verfication of the signatures of all the tx's in $scope.dealData.tx
   var tx_array = $scope.dealData.tx;
   //get the event details from geth Client using tx_hash

   console.log(ethdapp.web3 )
   
   var data = ethdapp.web3.eth.getTransactionReceipt(tx_array[0].txHash);

   console.log(data)
    $scope.backButtonPress = function () {

      console.log("back button pressed")
      $ionicHistory.goBack();
      console.log($ionicHistory.goBack())
    }
  }]);
