angular.module('app.services')
  .factory('allContractFactory', ['$http', 'databaseFactory', function($http, databaseFactory) {

    var service = {};
    //load addr,ks,pwdervedkey from ss or localstorage

    service.getallPendingContracts = function(callback) {

		
		 databaseFactory.getDoc(deal_db,"pending",callback))
		

    };
	
	service.getallActiveContracts = function(callback) {

		
		 databaseFactory.getDoc(deal_db,"active",callback))
		

    };
	service.getallCompletedContracts = function(callback) {

		
		 databaseFactory.getDoc(deal_db,"completed",callback))
		

    };


    return service;


  }]);
