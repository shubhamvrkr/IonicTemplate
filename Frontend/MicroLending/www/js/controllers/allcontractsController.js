mycontrollerModule.controller('allContractsCtrl', ['$scope', '$stateParams', '$state', 'allContractFactory', '$rootScope', 'getCurrentUserData', 'databaseFactory', 'expiredContractsFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName

  function ($scope, $stateParams, $state, allContractFactory, $rootScope, getCurrentUserData, databaseFactory, expiredContractsFactory) {

    var reminder_flag = "reminder_flag"
    if (window.cordova) {
      ss.get(
        function (value) {
          console.log('Success ' + value);
        },
        function (error) {
          console.log('Error ' + error);
          alarmmanager.start("11", "02", $rootScope.alarmSuccessCallback, $rootScope.alarmErrorCallback);
          ss.set(

            function (reminder_flag) { console.log('Set reminder_flag', reminder_flag); },
            function (error) { console.log('Error ' + error); },
            'reminder_flag', "true"
          );

        },
        reminder_flag);
    }

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
      var doc = contract;
      doc.notification_flag = "false";
      databaseFactory.updateDoc(deal_db, doc, function (res) {


        console.log("Doc updated successfully")
        databaseFactory.getDocById(deal_db, doc._id, function (response) {

          if (response.status == "1") {

            $state.go('moredetails', { contract: response.data })
          }

        });
      });




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
              tx_object.caller = $scope.user_email;
              tx_object.txHash = txHash;
              tx_object.eventName = "initiateSettlement";
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
                  loadDealsfromDB();
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
          $scope.error = "Insufficient funds to make any transactions!"
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
              tx_object.caller = $scope.user_email;
              tx_object.txHash = txHash;
              tx_object.eventName = "acceptContract";
              tx_array = contract.tx;
              tx_array.push(tx_object)
              var doc = contract;
              doc.actionstatus = false;


              doc.status = "active";
              doc.notification_flag = "false";
              doc.tx = tx_array;
              console.log("Doc to be updated: ", doc);
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
                  loadDealsfromDB();
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
          $scope.error = "Insufficient funds to make any transactions!"
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
              tx_object.caller = $scope.user_email;
              tx_object.txHash = txHash;
              tx_object.eventName = "rejectContract";
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
                  loadDealsfromDB();
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
          $scope.error = "Insufficient funds to make any transactions!"
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
              tx_object.eventName = "acceptSettlement";
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
                  loadDealsfromDB();
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
          $scope.error = "Insufficient funds to make any transactions!"
          $ionicLoading.hide();
          ionicToast.show(res.data, 'bottom', false, 2500);


        }



      });

    }



    function loadDealsfromDB() {
      $scope.groups = [];

      allContractFactory.getallPendingContracts(function (response) {
        var count = 0;
        console.log("Pending Contracts: ", response.data.docs);

        if (response.status == "1") {

          $scope.pendingcontracts = response.data.docs;
          $scope.$apply();
          console.log("PC Length : " + $scope.pendingcontracts.length);
          console.log($scope.pendingcontracts);

          $scope.groups.push({ name: "Pending Contracts", items: [], notification_flag: "false", notification_count: 0, isExpired: "false" });

          $scope.pendingcontracts.forEach(function (element) {
            $scope.groups[0].items.push(element);
            if (element.notification_flag == "true") {
              count++;
              console.log("flag is true");
              $scope.groups[0].notification_flag = "true";
            }
          });

          $scope.groups[0].notification_count = count;
        }

      });

      allContractFactory.getallActiveContracts(function (response) {

        console.log("Active Contracts: ", response.data.docs);
        var count = 0;
        if (response.status == "1") {

          $scope.activecontracts = response.data.docs;
          $scope.$apply();

          $scope.groups.push({ name: "Active Contracts", items: [], notification_flag: "false", notification_count: 0, isExpired: "false" });

          $scope.activecontracts.forEach(function (element) {
            $scope.groups[1].items.push(element);
            if (element.notification_flag == "true") {

              console.log("flag is true");
              count++;
              $scope.groups[1].notification_flag = "true";
            }
          });
          $scope.groups[1].notification_count = count;
        }

      });

      allContractFactory.getallCompletedContracts(function (response) {

        console.log("Completed Contracts: ", response.data.docs);
        var count = 0;
        if (response.status == "1") {

          $scope.completedcontracts = response.data.docs;
          $scope.$apply();
          $scope.groups.push({ name: "Completed Contracts", items: [], notification_flag: "false", notification_count: 0, isExpired: "false" });

          $scope.completedcontracts.forEach(function (element) {
            $scope.groups[2].items.push(element);
            if (element.notification_flag == "true") {

              console.log("flag is true");
              count++;
              $scope.groups[2].notification_flag = "true";
            }
          });
          $scope.groups[2].notification_count = count;
        }

      });

      allContractFactory.getallRejectedContracts(function (response) {

        console.log("rejected Contracts: ", response.data.docs);
        var count = 0;
        if (response.status == "1") {

          $scope.rejectedcontracts = response.data.docs;
          $scope.$apply();

          $scope.groups.push({ name: "Rejected Contracts", items: [], notification_flag: "false", notification_count: 0, isExpired: "false" });
          $scope.rejectedcontracts.forEach(function (element) {
            $scope.groups[3].items.push(element);
            if (element.notification_flag == "true") {
              count++;
              console.log("flag is true");
              $scope.groups[3].notification_flag = "true";
            }
          });

          $scope.groups[3].notification_count = count;

        }

      });

      expiredContractsFactory.getAllUnsettledExpiredContracts(function (response) {

        $scope.unsettledcontracts = response;
        $scope.$apply();
        $scope.groups.push({ name: "Contracts Due for settlement", items: [], notification_flag: "false", notification_count: 0, isExpired: "false" });
        //$scope.shownGroup = $scope.groups[0];
        $scope.unsettledcontracts.forEach(function (element) {

          if (element.tx.length != 1) {
            $scope.groups[4].items.push(element);

            $scope.groups[4].notification_flag = "true";

          }
          
        });

        $scope.groups[4].isExpired = "true";
           
        var tem = $scope.groups[4];
        $scope.groups[4] = $scope.groups[0];
        $scope.groups[0] = tem;
      
       tem = $scope.groups[4];
        $scope.groups[4] = $scope.groups[2];
        $scope.groups[2] = tem;

         tem = $scope.groups[2];
        $scope.groups[2] = $scope.groups[1];
        $scope.groups[1] = tem;
       // $scope.shownGroup = $scope.groups[0];
        $scope.$apply();
checkAccordianIsOpen();
    

        console.log("Length is ", $scope.groups);

      });

    }

	  /*
	   * if given group is the selected group, deselect it
	   * else, select the given group
	   */
    $scope.toggleGroup = function (group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };
    $scope.isGroupShown = function (group) {
      return $scope.shownGroup === group;
    };

	$scope.selectColoumByGroup = function(group){
	
		console.log(group);
		if(group.isExpired =="false"){
		
			return '-creation_date';
		
		}else{
				
			return '-end_date';
		}
	
	};
	
	$scope.doRefresh =function(){
	
		loadDealsfromDB();
		$scope.$broadcast('scroll.refreshComplete');
	
	}

  function checkAccordianIsOpen(){
    if($scope.groups[0].items.length!=0){
      $scope.shownGroup = $scope.groups[0];

    }else if($scope.groups[1].items.length!=0){
      $scope.shownGroup = $scope.groups[1];

    
    }else if($scope.groups[2].items.length!=0){
      $scope.shownGroup = $scope.groups[2];

    
    }else if($scope.groups[3].items.length!=0){
      $scope.shownGroup = $scope.groups[3];

    
    }

  }

  }]);
