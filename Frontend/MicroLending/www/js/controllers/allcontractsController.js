mycontrollerModule.controller('allContractsCtrl', ['$scope', '$stateParams','$state','allContractFactory','$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state,allContractFactory,$rootScope) {

	$scope.pendingcontracts = [];
	$scope.activecontracts = [];
	$scope.completedcontracts = [];
	console.log("rootScope: ",$rootScope.globals);
	loadDealsfromDB();

	$scope.moreDetails = function(contract){


		console.log("Moredetails: ",contract);
		$state.go('moredetails',{  contract: contract } )


	}
	$scope.settleContract = function(contract){


		console.log("settleContract: ",contract);


	}
	$scope.acceptSettlement = function(contract){

		console.log("acceptSettlement: ",contract);

    //1. prepare the data for sigining with nonce.
    //payload should include s,r,v,nonce



	}
	$scope.rejectContract = function(contract){

		console.log("rejectContract: ",contract);

	}
	$scope.acceptContract = function(contract){

		console.log("acceptContract: ",contract);

	}

	function loadDealsfromDB(){

			allContractFactory.getallPendingContracts(function(response){

				console.log("Pending Contracts: ",response.data.docs);

				if(response.status=="1"){

					$scope.pendingcontracts = response.data.docs
					$scope.$apply();

				}

			});
			allContractFactory.getallActiveContracts(function(response){

				console.log("Active Contracts: ",response.data.docs);

				if(response.status=="1"){

					$scope.activecontracts = response.data.docs;
				    $scope.$apply();

				}

			});
			allContractFactory.getallCompletedContracts(function(response){

				console.log("Completed Contracts: ",response.data.docs);

				if(response.status=="1"){

					$scope.completedcontracts = response.data.docs
					$scope.$apply();
				}

			});



	}

}])
