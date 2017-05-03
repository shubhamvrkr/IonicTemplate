mycontrollerModule.controller('moredetailsCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', '$timeout', '$ionicHistory', 'databaseFactory', 'getCurrentUserData',
  function ($scope, $stateParams, $state, $ionicLoading, $timeout, $ionicHistory, databaseFactory, getCurrentUserData) {

    console.log("more details");
    //load current user details

    if ($stateParams.contract == null) {
      console.log("NUL")
      $timeout(function () {
        $state.go('menu.allContracts');
      }, 0);
    }

else{
      getCurrentUserData.getData(function (currentUser) {
        console.log("1111111111111")
        $scope.currentUserEmail = currentUser.data.from_email;
        $scope.currentUserAddress = currentUser.data.from_eth_address;
 });


   $scope.dealData = $stateParams.contract;
        console.log($stateParams.contract);
        console.log("Deal data: ", $scope.dealData);

        // perform verfication of the signatures of all the tx's in $scope.dealData.tx
        var tx_array = $scope.dealData.tx;
        //get the event details from geth Client using tx_hash

        console.log(tx_array)
        for (var k = 0; k < tx_array.length; k++) {

          if (tx_array[k].caller== $scope.currentUserEmail){
            console.log("No counter party transactions found!");
          }

          else{
            console.log("it is there")
          var data = ethdapp.web3.eth.getTransactionReceipt(tx_array[k].txHash);

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
            if ("0x" + hash == log.topics[0]) {
              event = item;
              break;
            }
          }


          if (event != null) {
            var sig_data=null;
            console.log(event)

            var inputs = event.inputs.map(function (input) { return input.type; });

            var data = solidity.decodeParams(inputs, log.data.replace("0x", ""));
            console.log(data);
           // console.log(JSON.parse(data[2]));
              if(event.name =="createContractEvent"){
             sig_data = JSON.parse(data[2]);
              }
              else{
                   sig_data = JSON.parse(data[0]);
              }
            var temp_contract_data = {};

            temp_contract_data.deal_id = $scope.dealData._id.toString();
            temp_contract_data.from_ethAddress = $scope.dealData.from_address;
            temp_contract_data.to_ethAddress = $scope.dealData.counter_party_address;
            temp_contract_data.from_email = $scope.dealData.from_email;
            temp_contract_data.to_email = $scope.dealData.counter_party_email;
            temp_contract_data.start_date = $scope.dealData.start_date;
            temp_contract_data.end_date = $scope.dealData.end_date;
            temp_contract_data.asset_id = $scope.dealData.asset_id;
            temp_contract_data.asset_name = $scope.dealData.asset_name;
            temp_contract_data.description = $scope.dealData.description;
            temp_contract_data.nonce = sig_data.nonce;

            console.log(temp_contract_data)

            var s_hex = buffer.from(sig_data.sig_s.toString('hex'), 'hex');
            console.log(s_hex)
            var r_hex = buffer.from(sig_data.sig_r.toString('hex'), 'hex');
            console.log(r_hex)
            var v_hex = parseInt(sig_data.sig_v);
            console.log(v_hex)

            //get the from ethereum address
            //if ($scope.currentUserAddress==tx_array[0].caller)



            databaseFactory.getDocById(contact_db, tx_array[k].caller, function (response) {

              if (response.status == "0") {

                console.log("contact with email not found : ");

              } else {

                console.log(response)
                EthWallet.encryption_sign.verifyMsg(response.eth_address, JSON.stringify(temp_contract_data), v_hex, r_hex, s_hex, function (err, verifiedResult) {

                  if (err) {

                    console.log("Error in verifying signature: ", err);

                  } else {

                    console.log("Verification Status: ", verifiedResult);

                  };

                });
              }
            });

          }
        }
        }
     }
     //console.log(ethdapp.web3.toAscii(event_data));

    $scope.backButtonPress = function () {

      console.log("back button pressed")
      $ionicHistory.goBack();
      console.log($ionicHistory.goBack());
    }
  }]);
