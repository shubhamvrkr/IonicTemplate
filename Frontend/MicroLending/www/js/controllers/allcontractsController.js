mycontrollerModule.controller('allContractsCtrl', ['$scope', '$stateParams','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state) {
	
	$scope.pendingcontracts = [];
	var contract = {
	
		deal_id:"AQ89435",
		asset_name:"Bike",
		counter_party:"nits@gmail.com",
		creation_date:"1493265745",
		status:"pending",
		symkey:"AAAAAAAAQ==",
		nots_flag:"0",
		tx:["first"]

	}
	for(i=0;i<5;i++){
	
		$scope.pendingcontracts.push(contract)
	
	}
	


}])