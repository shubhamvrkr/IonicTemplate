mycontrollerModule.controller('phoneBookCtrl', ['$scope', '$stateParams', '$state', 'databaseFactory', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function($scope, $stateParams, $state, databaseFactory, $http) {



    $scope.data = {};
    //data from database

    $scope.cachedata = []
    $scope.availablecontacts = [];
    $scope.localcontacts = [];
    $scope.data.filteredlocalcontacts = $scope.localcontacts;
    $scope.data.filteredavailablecontacts = $scope.availablecontacts;

    //fetch contacts from the server
    function contactsFromServer(data) {

      $http.get(apiUrl + "/api/users?email=" + data)
        .success(function(response) {

          console.log(response)
          $scope.availablecontacts.push(response)


        }).catch(function(err) {

          console.log(err)

        });
    }

    //fetch contacts from the local DB
    databaseFactory.getAllData(contact_db, function(response) {

      if (response.status == "0") {
        console.log(response.data)
      } else {

        console.log(response.data.rows)
        response.data.rows.forEach(function(item) {

          $scope.localcontacts.push(item.doc)

        })


      }
    })


    $scope.Clear = function() {

      console.log($scope.data)
      $scope.data.searchText = "";

    };

    $scope.searchTextChanged = function(searchText) {

      console.log(searchText)
      if (searchText.length == 1) {

        //postcall to get all the items with starting characters
        //bind to scope.availablecontacts
        contactsFromServer(searchText)

      }
    }
    $scope.deleteContact = function(item) {

      //console.log(item)
      //var index1 = $scope.localcontacts.indexOf(item);
      //$scope.localcontacts.splice(index1, 1);
      //console.log(index1)
      //delete data from db where email = item.email;

    }

    $scope.addContact = function(contact) {

      console.log(contact)
        //var contact = {}
        //contact.email = "nDinesh@gmail.com"
        // contact.eth_address = "46576545465461232133wddede"
        //contact.name ="Dinesh Rivankar"
        // contact.publicKey = "2662790819999023100909"

      databaseFactory.putData(contact_db, contact, function(response) {

        if (response.status == "0") {
          console.log(response.data)
        } else {

          console.log(response.data)

        }
      })

    }

  }
])
