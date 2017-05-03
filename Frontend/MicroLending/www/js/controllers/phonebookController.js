mycontrollerModule.controller('phoneBookCtrl', ['$scope', '$stateParams', '$state', 'databaseFactory', '$http', '$ionicLoading', 'ionicToast', 'fileFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $state, databaseFactory, $http, $ionicLoading, ionicToast, fileFactory) {

    console.log("Stateparams: ", $stateParams)

    $scope.visibilityflag = $stateParams.flag;

    $scope.data = {};
    //data from database

    // $scope.cachedata = []
    // $scope.availablecontacts = [];
    // $scope.localcontacts = [];
    // $scope.data.filteredlocalcontacts = $scope.localcontacts;
    // $scope.data.filteredavailablecontacts = $scope.availablecontacts;

    localContactsLength = 0;
    contactsLoadFlag = 0;
    // Fetch contacts onLoad
    contactsFromLocalDB();

    //fetch contacts from the server
    function contactsFromServer(data) {

      $scope.availablecontacts = [];
      $http.get(apiUrl + "/api/users?email=" + data)
        .success(function (response) {

          console.log(response);
          response.forEach(function (item) {
            $scope.availablecontacts.push(item);
          });
          //$scope.availablecontacts.push(response)


        }).catch(function (err) {

          console.log(err);

        });
    }

    //fetch contacts from the local DB
    function contactsFromLocalDB() {

      $scope.availablecontacts = [];
      $scope.localcontacts = [];
      $scope.data.filteredlocalcontacts = $scope.localcontacts;
      $scope.data.filteredavailablecontacts = $scope.availablecontacts;
      console.log($scope.localcontacts);
      console.log($scope.data.filteredlocalcontacts);


      databaseFactory.getAllData(contact_db, function (response) {

        if (response.status == "0") {
          console.log(response.data);
        } else {

          console.log(response.data.rows);

          response.data.rows.forEach(function (item) {

            $scope.localcontacts.push(item.doc);
            //dataToExport = item.doc;
            // console.log("Data to export ",dataToExport)
            $scope.$apply();
           

          });
            //Export();
        }
      });



    }


    $scope.Clear = function () {

      console.log($scope.data)
      $scope.data.searchText = "";

    };

    $scope.searchTextChanged = function (searchText) {

      console.log(searchText)

      console.log("Length of lc" + localContactsLength);
      console.log("Filter Length: " + $scope.data.filteredlocalcontacts.length)

      if ($scope.data.filteredlocalcontacts.length < 1 && searchText.length > 0) {
        //postcall to get all the items with starting characters
        //bind to scope.availablecontacts
        contactsFromServer(searchText)

      } else {
        $scope.availablecontacts = [];
      }

    }

    $scope.deleteContact = function (item) {

      console.log(item)
      var index1 = $scope.localcontacts.indexOf(item);

      console.log(index1)
      //delete data from db where email = item.email;


      databaseFactory.deleteDoc(contact_db, item, function (response) {

        if (response.status == "0") {

          console.log(response.data);
        } else {

          $scope.localcontacts.splice(index1, 1);
          $scope.$apply();
          console.log(response.data);

        }
      })

    }

    $scope.addContact = function (contact) {

      $ionicLoading.show({
        templateUrl: 'templates/loading.html',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });


      contactEntry = {
        "_id": contact.email,
        "eth_address": contact.ethAccount,
        "name": contact.name,
        "publicKey": contact.publicKey
      }
      console.log("contactEntry: ", contactEntry)

      databaseFactory.putData(contact_db, contactEntry, function (response) {

        if (response.status == "0") {
          console.log(response.data);
        } else {
          $scope.localcontacts.push(contactEntry);
          $scope.$apply();
          $ionicLoading.hide();
          console.log("response add: ", response.data);
          console.log("local contacts after adding: ", $scope.localcontacts.length);

        }
      })

    }

    $scope.selectContact = function (contact) {

      console.log("contact phonebook: ", contact)

      if (!contact._id.includes("@")) {

        var contactEntry = {
          "_id": contact.email,
          "eth_address": contact.ethAccount,
          "name": contact.name,
          "publicKey": contact.publicKey
        }
        databaseFactory.putData(contact_db, contactEntry, function (response) {

          if (response.status == "0") {
            console.log(response.data);
          } else {

            $scope.localcontacts.push(contactEntry);
            $scope.$apply();
            $state.go('menu.createdeal', { contact: contactEntry })

          }
        });

      } else {

        $state.go('menu.createdeal', { contact: contact })
      }

    };


    function Export() {
      console.log("contacts to export ", JSON.stringify($scope.localcontacts))
      if (window.cordova) {
        ss.get(
          function (value) {

            symmetricKey = value;
            console.log('symmetricKey ' + symmetricKey);
            fileFactory.createFile("contatcs.json", "/micro_lending/contacts", function (res) {

              EthWallet.encryption_sign.symEncrypt(JSON.stringify($scope.localcontacts), symmetricKey, function (err, encrypted_result) {
                console.log("Encrypted data: ", encrypted_result)

                fileFactory.writeToFile("contacts.json", "/micro_lending/contacts", encrypted_result, function (result) {

                });
              });

            });

          },
          function (error) {
            console.log('Error ' + error);
          },
          'symkey');
        //create a file contatcs.JSON

      }
      else {
        symmetricKey = localStorage.getItem("symkey");
        console.log('symmetricKey :', symmetricKey);
        EthWallet.encryption_sign.symEncrypt(JSON.stringify($scope.localcontacts), symmetricKey, function (err, result) {

          console.log(err)
          console.log(result)
          fileFactory.createZip("contacts.zip", "/", result, function (status) {

            console.log(status)
            if (status.status == "0") {
              $ionicLoading.hide();
              ionicToast.show('Error Exporting. Please try again', 'bottom', true, 2500);
            } else {

              $ionicLoading.hide();
              ionicToast.show('Profile Exported at /Downloads/contacts.zip', 'bottom', true, 2500);

            }


          })

        });


      }

    }

  }])
