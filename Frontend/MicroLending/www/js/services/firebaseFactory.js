angular.module('app.services')

 
  .factory('firebaseFactory', ['$http','$state','$cordovaPushV5', function ($http,$state,$cordovaPushV5) {


    var service = {};

    service.getFirebaseToken = function (callback) {

      if (window.cordova) {

        console.log("getFirebaseToken");
		var options = {
			android: {
			  senderID: "1078648460837"
			}
		};
		$cordovaPushV5.initialize(options).then(function() {

			$cordovaPushV5.onNotification();

			$cordovaPushV5.onError();
			
			$cordovaPushV5.register().then(function(registrationId) {
			
				console.log("Token: ",registrationId);
				callback({ status: '1', token: registrationId })
			
			});
			
		});
		

       /* $ionicPush.register().then(function (t) {

          console.log('Token saved1:', t.token);
          return $ionicPush.saveToken(t);

        }).then(function (t) {

          console.log('Token saved:', t.token);
          alert(t.token)
          callback({ status: '1', token: t.token })


        });*/
      }

      else {

        messaging.requestPermission()
          .then(function () {
            console.log('Notification permission granted.');
            messaging.getToken()
              .then(function (currentToken) {
                if (currentToken) {
                  console.log(currentToken)
                  callback({ status: '1', token: currentToken });

                } else {
                  // Show permission request.
                  console.log('No Instance ID token available. Request permission to generate one.');
                  // Show permission UI.
                  //updateUIForPushPermissionRequired(callback)
                  callback({ status: '0' })

                }
              }).catch(function (err) {
                console.log('An error occurred while retrieving token. ', err);
                callback({ status: '0' })

              });
          })
          .catch(function (err) {
            console.log('Unable to get permission to notify.', err);
            callback({ status: '0' })
          });


      }

    }

/*service.recieveNotification = function() {

 /*  $scope.$on('cloud:push:notification', function(event, data) {
      console.log("Inside notification listener");
      var msg = data.message;

      notificationData = JSON.parse(msg.text);
      console.log("notificationData ",notificationData)
   
      var msg1 = data.message;
      $state.go('menu.allContracts');
      if (msg1.app.asleep || msg1.app.closed) {
        // the app was asleep or was closed, so do the redirect
        $state.go('menu.allContracts');
      }
    });*/
  

    function updateUIForPushPermissionRequired() {
      showHideDiv(tokenDivId, false);
      showHideDiv(permissionDivId, true);
    }


    function showHideDiv(divId, show) {
      const div = document.querySelector('#' + divId);
      if (show) {
        div.style = "display: visible";
      } else {
        div.style = "display: none";
      }
    }


    return service


  }]);
