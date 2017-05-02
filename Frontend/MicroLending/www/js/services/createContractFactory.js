angular.module('app.services')
  .factory('createContractFactory', ['$http', 'databaseFactory', function ($http, databaseFactory) {

    var service = {};
    //load addr,ks,pwdervedkey from ss or localstorage

    service.createContract = function (contract_data, pwDerivedKey, ks, addr, counterparty_Key, current_user_key, callback) {

      //call the encrypt function to encrypt the contract_data
      data_for_sign = contract_data;
      data_for_sign.nonce = new Date().getTime().toString();
      console.log(pwDerivedKey);
      console.log(ks);
      console.log(addr);

      //generate Symmetric Key
      var symKey = EthWallet.encryption_sign.getSymmetricKey256();

      console.log("Symmteric key", symKey);

      //encrypt symmetric key using couteparties public key
      EthWallet.encryption_sign.asymEncrypt(symKey, ks, pwDerivedKey, current_user_key, counterparty_Key, function (err_enc, sym_encrpyt) {

        console.log(current_user_key);
        console.log(counterparty_Key);
        if (err_enc) {

          console.log("Symmetric key Encryption Error", err_enc);
          callback({
            status: "0",
            data: err_enc
          });

        } else {


          console.log("Symmetric key after encryption: ", sym_encrpyt); //  returns cipertext

          //EthWallet.encryption_sign.asymDecrypt(sym_encrpyt, ks, pwDerivedKey, counterparty_Key, current_user_key, function(err_dec, dec) {


          console.log('actual data', JSON.stringify(contract_data));
          // encrypt
          EthWallet.encryption_sign.symEncrypt(JSON.stringify(contract_data), symKey, function (err, result) {

            if (err) {

              console.log("Encryption Error", err);
              callback({
                status: "0",
                data: err
              });

            } else {

              console.log("after encryption :cipertext", result);

              // sign the contract_object

              EthWallet.encryption_sign.signMsg(ks, pwDerivedKey, JSON.stringify(data_for_sign), addr, function (err1, result1) {

                if (err1) {

                  console.log("Signing Error", err1);
                  callback({
                    status: "0",
                    data: err1
                  });
                } else {

                  signature = result1;
                  console.log('signature', signature);

                  //convert to hex format
                  var s_hex = buffer.from(signature.s, 'hex');

                  var r_hex = buffer.from(signature.r, 'hex');

                  console.log(s_hex);

                  //back to Unint array
                  var r_hex_e = buffer.from(r_hex.toString('hex'), 'hex');

                  var s_hex_e = buffer.from(s_hex.toString('hex'), 'hex');

                  console.log(s_hex_e);
                  //create object to store in the contract and call send transaction with args[to,payload,deal_id]


                  var payload = {};
                  payload.sig_s = s_hex.toString('hex');
                  payload.sig_r = r_hex.toString('hex');
                  payload.sig_v = signature.v.toString();
                  payload.contract_data = result;
                  payload.nonce = data_for_sign.nonce;
                  payload.from = contract_data.from_ethAddress;
                  console.log('to ', contract_data.to_ethAddress);
                  console.log('from ', contract_data.from_ethAddress);
                  payload.to = contract_data.to_ethAddress;
                  payload.key_symmteric = sym_encrpyt;




                  console.log(JSON.stringify(payload));
                  ethdapp.sendTransaction("createContract", [addr, JSON.stringify(payload), contract_data.deal_id.toString()], ks, pwDerivedKey, function (error, tx_hash) {

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
                        data: tx_hash,
                        key: sym_encrpyt
                      });
                    }



                  });


                }


              });
            }
          });
          // });
        }
      });


    };


    return service;


  }]);
