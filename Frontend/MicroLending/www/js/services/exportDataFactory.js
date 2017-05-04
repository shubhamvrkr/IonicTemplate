angular.module('app.services')

  .factory('exportDataFactory', ['$http', 'fileFactory', 'databaseFactory', function ($http, fileFactory, databaseFactory) {

    var service = {};

    //take arguemnts as contacts, deals from local db, symmteric ket to encrypt
    service.exportData = function (symmetricKey, contactsFromLocalDb, dealsFromLocalDb, callback) {

      //create a json file for user_profile, contatcs and deals and insert it in the folder micro_lending/user_data

      if (window.cordova) {
        ss.get(
          function (value) {

            console.log('Success, got ' + value);
            user_data_content = value;

            //create a json file for user_profile
            fileFactory.createFile("user_profile.json", "/micro_lending/user_data", function (res) {
              //encrypt user_data_content
              // var symKey = EthWallet.encryption_sign.getSymmetricKey256();
              //  console.log("symKey: ",symKey);

              EthWallet.encryption_sign.symEncrypt(user_data_content, symmetricKey, function (err, result) {
                console.log("Encrypted data: ", result)
                fileFactory.writeToFile("user_profile.json", "/micro_lending/user_data", result, function (result) {

                  //create a json file for contacts
                  fileFactory.createFile("contacts.json", "/micro_lending/user_data", function (contacts_file) {
                    EthWallet.encryption_sign.symEncrypt(contactsFromLocalDb, symmetricKey, function (err, contacts_encrypted) {
                      console.log("Encrypted data: ", contacts_encrypted)
                      fileFactory.writeToFile("contacts.json", "/micro_lending/user_data", contacts_encrypted, function (result) {

                        //create a json file for deals   
                        fileFactory.createFile("contracts.json", "/micro_lending/user_data", function (contacts_file) {
                          EthWallet.encryption_sign.symEncrypt(dealsFromLocalDb, symmetricKey, function (err, contracts_encrypted) {
                            console.log("Encrypted data: ", contacts_encrypted)
                            fileFactory.writeToFile("contracts.json", "/micro_lending/user_data", contracts_encrypted, function (result) {

                              //zip it
                              fileFactory.createZip("micro_lending/user_data", "micro_lending/user_data", result, function (status) {

                                //TODO: delete the .json file as it is not needed anymore
                                console.log(status)
                                if (status.status == "0") {
                                 callback({status:"0"});
                                } else {

                                 callback({status:"1"});

                                }

                              })
                            })
                          })
                        })
                      })
                    })
                  })


                });

              });
            });




          },
          function (error) {
            console.log('Error ' + error);
          },
          'user_data');
      }

      else{

        //for browsers
         console.log('local storage', localStorage.getItem('user_data'))
        user_data_content = localStorage.getItem('user_data')

        //var symKey = EthWallet.encryption_sign.getSymmetricKey256();
        //console.log("symKey: ",symKey);

        EthWallet.encryption_sign.symEncrypt(user_data_content, symmetricKey, function(err, result) {

          console.log(err)
          console.log(result)
          fileFactory.createZip("user_profile.json", "/", result, function(status) {

            console.log(status)
            if (status.status == "0") {
              $ionicLoading.hide();
              ionicToast.show('Error Exporting. Please try again', 'bottom', true, 2500);
            } else {

              $ionicLoading.hide();
              ionicToast.show('Profile Exported at /Downloads/user_profile.zip', 'bottom', true, 2500);

            }


          })

        });

      }

    };

    return service


  }]);
