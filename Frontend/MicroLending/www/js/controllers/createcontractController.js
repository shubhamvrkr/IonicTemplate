mycontrollerModule.controller('createDealCtrl', ['$scope', '$stateParams','$state','$ionicModal', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state,$ionicModal) {

	console.log("Stateparams: ",$stateParams)
	$scope.contract = {};
	if($stateParams.contact!=null){
	
		$scope.contract.counterparty = $stateParams.contact.email;
	}
	$scope.selectCounterparty = function () {

		$state.go('menu.phonebook',{  flag: true } )

    };
	

}])
 