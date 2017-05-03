mycontrollerModule.controller('moredetailsCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', '$timeout', '$ionicHistory',
  function ($scope, $stateParams, $state, $ionicLoading, $timeout, $ionicHistory) {

    console.log("more details")

    $scope.dealData = $stateParams.contract;
    console.log($stateParams.contract);
    console.log("Deal data: ", $scope.dealData);

    // perform verfication of the signatures of all the tx's in $scope.dealData.tx
    var tx_array = $scope.dealData.tx;
    //get the event details from geth Client using tx_hash

    console.log(ethdapp.web3)

    var data = ethdapp.web3.eth.getTransactionReceipt(tx_array[0].txHash);

    var event_data = data.logs[0].data;
    var log = data.logs[0];

    var event = null;

    for (var i = 0; i < ABI.length; i++) {
      var item = ABI[i];
      if (item.type != "event") continue;
      var signature = item.name + "(" + item.inputs.map(function (input) { return input.type; }).join(",") + ")";
      var hash = ethdapp.web3.sha3(signature);
      console.log(log.topics[0])
      console.log(hash)
      if (hash == log.topics[0]) {
        event = item;
        break;
      }
    }
    

    if (event != null) {
      console.log(event)
      var inputs = event.inputs.map(function (input) { return input.type; });
      var data = SolidityCoder.decodeParams(inputs, log.data.replace("0x", ""));
      console.log(data)
      // Do something with the data. Depends on the log and what you're using the data for.
    }


    //var data1 = solidity.decodeParams(["address", "address", "string", "uint32"], log.data.replace("0x", ""))

    //console.log(JSON.parse(data1[2]))
    //console.log(ethdapp.web3.toAscii(event_data));
    $scope.backButtonPress = function () {

      console.log("back button pressed")
      $ionicHistory.goBack();
      console.log($ionicHistory.goBack());
    }
  }]);
