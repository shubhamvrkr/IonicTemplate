mycontrollerModule.controller('allContractsCtrl', ['$scope', '$stateParams', '$state', 'allContractFactory', '$rootScope', 'getCurrentUserData', 'databaseFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName

  function ($scope, $stateParams, $state, allContractFactory, $rootScope, getCurrentUserData, databaseFactory) {

    getCurrentUserData.getData(function (response) {

      if (response.data != null) {
        $scope.user_email = response.data.from_email;
        $scope.user_address = response.data.from_eth_address;
        $scope.ks_local = response.data.ks_local;
        $scope.pwDerivedKey = response.data.pwDerivedKey;
      } else {

        $state.go('login');

      }
    })

    $scope.dealInProgress = false;
    $scope.pendingcontracts = [];
    $scope.activecontracts = [];
    $scope.completedcontracts = [];
    console.log("rootScope: ", $rootScope.globals);
    loadDealsfromDB();

    $scope.moreDetails = function (contract) {


      console.log("Moredetails: ", contract);
      $state.go('moredetails', { contract: contract })


    }
    $scope.settleContract = function (contract) {

	  contract.actionstatus = true;
      console.log("settleContract: ", contract);
	  
      allContractFactory.sendResponseForNotification(contract, "initiateSettleContract", $scope.user_address, $scope.ks_local, $scope.pwDerivedKey, function (response) {

	
        if (response.status == "1") {

		
		  
          console.log(response.data);
          txHash = response.data;
          var count1 = 0;
          var id1 = setInterval(function () {

            console.log("res===" + txHash + ethdapp.web3.eth.getTransactionReceipt(txHash));

            if (ethdapp.web3.eth.getTransactionReceipt(txHash)) {
              console.log("ohh yes");

              //insert into database
              $scope.spinnerFlag = true;
              $scope.textFlag = false;

              //update status, notification_flag, tx_hash array
              var tx_object = {};
              var tx_array = [];
              tx_object.caller =  $scope.user_email;
              tx_object.txHash = txHash;
              tx_array = contract.tx;
              tx_array.push(tx_object)
              var doc = contract;
			  doc.actionstatus = false;

              doc.status = "pending";
              doc.notification_flag = "false";
              doc.tx = tx_array;
              //update call.. 3 items
              databaseFactory.updateDoc(deal_db, doc, function (res) {

                console.log(res);
                // test data in db
                databaseFactory.getAllData(deal_db, function (response) {

                  console.log(response);
                  clearInterval(id1);

                 contract.actionstatus = false;
                  //$ionicLoading.hide();
                  $rootScope.balance = ethdapp.web3.fromWei(ethdapp.web3.eth.getBalance($scope.user_address), 'ether').toString();
                  //ionicToast.show('Mined Successfully', 'bottom', false, 2500);
					$scope.$apply();
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
          $ionicLoading.hide();
          ionicToast.show(res.data, 'bottom', false, 2500);


        }



      });

    }
    $scope.acceptContract = function (contract) {

      console.log("acceptSettlement: ", contract);

         contract.actionstatus = true;
      //1. prepare the data for sigining with nonce. from and to are the sender
      //payload should include s,r,v,nonce.
      allContractFactory.sendResponseForNotification(contract, "acceptContract", $scope.user_address, $scope.ks_local, $scope.pwDerivedKey, function (response) {

		
        if (response.status == "1") {

		
          console.log(response.data);
          txHash = response.data;
          var count1 = 0;
          var id1 = setInterval(function () {

            console.log("res===" + txHash + ethdapp.web3.eth.getTransactionReceipt(txHash));

            if (ethdapp.web3.eth.getTransactionReceipt(txHash)) {
              console.log("ohh yes");

              //insert into database
              $scope.spinnerFlag = true;
              $scope.textFlag = false;

              //update status, notification_flag, tx_hash array
              var tx_object = {};
              var tx_array = [];
              tx_object.caller =  $scope.user_email;
              tx_object.txHash = txHash;
              tx_array = contract.tx;
              tx_array.push(tx_object)
              var doc = contract;
			  doc.actionstatus = false;
			  
              doc.status = "active";
              doc.notification_flag = "false";
              doc.tx = tx_array;
              //update call.. 3 items
              databaseFactory.updateDoc(deal_db, doc, function (res) {

                console.log(res);
                // test data in db
                databaseFactory.getAllData(deal_db, function (response) {

                  console.log(response);
                  clearInterval(id1);

                  contract.actionstatus = false;
				
                  //$ionicLoading.hide();
                  $rootScope.balance = ethdapp.web3.fromWei(ethdapp.web3.eth.getBalance($scope.user_address), 'ether').toString();
                  //ionicToast.show('Mined Successfully', 'bottom', false, 2500);
				    $scope.$apply();

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
          $ionicLoading.hide();
          ionicToast.show(res.data, 'bottom', false, 2500);


        }



      });


    }


    $scope.rejectContract = function (contract) {

      console.log("rejectContract: ", contract);
       contract.actionstatus = true;
      //1. prepare the data for sigining with nonce. from and to are the sender
      //payload should include s,r,v,nonce.
      allContractFactory.sendResponseForNotification(contract, "rejectContract", $scope.user_address, $scope.ks_local, $scope.pwDerivedKey, function (response) {

		
        if (response.status == "1") {

		
          console.log(response.data);
          txHash = response.data;
          var count1 = 0;
          var id1 = setInterval(function () {

            console.log("res===" + txHash + ethdapp.web3.eth.getTransactionReceipt(txHash));

            if (ethdapp.web3.eth.getTransactionReceipt(txHash)) {
              console.log("ohh yes");

              //insert into database
              $scope.spinnerFlag = true;
              $scope.textFlag = false;

              //update status, notification_flag, tx_hash array
              var tx_object = {};
              var tx_array = [];
              tx_object.caller =  $scope.user_email;
              tx_object.txHash = txHash;
              tx_array = contract.tx;
              tx_array.push(tx_object)
              var doc = contract;
			  doc.actionstatus = false;
			  
              doc.status = "rejected";
              doc.notification_flag = "false";
              doc.tx = tx_array;
              //update call.. 3 items
              databaseFactory.updateDoc(deal_db, doc, function (res) {

                console.log(res);
                // test data in db
                databaseFactory.getAllData(deal_db, function (response) {

                  console.log(response);
                  clearInterval(id1);

                  contract.actionstatus = false;
				
                  //$ionicLoading.hide();
                  $rootScope.balance = ethdapp.web3.fromWei(ethdapp.web3.eth.getBalance($scope.user_address), 'ether').toString();
                  //ionicToast.show('Mined Successfully', 'bottom', false, 2500);
				    $scope.$apply();

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
          $ionicLoading.hide();
          ionicToast.show(res.data, 'bottom', false, 2500);


        }



      });

    }
	
    $scope.acceptSettlement = function (contract) {

      contract.actionstatus = true;
      console.log("acceptContract: ", contract);
      console.log("settleContract: ", contract);
      allContractFactory.sendResponseForNotification(contract, "acceptSettleContract", $scope.user_address, $scope.ks_local, $scope.pwDerivedKey, function (response) {

	
        if (response.status == "1") {

		
          console.log(response.data);
          txHash = response.data;
          var count1 = 0;
          var id1 = setInterval(function () {

            console.log("res===" + txHash + ethdapp.web3.eth.getTransactionReceipt(txHash));

            if (ethdapp.web3.eth.getTransactionReceipt(txHash)) {
              console.log("ohh yes");

              //insert into database
              $scope.spinnerFlag = true;
              $scope.textFlag = false;

              //update status, notification_flag, tx_hash array
              var tx_object = {};
              var tx_array = [];
              tx_object.caller = $scope.user_email;
              tx_object.txHash = txHash;
              tx_array = contract.tx;
              tx_array.push(tx_object)
              var doc = contract;
			  doc.actionstatus = false;
              doc.status = "completed";
              doc.notification_flag = "false";
              doc.tx = tx_array;
              //update call.. 3 items
              databaseFactory.updateDoc(deal_db, doc, function (res) {

                console.log(res);
                // test data in db
                databaseFactory.getAllData(deal_db, function (response) {

                  console.log(response);
                  clearInterval(id1);
                  //$ionicLoading.hide();

                  contract.actionstatus = false;
				  
                  $rootScope.balance = ethdapp.web3.fromWei(ethdapp.web3.eth.getBalance($scope.user_address), 'ether').toString();
                  //ionicToast.show('Mined Successfully', 'bottom', false, 2500);
				  $scope.$apply();

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
          $ionicLoading.hide();
          ionicToast.show(res.data, 'bottom', false, 2500);


        }



      });

    }



    function loadDealsfromDB() {

      allContractFactory.getallPendingContracts(function (response) {

        console.log("Pending Contracts: ", response.data.docs);

        if (response.status == "1") {

          $scope.pendingcontracts = response.data.docs
          $scope.$apply();

        }

      });
      allContractFactory.getallActiveContracts(function (response) {

        console.log("Active Contracts: ", response.data.docs);

        if (response.status == "1") {

          $scope.activecontracts = response.data.docs;
          $scope.$apply();

        }

      });
      allContractFactory.getallCompletedContracts(function (response) {

        console.log("Completed Contracts: ", response.data.docs);

        if (response.status == "1") {

          $scope.completedcontracts = response.data.docs
          $scope.$apply();
        }

      });



    }

  }])
