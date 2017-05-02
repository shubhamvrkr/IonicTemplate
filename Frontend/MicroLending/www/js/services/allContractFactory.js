angular.module('app.services')
  .factory('allContractFactory', ['$http', 'databaseFactory', function ($http, databaseFactory) {

    var service = {};

    //load addr,ks,pwdervedkey from ss or localstorage

    service.getallPendingContracts = function (callback) {


      databaseFactory.getDoc(deal_db, { status: "pending" }, callback);


    };

    service.getallActiveContracts = function (callback) {


      databaseFactory.getDoc(deal_db, { status: "active" }, callback)


    };
    service.getallCompletedContracts = function (callback) {


      databaseFactory.getDoc(deal_db, { status: "completed" }, callback)


    };

    service.acceptContract = function (contract, callback) {

      contract_data = {};
      contract_data.deal_id = contract._id;
      contract_data.from_ethAddress = contract.from_eth_address;
      contract_data.to_ethAddress = contract.counter_party_address;
      contract_data.from_email = contract.from_email;
      contract_data.to_email = contract.counter_party_email;
      contract_data.start_date = contract.start_date;
      contract_data.end_date = contract.end_date;
      contract_data.asset_id = contract.asset_id;
      contract_data.asset_name = contract.asset_name;
      contract_data.description = contract.description;
      contract_data.nonce = new Date().getTime().toString();

      //sign the contract_data object 
      EthWallet.encryption_sign.signMsg(ks, pwDerivedKey, JSON.stringify(contract_data), addr, function (err1, result1) {

        if (err1) {

          console.log("Signing Error", err1);
          callback({
            status: "0",
            data: err1
          });
        } else {

          signature = result1;
          console.log('signature', signature);

          var s_hex = buffer.from(signature.s, 'hex');

          var r_hex = buffer.from(signature.r, 'hex');

          var payload = {};
          payload.sig_s = s_hex.toString('hex');
          payload.sig_r = r_hex.toString('hex');
          payload.sig_v = signature.v.toString();
          payload.nonce = contract_data.nonce;
          payload.from = contract_data.from_ethAddress;
          payload.to = contract_data.to_ethAddress;
          console.log(JSON.stringify(payload));

          //create a transaction
          ethdapp.sendTransaction("acceptContract", [JSON.stringify(payload), contract_data.deal_id.toString()], ks, pwDerivedKey, function (error, tx_hash) {

            if ("Transaction Sending err", error) {
              console.log(error);

              callback({
                status: "0",
                data: error
              });
            } else {
              console.log(tx_hash);         


              callback({
                status: "1",
                data: tx_hash
               
              });
            }



          });



        }


      });




    };



    return service;


  }]);
