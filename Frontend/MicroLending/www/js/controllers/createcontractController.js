mycontrollerModule.controller('createDealCtrl', ['$scope', '$stateParams', '$state', '$ionicModal', 'createContractFactory', '$rootScope', '$ionicLoading', 'ionicToast', 'databaseFactory', 'getCurrentUserData', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $state, $ionicModal, createContractFactory, $rootScope, $ionicLoading, ionicToast, databaseFactory, getCurrentUserData) {


    $scope.$on("$ionicView.beforeEnter", function () {

      jQuery.uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
          /(webkit)[ \/]([\w.]+)/.exec(ua) ||
          /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
          /(msie) ([\w.]+)/.exec(ua) ||
          ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
          [];

        return {
          browser: match[1] || "",
          version: match[2] || "0"
        };
      };
      browser = {};

      matched = jQuery.uaMatch(navigator.userAgent);
      console.log(matched.browser);
      if (matched.browser) {
        browser[matched.browser] = true;
        browser.version = matched.version;
      }

      // Chrome is Webkit, but Webkit is also Safari.
      if (browser.chrome) {
        browser.webkit = true;
      } else if (browser.webkit) {
        browser.safari = true;
      }

      jQuery.browser = browser;
      var startDate = $('#startDate');
      if (startDate.length > 0) {
        if (!Modernizr.inputtypes.date) {
          // If not native HTML5 support, fallback to jQuery datePicker
          $('#startDate').datepicker({
            // Consistent format with the HTML5 picker
            dateFormat: 'dd/mm/yy',
            minDate: 0,
            onClose: function () {
              console.log("Date picker dat changed");
              var dt1 = $('#startDate').datepicker('getDate');
              dt1.setDate(dt1.getDate() + 1);
              console.log(dt1);
              $('#endDate').datepicker('option', { minDate: dt1 });

              console.log("Start set" + document.getElementById("startDate").value);
            }


          },
            // Localization
            $.datepicker.regional['en-GB']
          );

          $('#endDate').datepicker({
            // Consistent format with the HTML5 picker
            dateFormat: 'dd/mm/yy',
            minDate: 0,
            onClose: function () {
              // var dt1 = $('#startDate').datepicker('getDate');
              // console.log(dt1);
              // var dt2 = $('#endDate').datepicker('getDate');
              // if (dt2 <= dt1) {
              //   $('#endDate').datepicker('setDate', minDate);
              // }
              console.log("End set" + document.getElementById("endDate").value);
            }
          },
            // Localization
            $.datepicker.regional['en-GB']
          );

        }
      }

      if (matched.browser == "chrome") {
        // Date validation for chrome/opera
        // Set min attr of start date to current date
        if (typeof (startDateChrome) != 'undefined') {
          console.log("Start Date check" + today);
          startDateChrome.setAttribute('min', today);
        }

        document.getElementById("startDate").onchange = function () { setEndDate(); };
        document.getElementById("endDate").onchange = function () { setStartDate(); };

        setStartDate();
        setEndDate();

      }

      // Update end date based on start date
      function setEndDate() {
        console.log("Start Date Changed");
        var startDateChrome = document.getElementById("startDate");
        var endDateChrome = document.getElementById("endDate");
        console.log(startDateChrome.value);
        if (startDateChrome.value != "") {
          var terminationDate = new Date(startDateChrome.value);
          console.log(terminationDate);
          terminationDate.setDate(terminationDate.getDate() + 1);
          terminationDate = terminationDate.toISOString().split('T')[0];
          endDateChrome.setAttribute('min', terminationDate);
          endDateChrome.value = terminationDate;
        }
      }

      // Update end date based on start date
      function setStartDate() {
        console.log("Start Date Changed");
        var startDateChrome = document.getElementById("startDate");
        var endDateChrome = document.getElementById("endDate");
        console.log(startDateChrome.value);
        if (endDateChrome.value != "") {
          var startDateSet = new Date(endDateChrome.value);
          console.log(startDateSet);
          startDateSet.setDate(startDateSet.getDate() - 1);
          startDateSet = startDateSet.toISOString().split('T')[0];
          startDateChrome.setAttribute('min', startDateSet);
          startDateChrome.value = startDateSet;
        }
      }

    });

    //fetch the localStorage data

    getCurrentUserData.getData(function (data) {

      user_data = data.data;
      console.log(user_data);
      from_eth_address = user_data.from_eth_address;
      from_email = user_data.from_email;
      ks_local = user_data.ks_local;
      pwDerivedKey = user_data.pwDerivedKey;
      current_user_key = user_data.current_user_key;

      console.log(pwDerivedKey);

    });


    $scope.spinnerFlag = true;
    $scope.textFlag = false;
    console.log("Stateparams: ", $stateParams);
    $scope.data = {};

    if ($stateParams.contact != null) {

      $scope.data.counterparty = $stateParams.contact._id;

    }
    $scope.selectCounterparty = function () {

      $state.go('menu.phonebook', {
        flag: true
      });

    };


    $scope.CreateDeal = function (data) {
      $scope.spinnerFlag = false;
      $scope.textFlag = true;

      console.log(data);
      console.log(data.startdate);
      console.log(data.enddate);
      var deal_id = Math.round((Math.random() * 10000) * 10000);
      contract_data = {};
      contract_data.deal_id = deal_id.toString();
      contract_data.from_ethAddress = from_eth_address;
      contract_data.to_ethAddress = $stateParams.contact.eth_address;
      contract_data.from_email = from_email;
      contract_data.to_email = $stateParams.contact._id;
      contract_data.start_date = Math.round(data.startdate / 1000);
      contract_data.end_date = Math.round(data.enddate / 1000);
      contract_data.asset_id = data.assetid;
      contract_data.asset_name = data.assetname;
      contract_data.description = data.description;

      var pwDerivedKey1 = pwDerivedKey;
      var ks = ks_local;
      var addr = contract_data.from_ethAddress;
      counterparty_publickKey = $stateParams.contact.publicKey;


      console.log(contract_data);

      // call the createFactory to sign, encrypt, and send the transaction
      createContractFactory.createContract(contract_data, pwDerivedKey1, ks, addr, counterparty_publickKey, current_user_key, function (res) {

        if (res.status == "1") {

          console.log(res.data);
          txHash = res.data;
          //start the loading logic here

          var count1 = 0;
          var id1 = setInterval(function () {

            console.log("res===" + txHash + ethdapp.web3.eth.getTransactionReceipt(txHash));

            if (ethdapp.web3.eth.getTransactionReceipt(txHash)) {
              console.log("ohh yes");

              //insert into database
              $scope.spinnerFlag = true;
              $scope.textFlag = false;

              var doc = {};
              doc._id = contract_data.deal_id.toString();
              doc.asset_name = contract_data.asset_name;
              doc.counter_party_address = contract_data.to_ethAddress;
              doc.counter_party_email = contract_data.to_email;
              doc.creation_date = new Date().getTime().toString();
              doc.start_date = contract_data.start_date;
              doc.end_date = contract_data.end_date;
              doc.from_address = contract_data.from_ethAddress;
              doc.from_email = contract_data.from_email;
              doc.description = contract_data.description;
              doc.asset_id = contract_data.asset_id;


              doc.symmteric_key = res.key;
              doc.status = "pending";
              doc.notification_flag = "false";
              doc.tx = [txHash];

              databaseFactory.putData(deal_db, doc, function (res) {

                console.log(res);
                // test data in db
                databaseFactory.getAllData(deal_db, function (response) {

                  console.log(response);
                  clearInterval(id1);
                  $ionicLoading.hide();

                  $rootScope.balance = ethdapp.web3.fromWei(ethdapp.web3.eth.getBalance(from_eth_address), 'ether').toString();
                  $scope.$apply();
                  ionicToast.show('Mined Successfully', 'bottom', false, 2500);

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

    };
  }
]);
