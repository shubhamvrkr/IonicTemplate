mycontrollerModule.controller('phoneBookCtrl', ['$scope', '$stateParams','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state) {

	$scope.data = {};
	//$scope.localcontacts = [{ email:"shubhamvrkr@gmail.com",ethadress:"0x123f681646d4a755815f9cb19e1acc8565a0c2ac"},{ email:"bhubhamvrkr@gmail.com",ethadress:"0x123f681646d4a755815f9cb19e1acc8565a0c2ac"},{ email:"shubhamvrkr@gmail.com",ethadress:"0x123f681646d4a755815f9cb19e1acc8565a0c2ac"}]
	
	$scope.localcontacts = [];
	$scope.availablecontacts = [];
	
	$scope.Clear = function(){
		
		console.log($scope.data)
		$scope.data.searchText = "";
		
	};

	$scope.searchTextChanged = function(searchText){

		console.log(searchText)
	}
	$scope.deleteContact = function(index){
	
		console.log(index)
	}
	$scope.addContact = function(contact){
	
		console.log(contact)
		
	}
	
	
}])