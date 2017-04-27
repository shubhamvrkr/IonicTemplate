mycontrollerModule.controller('createDealCtrl', ['$scope', '$stateParams', '$state', '$ionicModal', 'createContractFactory', '$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, $state, $ionicModal, createContractFactory, $rootScope) {

    //fetch the localStorage data
    if (window.cordova) {

      ss.get(
        function(value) {

          console.log('Success, got ' + value);
          var user_data = JSON.parse(value);

          from_eth_address = user_data.address;
          from_email = user_data.email;
          ks_local = user_data.ks;
          pwDerivedKey = user_data.pwDerivedKey


        },
        function(error) {
          console.log('Error fetching local data ' + error);
        },
        'user_data');
    }

    else {

      console.log(localStorage.getItem("user_data"));
      var user_data = JSON.parse(localStorage.getItem("user_data"));
      from_eth_address = user_data.address;
      from_email = user_data.email;
      ks_local = user_data.ks;
      pwDerivedKey = user_data.pwDerivedKey

    }


    $scope.spinnerFlag = true;
    $scope.textFlag = false;
    console.log("Stateparams: ", $stateParams);
    $scope.data = {};

    if ($stateParams.contact != null) {

       $scope.data.counterparty = $stateParams.contact.email;
    }
    $scope.selectCounterparty = function() {

      $state.go('menu.phonebook', {
        flag: true
      });

    };

    $scope.createDeal = function(data) {


      console.log(data);

      var deal_id = Math.round((Math.random() * 10000) * 10000);
      contract_data = {};
      contract_data.deal_id = deal_id;
      contract_data.from_ethAddress = from_eth_address;
      contract_data.to_ethAddress = $stateParams.contact.eth_address;
      contract_data.from_email = from_email;
      contract_data.to_email = $stateParams.contact.email;
      contract_data.start_date = data.startdate;
      contract_data.end_date = data.enddate;
      contract_data.asset_id = data.assetid;
      contract_data.asset_name = data.assetname;
      contract_data.description = data.description;

      var pwDerivedKey = pwDerivedKey;
      var ks = ks_local;
      var addr = contract_data.from_ethAddress;
      counterparty_publickKey = $stateParams.contact.publicKey;


      console.log(contract_data);

      // call the createFactory to sign, encrypt, and send the transaction
      /*createContractFactory.createContract(contract_data, pwDerivedKey, ks, addr , counterparty_publickKey ,function(res) {

        console.log(res);

      });*/

    };

  }]);
