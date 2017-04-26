mycontrollerModule.controller('createDealCtrl', ['$scope', '$stateParams','$state','$ionicModal','createContractFactory','$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state,$ionicModal,createContractFactory,$rootScope) {

    $scope.spinnerFlag = true;
    $scope.textFlag = false;
	console.log("Stateparams: ",$stateParams)
	$scope.contract = {};
	
	if($stateParams.contact!=null){
	
		$scope.contract.counterparty = $stateParams.contact.email;
	}
	$scope.selectCounterparty = function () {

		$state.go('menu.phonebook',{  flag: true } )

    };
	
	$scope.createDeal = function(contract){
	
	
		console.log(contract)
	
	};
	
		var deal_id = Math.round((Math.random() * 10000) * 10000);
		contract_data = {};
		contract_data.deal_id = deal_id;
		contract_data.from_ethAddress =$rootScope.globals.currentUser.address;
		contract_data.to_ethAddress = $rootScope.globals.currentUser.address;
		contract_data.from_email = $rootScope.globals.currentUser.email;
	  contract_data.to_email = 'nits7sid@gmail.com';
	  contract_data.start_date = '142457898';
	  contract_data.end_date = '142457898';
	  contract_data.asset_id = '5477545';
	  contract_data.asset_name = 'camera';
	  contract_data.description = 'camera for 2 days';

	  var pwDerivedKey = $rootScope.globals.currentUser.pwDerivedKey;
	  var ks = $rootScope.globals.currentUser.keystore;
	  var addr =contract_data.from_ethAddress ;

	  // call the createFactory to sign, encrypt, and send the transaction
	  createContractFactory.createContract(contract_data,pwDerivedKey,ks,addr,function(res) {

		console.log(res);

     });

	

}])
