angular.module('app.services')
  .factory('allContractFactory', ['$http', 'databaseFactory', function($http, databaseFactory) {

    var service = {};
	
    //load addr,ks,pwdervedkey from ss or localstorage

    service.getallPendingContracts = function(callback) {

		
		 databaseFactory.getDoc(deal_db,{status: "pending"},callback);
		

    };
	
	service.getallActiveContracts = function(callback) {

		
		 databaseFactory.getDoc(deal_db,{status:"active"},callback)
		

    };
	service.getallCompletedContracts = function(callback) {

		
		 databaseFactory.getDoc(deal_db,{status:"completed"},callback)
	

    };


    return service;


  }]);
