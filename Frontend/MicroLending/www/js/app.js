mycontrollerModule = angular.module('app.controllers', ['ionic', 'ionic-toast', 'ngCordova', 'ngLetterAvatar', 'ionic.cloud']);
var myApp = angular.module('app', ['ionic', 'ngLetterAvatar', 'ionic-toast', 'app.controllers', 'app.routes', 'app.directives', 'app.services', 'ionic.cloud']);

myApp.config(function ($ionicConfigProvider, $sceDelegateProvider, $ionicCloudProvider) {

  $ionicConfigProvider.tabs.position('top');
  $sceDelegateProvider.resourceUrlWhitelist(['self', '*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

  $ionicCloudProvider.init({
    "core": {
      "app_id": "05b27b18"
    },
    "push": {
      "sender_id": "1078648460837",
      "pluginConfig": {
        "ios": {
          "badge": true,
          "sound": true
        },
        "android": {
          "iconColor": "#343434"
        }
      }
    }
  });

}).run(function ($ionicPlatform, $ionicPush) {
	
	if(!window.cordova){
	
		 console.log("browser firebase")
		 
		 var config = {
		  apiKey: "AIzaSyDWqtn3mu1Em8D_zX5TY5gHqhxXR-OtBsw",
		  authDomain: "lending-16a7a.firebaseapp.com",
		  databaseURL: "https://lending-16a7a.firebaseio.com",
		  projectId: "lending-16a7a",
		  storageBucket: "lending-16a7a.appspot.com",
		  messagingSenderId: "1078648460837"
		};
		
		firebase.initializeApp(config);
		messaging = firebase.messaging();
		messaging.onMessage(function(payload) {

			console.log("Message received. ", payload);
			
		});
		if ('serviceWorker' in navigator){
		 
			console.log("SW present !!! ");

			navigator.serviceWorker.register('sw.js', {
			  //scope: '/toto/'
			}).then(function(registration){
				 
				registration.update();
				console.log("registered")
				messaging.useServiceWorker(registration);
				console.log('Service worker registered : ', registration.scope);
				
			})
			.catch(function(err){
			  console.log("Service worker registration failed : ", err);
			});

		}
	
		navigator.serviceWorker.addEventListener('message', function(event) {
		
		console.log('Received a message from service worker: ', event.data);
		
	  });
	}
	
	
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)


      if (window.cordova) {
	  
          ss = new cordova.plugins.SecureStorage(
          function () { console.log('Success') ;},
          function (error) { console.log('Error ' + error); },
          'my_app');
		  
      }


      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      if (window.cordova) {
        contact_db = new PouchDB('contacts.db', { adapter: 'cordova-sqlite', location: 'default' });
        console.log(contact_db);

        deal_db = new PouchDB('deals.db', { adapter: 'cordova-sqlite', location: 'default' });
        console.log(deal_db);

      }else {
	  
        contact_db = new PouchDB('contacts');
        console.log(contact_db.adapter);

        deal_db = new PouchDB('deals');
        console.log(deal_db.adapter);
        deal_db.createIndex({index: { fields: ['status'] }

		}).then(function (result) {
            console.log(result);
		}).catch(function (err) {

			console.log(err);

		});


        // Clear DB
        // contact_db.destroy().then(function  (response)  {
        //     // success
        //   console.log(response)
        // }).catch(function  (err)  {
        //     console.log(err);
        // });

      }

    });
	
	
  }).directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function ($ionicSideMenuDelegate, $rootScope) {
    return {
      restrict: "A",
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

        function stopDrag() {
          $ionicSideMenuDelegate.canDragContent(false);
        }

        function allowDrag() {
          $ionicSideMenuDelegate.canDragContent(true);
        }

        $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
        $element.on('touchstart', stopDrag);
        $element.on('touchend', allowDrag);
        $element.on('mousedown', stopDrag);
        $element.on('mouseup', allowDrag);

      }]
    };
	
  }]).directive('hrefInappbrowser', function () {
    return {
      restrict: 'A',
      replace: false,
      transclude: false,
      link: function (scope, element, attrs) {
        var href = attrs['hrefInappbrowser'];

        attrs.$observe('hrefInappbrowser', function (val) {
          href = val;
        });

        element.bind('click', function (event) {

          window.open(href, '_system', 'location=yes');

          event.preventDefault();
          event.stopPropagation();

        });
      }
    };
 
});
