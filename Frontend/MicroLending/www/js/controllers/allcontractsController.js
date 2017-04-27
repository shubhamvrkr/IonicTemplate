mycontrollerModule.controller('allContractsCtrl', ['$scope', '$stateParams','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state) {
	
	$scope.pendingcontracts = [];
	$scope.activecontracts = [];
	$scope.completedcontracts = [];
	
	for(i=0;i<3;i++){
		
		var pcontract = {};
	
		
		if(i==1){
			
				pcontract.deal_id="AQ89435"
				pcontract.asset_name="Bike"
				pcontract.counter_party="nits@gmail.com"
				pcontract.creation_date="1493265745"
				pcontract.status="pending"
				pcontract.symkey="AAAAAAAAQ=="
				pcontract.nots_flag=false
				pcontract.txs=["one","two","three"]
				
				$scope.pendingcontracts.push(pcontract)
		}else{
		
			pcontract.deal_id="AQ89435"
				pcontract.asset_name="Bike"
				pcontract.counter_party="nits@gmail.com"
				pcontract.creation_date="1493265745"
				pcontract.status="pending"
				pcontract.symkey="AAAAAAAAQ=="
				pcontract.nots_flag=false
				pcontract.txs=["one"]
				$scope.pendingcontracts.push(pcontract)
		}
		
		console.log($scope.pendingcontracts)
	}
	
	var acontract = {
	
		deal_id:"AQ89435",
		asset_name:"Bike",
		counter_party:"nits@gmail.com",
		creation_date:"1493265745",
		status:"pending",
		symkey:"AAAAAAAAQ==",
		nots_flag:false,
		txs:["first","second"]

	}
	for(i=0;i<3;i++){
		
		$scope.activecontracts.push(acontract)
	
	}
	
	var ccontract = {
	
		deal_id:"AQ89435",
		asset_name:"Bike",
		counter_party:"nits@gmail.com",
		creation_date:"1493265745",
		status:"pending",
		symkey:"AAAAAAAAQ==",
		nots_flag:false,
		txs:["first","second","third","fourth"]

	}
	for(i=0;i<2;i++){
		
		$scope.completedcontracts.push(pcontract)
	
	}
	
	$scope.moreDetails = function(contract){
	
	
		console.log("Moredetails: ",contract);
		
		$state.go('moredetails',{  contract: contract } )
	
	
	}
	$scope.settleContract = function(contract){
	
	
		console.log("settleContract: ",contract);
	
	
	}
	$scope.acceptSettlement = function(contract){
	
		console.log("acceptSettlement: ",contract);
	
	}
	$scope.rejectContract = function(contract){
	
		console.log("rejectContract: ",contract);
	
	}
	$scope.acceptContract = function(contract){
	
		console.log("acceptContract: ",contract);
	
	}

}])