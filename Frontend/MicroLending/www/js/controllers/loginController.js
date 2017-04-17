mycontrollerModule.controller('loginCtrl', ['$scope', '$stateParams','$state','$ionicLoading','$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state,$ionicLoading,$timeout) {


	$scope.Login = function(data){
	
		
		 console.log("Login");
		 $ionicLoading.show({
				templateUrl: 'templates/loading.html',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
		});
		
		$timeout(function () {
			
			$ionicLoading.hide();
			$state.go('menu.allContracts');
    
		}, 2000);

		
	}
	

}]);