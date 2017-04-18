mycontrollerModule.controller('loginCtrl', ['$scope', '$stateParams','$state','$ionicLoading','$timeout','fileFactory','loginFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state,$ionicLoading,$timeout,fileFactory,loginFactory) {


	$scope.Login = function(data){
	
		console.log("Login");
		var user_name = data.username
        var password = data.password
        var login_data = {}
        
        login_data.username = data.username
        login_data.password = data.password
        
        if (window.cordova)
        {
            
            ss.get(
                     function (value) { console.log('Success, got ' + value); login_data = JSON.parse(value) },
                      function (error) { console.log('Error ' + error); },
                      'user_data');
                                      
        
        }else{
		
            console.log(JSON.parse(localStorage.getItem('user_data')))
            login_data = JSON.parse(localStorage.getItem('user_data'))
            
        }
 
        loginFactory.login(login_data,function(err,result){
            if (err) {
                
                console.log(err)
            
                console.log($scope.error)
                return
            }
            
            else{
                    console.log("Login",result)
                    $state.go('menu.allContracts');
                
            }
        
        
        })
		
		/* $ionicLoading.show({
				templateUrl: 'templates/loading.html',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
		});
		
		$timeout(function () {
			
			$ionicLoading.hide();
			$state.go('menu.allContracts');
    
		}, 2000);*/

		
	}
	

}]);