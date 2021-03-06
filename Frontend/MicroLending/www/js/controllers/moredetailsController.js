mycontrollerModule.controller('moredetailsCtrl', ['$scope', '$rootScope', '$stateParams', '$state', '$ionicLoading', '$timeout', '$ionicHistory', 'allContractFactory', 'databaseFactory', 'getCurrentUserData', '$cordovaClipboard', 'clipboard','$cordovaNativeAudio','ionicToast',
  function ($scope, $rootScope, $stateParams, $state, $ionicLoading, $timeout, $ionicHistory, allContractFactory, databaseFactory, getCurrentUserData, $cordovaClipboard, clipboard, $cordovaNativeAudio,ionicToast) {


    //load current user details
    $scope.verificationFlag = true;
    //adding verification flag
    if ($stateParams.contract == null) {
      console.log("State Params NULL!")
      $timeout(function () {
        $state.go('menu.allContracts');
      }, 0);
    }

    else {

      // Copy To Clipboard
      $scope.copyToClipboard = function (text) {
        if (window.cordova) {
		
          $cordovaClipboard
            .copy(text)
            .then(function () {
              // success
			  ionicToast.show('Copied to clipboard', 'bottom', false,1500);
              console.log("Copied!")
            }, function () {
              // error

              console.log("Copying failed!")
            });
        } else {
		
		  ionicToast.show('Copied to clipboard', 'bottom', false,1500);
          clipboard.copyText(text);
        }
      }
      $scope.dealData = $stateParams.contract;
      //if ($scope.dealData.ev==)


      getCurrentUserData.getData(function (currentUser) {
        console.log("MoreDetails controller - Get User Data")
        $scope.currentUserEmail = currentUser.data.from_email;
        $scope.currentUserAddress = currentUser.data.from_eth_address;

        $scope.ks_local = currentUser.data.ks_local;
        $scope.pwDerivedKey = currentUser.data.pwDerivedKey;


        console.log($stateParams.contract);
        console.log("Deal data: ", $scope.dealData);


        // perform verfication of the signatures of all the tx's in $scope.dealData.tx
        var tx_array = $scope.dealData.tx;
        //get the event details from geth Client using tx_hash

        for (var k = 0; k < tx_array.length; k++) {

          if (tx_array[k].caller == $scope.currentUserEmail) {
            console.log("No counter party transactions found!");
            $scope.verificationFlag = true;
            // $scope.dealData.tx[k].txverificationFlag = true;
          }

          else {
            console.log("it is there");
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
              var sig_data = null;
              console.log(event)

              var inputs = event.inputs.map(function (input) { return input.type; });

              var data = solidity.decodeParams(inputs, log.data.replace("0x", ""));
              console.log(data);
              // console.log(JSON.parse(data[2]));
              if (event.name == "createContractEvent") {
                sig_data = JSON.parse(data[2]);
              }
              else {
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

              databaseFactory.getDocById(contact_db, tx_array[k].caller, function (response) {

                if (response.status == "0") {

                  console.log("contact with email not found : ");

                } else {

                  console.log(response.data);
                  console.log(k);
                  EthWallet.encryption_sign.verifyMsg(response.data.eth_address, JSON.stringify(temp_contract_data), v_hex, r_hex, s_hex, function (err, verifiedResult) {

                    if (err) {

                      console.log("Error in verifying signature: ", err);
                      $scope.verificationFlag = false;


                    } else {

                      console.log("Verification Status: ", verifiedResult, k);
                      if (verifiedResult) {
                        $scope.verificationFlag = true;

                      } else {
                        $scope.verificationFlag = false;
                      }
                      $scope.$apply();
                    };

                  });
                }
              });

            }
          }

        }

      });
    }

    // Loader flags
    $scope.spinnerFlag = true;
    $scope.isSaving = false;

    // Button actions
    $scope.settleContract = function (contract) {
      $scope.spinnerFlag = false;
      $scope.isSaving = true;

      console.log("settleContract: ", contract);
      allContractFactory.sendResponseForNotification(contract, "initiateSettleContract", $scope.currentUserAddress, $scope.ks_local, $scope.pwDerivedKey, function (response) {

        if (response.status == "1") {

          console.log(response.data);
          txHash = response.data;
          var count1 = 0;
          var id1 = setInterval(function () {

            console.log("res===" + txHash + ethdapp.web3.eth.getTransactionReceipt(txHash));

            if (ethdapp.web3.eth.getTransactionReceipt(txHash)) {
              console.log("ohh yes");

              //insert into database
              //update status, notification_flag, tx_hash array
              var tx_object = {};
              var tx_array = [];
              tx_object.caller = $scope.currentUserEmail;
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
                  $scope.spinnerFlag = true;
                  $scope.isSaving = false;
                    $cordovaNativeAudio.play('bass')
					   .then(function(msg) { console.log(msg); })
					   .catch(function(error) { console.error(error); });
                  //$ionicLoading.hide();
                  $rootScope.balance = ethdapp.web3.fromWei(ethdapp.web3.eth.getBalance($scope.currentUserAddress), 'ether').toString();
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
          $scope.isSaving = false;
          $scope.spinnerFlag = true;
          $scope.error = "Insufficient funds to make any transactions!"
        
          // ionicToast.show(res.data, 'bottom', false, 2500);


        }



      });
    }
    $scope.acceptContract = function (contract) {


      $scope.spinnerFlag = false;
      $scope.isSaving = true;

      console.log("acceptSettlement: ", contract);

      $scope.dealInProgress = "true";
      //1. prepare the data for sigining with nonce. from and to are the sender
      //payload should include s,r,v,nonce.
      allContractFactory.sendResponseForNotification(contract, "acceptContract", $scope.currentUserAddress, $scope.ks_local, $scope.pwDerivedKey, function (response) {

        if (response.status == "1") {

          console.log(response.data);
          txHash = response.data;
          var count1 = 0;
          var id1 = setInterval(function () {

            console.log("res===" + txHash + ethdapp.web3.eth.getTransactionReceipt(txHash));

            if (ethdapp.web3.eth.getTransactionReceipt(txHash)) {
              console.log("ohh yes");

              //insert into database
              //update status, notification_flag, tx_hash array
              var tx_object = {};
              var tx_array = [];
              tx_object.caller = $scope.currentUserEmail;
              tx_object.txHash = txHash;
              tx_object.eventName = "acceptContract";
              tx_array = contract.tx;
              tx_array.push(tx_object)
              var doc = contract;
              doc.actionstatus = false;

              console.log("doc to be updated", doc)
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
                  $scope.spinnerFlag = true;
                  $scope.isSaving = false;
                    $cordovaNativeAudio.play('bass')
					   .then(function(msg) { console.log(msg); })
					   .catch(function(error) { console.error(error); });
                  //$ionicLoading.hide();
                  $rootScope.balance = ethdapp.web3.fromWei(ethdapp.web3.eth.getBalance($scope.currentUserAddress), 'ether').toString();
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

         $ionicLoading.hide();
          $scope.isSaving = false;
          $scope.spinnerFlag = true;
          $scope.error = "Insufficient funds to make any transactions!"
        
        }
      });
    }


    $scope.rejectContract = function (contract) {

      console.log("rejectContract: ", contract);
      $scope.spinnerFlag = false;
      $scope.isSaving = true;

      $scope.dealInProgress = "true";
      //1. prepare the data for sigining with nonce. from and to are the sender
      //payload should include s,r,v,nonce.
      allContractFactory.sendResponseForNotification(contract, "rejectContract", $scope.currentUserAddress, $scope.ks_local, $scope.pwDerivedKey, function (response) {

        if (response.status == "1") {

          console.log(response.data);
          txHash = response.data;
          var count1 = 0;
          var id1 = setInterval(function () {

            console.log("res===" + txHash + ethdapp.web3.eth.getTransactionReceipt(txHash));

            if (ethdapp.web3.eth.getTransactionReceipt(txHash)) {
              console.log("ohh yes");

              //insert into database
              //update status, notification_flag, tx_hash array
              var tx_object = {};
              var tx_array = [];
              tx_object.caller = $scope.currentUserEmail;
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
                  $scope.spinnerFlag = true;
                  $scope.isSaving = false;
                    $cordovaNativeAudio.play('bass')
					   .then(function(msg) { console.log(msg); })
					   .catch(function(error) { console.error(error); });
                  //$ionicLoading.hide();
                  $rootScope.balance = ethdapp.web3.fromWei(ethdapp.web3.eth.getBalance($scope.currentUserAddress), 'ether').toString();
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

          $ionicLoading.hide();
          $scope.isSaving = false;
          $scope.spinnerFlag = true;
          $scope.error = "Insufficient funds to make any transactions!"
        
        }
      });

    }

    $scope.acceptSettlement = function (contract) {

      $scope.spinnerFlag = false;
      $scope.isSaving = true;
      console.log("acceptContract: ", contract);
      console.log("settleContract: ", contract);
      allContractFactory.sendResponseForNotification(contract, "acceptSettleContract", $scope.currentUserAddress, $scope.ks_local, $scope.pwDerivedKey, function (response) {

        if (response.status == "1") {

          console.log(response.data);
          txHash = response.data;
          var count1 = 0;
          var id1 = setInterval(function () {

            console.log("res===" + txHash + ethdapp.web3.eth.getTransactionReceipt(txHash));

            if (ethdapp.web3.eth.getTransactionReceipt(txHash)) {
              console.log("ohh yes");

              //insert into database

              //update status, notification_flag, tx_hash array
              var tx_object = {};
              var tx_array = [];
              tx_object.caller = $scope.currentUserEmail;
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
                  $scope.spinnerFlag = true;
                  $scope.isSaving = false;
                    $cordovaNativeAudio.play('bass')
					   .then(function(msg) { console.log(msg); })
					   .catch(function(error) { console.error(error); });
                  //$ionicLoading.hide();
                  $rootScope.balance = ethdapp.web3.fromWei(ethdapp.web3.eth.getBalance($scope.currentUserAddress), 'ether').toString();
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

         $ionicLoading.hide();
          $scope.isSaving = false;
          $scope.spinnerFlag = true;
          $scope.error = "Insufficient funds to make any transactions!"
        
        }



      });

    }


    $scope.backButtonPress = function () {

      console.log("back button pressed")
      $state.go('menu.allContracts');

    }



    $scope.verify = function (tx) {
      var data = ethdapp.web3.eth.getTransactionReceipt(tx.txHash);

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
        var sig_data = null;
        console.log(event)

        var inputs = event.inputs.map(function (input) { return input.type; });

        var data = solidity.decodeParams(inputs, log.data.replace("0x", ""));
        console.log(data);
        // console.log(JSON.parse(data[2]));
        if (event.name == "createContractEvent") {
          sig_data = JSON.parse(data[2]);
        }
        else {
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

        databaseFactory.getDocById(contact_db, tx.caller, function (response) {

          if (response.status == "0") {

            console.log("contact with email not found : ");

          } else {

            console.log(response.data);

            EthWallet.encryption_sign.verifyMsg(response.data.eth_address, JSON.stringify(temp_contract_data), v_hex, r_hex, s_hex, function (err, verifiedResult) {

              if (err) {

                console.log("Error in verifying signature: ", err);
                //$scope.verificationFlag = false;


              } else {

                console.log("Verification Status: ", verifiedResult);
                if (verifiedResult) {

                  // $scope.verificationFlag = true;

                } else {
                  // $scope.verificationFlag = false;
                }
                //$scope.$apply();
              };

            });
          }
        });

      }

    };

    $scope.doRefresh = function () {


      $scope.$broadcast('scroll.refreshComplete');

    }
  }]);