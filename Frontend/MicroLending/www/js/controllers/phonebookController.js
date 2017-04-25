mycontrollerModule.controller('phoneBookCtrl', ['$scope', '$stateParams', '$state', 'databaseFactory', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $state, databaseFactory, $http) {

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
    contactsFromLocalDB("");

    //fetch contacts from the server
    function contactsFromServer(data) {
      $scope.availablecontacts = [];
      $http.get(apiUrl + "/api/users?email=" + data)
        .success(function (response) {

          console.log(response)
          response.forEach(function (item) {
            $scope.availablecontacts.push(item)
          })
          //$scope.availablecontacts.push(response)


        }).catch(function (err) {

          console.log(err)

        });
    }

    //fetch contacts from the local DB
    function contactsFromLocalDB(searchText) {
      $scope.availablecontacts = [];
      $scope.localcontacts = [];
      $scope.data.filteredlocalcontacts = $scope.localcontacts;
      $scope.data.filteredavailablecontacts = $scope.availablecontacts;



      databaseFactory.getAllData(contact_db, searchText, function (response) {

        if (response.status == "0") {
          console.log(response.data)
        } else {

          console.log(response.data.rows)
          localContactsLength = response.data.rows.length;

          console.log("Length on lc inside fn:" + localContactsLength + "Flag" + contactsLoadFlag);
          console.log($scope.localcontacts);
          response.data.rows.forEach(function (item) {
            console.log(item);
            $scope.localcontacts.push(item.doc)
          })
        }
      })
    }


    $scope.Clear = function () {

      console.log($scope.data)
      $scope.data.searchText = "";

    };

    $scope.searchTextChanged = function (searchText) {

      console.log(searchText)

      console.log("Length of lc" + localContactsLength);
      console.log("Filter Length: " + $scope.data.filteredlocalcontacts.length)
      if ($scope.data.filteredlocalcontacts.length < 1) {
        //postcall to get all the items with starting characters
        //bind to scope.availablecontacts
        contactsFromServer(searchText)
      }
    }

    $scope.deleteContact = function (item) {

      console.log(item)
      var index1 = $scope.localcontacts.indexOf(item);
      $scope.localcontacts.splice(index1, 1);
      console.log(index1)
      //delete data from db where email = item.email;


      databaseFactory.putData(contact_db, item, function (response) {

        if (response.status == "0") {
          console.log(response.data);
        } else {

          console.log(response.data);

        }
      })

    }

    $scope.addContact = function (contact) {

      console.log(contact);
      contactEntry = {
        "_id": contact.email,
        "eth_address": contact.ethAccount,
        "name": contact.name,
        "publicKey": "123"
      }
      databaseFactory.putData(contact_db, contactEntry, function (response) {

        if (response.status == "0") {
          console.log(response.data);
        } else {
          $scope.localcontacts.push(contactEntry);
          console.log(response.data);
          console.log($scope.localcontacts.length);

        }
      })

    }

  }
])
