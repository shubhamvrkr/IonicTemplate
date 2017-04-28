mycontrollerModule.controller('createDealCtrl', ['$scope', '$stateParams', '$state', '$ionicModal', 'createContractFactory', '$rootScope', '$ionicLoading', 'ionicToast', 'databaseFactory', 'getCurrentUserData', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, $state, $ionicModal, createContractFactory, $rootScope, $ionicLoading, ionicToast, databaseFactory,getCurrentUserData) {

    //fetch the localStorage data


    getCurrentUserData.getData(function(data) {


      user_data = data.data;
      console.log(user_data);
      from_eth_address = user_data.from_eth_address;
      from_email = user_data.from_email;
      ks_local = user_data.ks_local;
      pwDerivedKey =  user_data.pwDerivedKey;
      current_user_key = user_data.current_user_key;

      console.log(pwDerivedKey);

    });


    $scope.spinnerFlag = true;
    $scope.textFlag = false;
    console.log("Stateparams: ", $stateParams);
    $scope.data = {};

    if ($stateParams.contact != null) {

      $scope.data.counterparty = $stateParams.contact._id;
	  
    }
    $scope.selectCounterparty = function() {

      $state.go('menu.phonebook', {
        flag: true
      });

    };

    $scope.CreateDeal = function(data) {
      $scope.spinnerFlag = false;
      $scope.textFlag = true;

      console.log(data);

      var deal_id = Math.round((Math.random() * 10000) * 10000);
      contract_data = {};
      contract_data.deal_id = deal_id;
      contract_data.from_ethAddress = from_eth_address;
      contract_data.to_ethAddress = $stateParams.contact.eth_address;
      contract_data.from_email = from_email;
      contract_data.to_email = $stateParams.contact._id;
      contract_data.start_date = '213423443';
      contract_data.end_date = '12321333';
      contract_data.asset_id = data.assetid;
      contract_data.asset_name = data.assetname;
      contract_data.description = data.description;

      var pwDerivedKey1 = pwDerivedKey;
      var ks = ks_local;
      var addr = contract_data.from_ethAddress;
      counterparty_publickKey = $stateParams.contact.publicKey;


      console.log(contract_data);

      // call the createFactory to sign, encrypt, and send the transaction
      createContractFactory.createContract(contract_data, pwDerivedKey1, ks, addr, counterparty_publickKey, current_user_key, function(res) {

        if (res.status == "1") {

          console.log(res.data);
          txHash = res.data;
          //start the loading logic here

          var count1 = 0;
          var id1 = setInterval(function() {

            console.log("res===" + txHash + ethdapp.web3.eth.getTransactionReceipt(txHash));

            if (ethdapp.web3.eth.getTransactionReceipt(txHash)) {
              console.log("ohh yes");

              //insert into database
              $scope.spinnerFlag = true;
              $scope.textFlag = false;

              var doc = {};
              doc._id = contract_data.deal_id.toString();
              doc.asset_name = contract_data.asset_name;
              doc.counter_party_address = contract_data.to_ethAddress;
              doc.counter_party_email = contract_data.to_email;
              doc.creation_date = contract_data.start_date;
              doc.end_date = contract_data.end_date;
              doc.symmteric_key = res.key;
              doc.status = "pending";
              doc.notification_flag = "false";
              doc.tx = [txHash];

              databaseFactory.putData(deal_db, doc, function(res) {

                console.log(res);
                // test data in db
                databaseFactory.getAllData(deal_db, function(response) {

                  console.log(response);
                  clearInterval(id1);
                  $ionicLoading.hide();
                  ionicToast.show('Mined Successfully', 'bottom', false, 2500);
                });

              });

              // $state.go('registerSuccess');
              //  TemplateVar.set(template, 'state', { isMining: false });
              //   TemplateVar.set(template, 'state', { isMined: true });

              // TemplateVar.set(template,'state', {isUserInactive: true});
            } else {
              //console.log("ohh no");
              if (count1 == 40) {
                clearInterval(id1);
                // TemplateVar.set(template, 'state', { isError: true });
              }
              count1++;
            }
          }, 4000);



        } else {

          console.log(res.data);

        }

      });

    };

  }
]);
