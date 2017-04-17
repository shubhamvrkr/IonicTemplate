angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
	.state('login', {
		url: '/login',
		templateUrl: 'templates/login.html',
		controller: 'loginCtrl'
	})
	.state('register', {
		url: '/register',
		templateUrl: 'templates/register.html',
		controller: 'registerCtrl'
	})
	.state('emailVerification', {
		url: '/emailVerify',
		templateUrl: 'templates/emailVerification.html',
		controller: 'emailVerificationCtrl'
	})
	.state('menu', {
		url: '/tabs',
		templateUrl: 'templates/menu.html',
		controller: 'menuCtrl'
	})
    .state('menu.allContracts', {
		url: '/allcontracts',
		views: {
			'allcontracts': {
				templateUrl: 'templates/allContracts.html',
				controller: 'allContractsCtrl'
			}
		}
	})
	.state('menu.phonebook', {
		url: '/phonebook',
		views: {
			'phonebook': {
				templateUrl: 'templates/phoneBook.html',
				controller: 'phoneBookCtrl'
			}
		}
	})
	.state('menu.createdeal', {
		url: '/createdeal',
		views: {
			'createdeal': {
				templateUrl: 'templates/createDeal.html',
				controller: 'createDealCtrl'
			}
		}
	})
	
	$urlRouterProvider.otherwise('/login')

});