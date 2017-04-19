mycontrollerModule.controller('phoneBookCtrl', ['$scope', '$stateParams','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state) {

	$scope.data = {};
	//data from database

	$scope.cachedata =[]
	$scope.localcontacts = [{ email:"nits7@gmail.com",ethadress:"0x123f681646d4a755815f9cb19e1acc8565a0c2ac"},{ email:"amolpednekar@gmail.com",ethadress:"0x123f681646d4a755815f9cb19e1acc8565a0c2ac"},{ email:"shubhamvrkr@gmail.com",ethadress:"0x123f681646d4a755815f9cb19e1acc8565a0c2ac"}]
	$scope.filteredlocalcontacts = $scope.localcontacts.length;
	//$scope.localcontacts = $scope.cachedata;
	$scope.availablecontacts = [];
	
	$scope.Clear = function(){
		
		console.log($scope.data)
		$scope.data.searchText = "";
		
	};

	$scope.searchTextChanged = function(searchText){

		console.log(searchText)
		if(searchText.length == 1){
		
			//postcall to get all the items with starting characters
			//bind to scope.availablecontacts
		
		
		}
		
				
	}
	$scope.deleteContact = function(index){
	
		console.log(index)
		
		
		
	}
	$scope.addContact = function(contact){
	
		console.log(contact)
		
	}
	
	
}])