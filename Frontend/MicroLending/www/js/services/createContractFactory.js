angular.module('app.services')
  .factory('createContractFactory', ['$http', 'databaseFactory', function($http, databaseFactory) {

    var service = {};
    //load addr,ks,pwdervedkey from ss or localstorage

    service.createContract = function(contract_data, pwDerivedKey, ks, addr, counterparty_Key, current_user_key, callback) {

      //call the encrypt function to encrypt the contract_data

      console.log(pwDerivedKey);
      console.log(ks);
      console.log(addr);

      //generate Symmetric Key
      var symKey = EthWallet.encryption_sign.getSymmetricKey256();

      console.log("Symmteric key", symKey);

      //encrypt symmetric key using couteparties public key
      EthWallet.encryption_sign.asymEncrypt(symKey, ks, pwDerivedKey, current_user_key, counterparty_Key, function(err_enc, sym_encrpyt) {

        console.log(current_user_key)
        console.log(counterparty_Key)
        if (err_enc) {

          console.log("Symmetric key Encryption Error", err_enc);
          callback({
            status: "0",
            data: err_enc
          });

        } else {


          console.log("Symmetric key after encryption: ", sym_encrpyt); //  returns cipertext

          EthWallet.encryption_sign.asymDecrypt(sym_encrpyt, ks, pwDerivedKey, counterparty_Key, current_user_key, function(err_dec, dec) {

            if (err_dec) {

              console.log(err_dec);
              callback({
                status: "0",
                data: err_dec
              });


            }
            console.log(dec); //  returns plaintext
            console.log("asym plaintext", dec); //  returns cipertext

            console.log('actual data', JSON.stringify(contract_data));
            // encrypt
            EthWallet.encryption_sign.symEncrypt(JSON.stringify(contract_data), symKey, function(err, result) {

              if (err) {

                console.log("Encryption Error", err);
                callback({
                  status: "0",
                  data: err
                });

              } else {

                console.log("after encryption :cipertext", result);

                // sign the contract_object

                EthWallet.encryption_sign.signMsg(ks, pwDerivedKey, JSON.stringify(contract_data), addr, function(err1, result1) {

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
                    // payload.from = contract_data.to_ethAddress;
                    payload.to = contract_data.to_ethAddress;
                    payload.key_symmteric = sym_encrpyt;


                    console.log("deal_id ", addr);

                    console.log(JSON.stringify(payload));
                    ethdapp.sendTransaction("createContract", [addr, JSON.stringify(payload), contract_data.deal_id.toString()], ks, pwDerivedKey, function(error, tx_hash) {

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
                          key:sym_encrpyt
                        });
                      }

                      //start the loader and after successfull insert into dataasbe

                      // get the TxID and populate the deal_database.db
                      //fields: deal_id,asset_name,counter_party_address,counter_party_email,creation_date,symmteric_key,status,nots_flag,tx[],expiry_date

                      // call database factory to put doc
                      /*console.log(contract_data);
                      var doc = {};
                      doc._id = contract_data.deal_id.toString();
                      doc.asset_name = contract_data.asset_name;
                      doc.counter_party_address = contract_data.to_ethAddress;
                      doc.counter_party_email = contract_data.to_email;
                      doc.creation_date = contract_data.start_date;
                      doc.end_date = contract_data.end_date;
                      doc.symmteric_key = contract_data.end_date;
                      doc.status = contract_data.end_date;
                      doc.tx = [tx_hash];

                      databaseFactory.putData(deal_db, doc, function(res) {

                        console.log(res);


                        // test data in db
                        databaseFactory.getAllData(deal_db, function(response) {

                          console.log(response);


                        });

                      });*/

                    });


                  }


                });
              }
            });
          });
        }
      });


    };


    return service;


  }]);
