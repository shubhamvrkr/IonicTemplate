mycontrollerModule = angular.module('app.controllers', ['ngCordova', 'ionic', 'ionic-toast', 'ngLetterAvatar', 'angular-clipboard']);
var myApp = angular.module('app', ['ngCordova', 'ionic', 'ngLetterAvatar', 'ionic-toast', 'app.controllers', 'app.routes', 'app.directives', 'app.services', 'angular-clipboard']);


myApp.config(function ($ionicConfigProvider, $sceDelegateProvider) {

	$ionicConfigProvider.tabs.position('top');
	$sceDelegateProvider.resourceUrlWhitelist(['self', '*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

});

myApp.run(function ($ionicPlatform, databaseFactory, firebaseFactory, $http, getCurrentUserData, $timeout, $state, $cordovaPushV5, $rootScope, expiredContractsFactory, $cordovaLocalNotification) {



	$rootScope.$on('$cordovaPushV5:notificationReceived', function (event, data) {

		console.log("Message: ", data);
		var response = data.additionalData.additionalData.info;
		var data = {

			body: response
		}
		console.log("Data sent to function: ", data);
		storeDatainDatabase(data);

	});

	$rootScope.$on('$cordovaPushV5:errorOcurred', function (event, e) {

		console.log("Error: ", e);

	});

	$rootScope.$on('$cordovaLocalNotification:click', function (event, notification, state) {

		console.log("notification clicked!!!");
		console.log("notification: ", notification);
		$state.go("menu.allContracts");

    });

	$rootScope.alarmSuccessCallback = function (data) {

		console.log("Success callback: ", data)
		data = JSON.parse(data);
		if (data.status == 2) {
			//sets a notification
			console.log("Show notification");
			expiredContractsFactory.getAllUnsettledExpiredContracts(function (result) {
				console.log(result)
				if (result.length != 0) {

					$cordovaLocalNotification.schedule({
						id: 1,
						title: 'Ethereum Resource Lending',
						text: 'You have some Unsettled contracts!! Click to view'
					}).then(function (result) {


					});
				}
			});
		}

	}

	$rootScope.alarmErrorCallback = function (err) {

		console.log("Error callback: ", err);
	}

    $ionicPlatform.ready(function () {


		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova) {

			var options = {
				android: {
					senderID: "1078648460837"
				}
			};
			$cordovaPushV5.initialize(options).then(function () {

				$cordovaPushV5.onNotification();

				$cordovaPushV5.onError();

			});


		}

		if (window.cordova) {

			ss = new cordova.plugins.SecureStorage(
				function () { console.log('Success'); },
				function (error) { console.log('Error ' + error); },
				'my_app');

			contact_db = new PouchDB('contacts.db', { adapter: 'cordova-sqlite', location: 'default' });
			console.log(contact_db);

			deal_db = new PouchDB('deals.db', { adapter: 'cordova-sqlite', location: 'default' });
			console.log(deal_db);

		} else {

			contact_db = new PouchDB('contacts');
			console.log(contact_db.adapter);

			deal_db = new PouchDB('deals');
			console.log(deal_db.adapter);
			deal_db.createIndex({
				index: { fields: ['status'] }

			}).then(function (result) {
				console.log(result);
			}).catch(function (err) {

				console.log(err);

			});


			notifyMe();

		}

		console.log("Notification Handler Messages");
		getCurrentUserData.getData(function (response) {

			userKeyStore = response.data;
			console.log("Key Store: ", userKeyStore)
			if (window.cordova) {
				navigator.splashscreen.hide();
			}
				if (userKeyStore != null) {


					$timeout(function () {
						$state.go("menu.allContracts")
					})
				}
			
		});

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
		if (!window.cordova) {

			if ('serviceWorker' in navigator) {

				console.log("SW present !!! ");
				navigator.serviceWorker.register('sw.js', {}).then(function (registration) {

					registration.update();
					console.log("registered");
					messaging.useServiceWorker(registration);
					console.log('Service worker registered : ', registration.scope);

				}).catch(function (err) {

					console.log("Service worker registration failed : ", err);
				});

			}

			messaging.onMessage(function (payload) {

				var info = JSON.parse(payload.data.additionalData).info;
				var data = {

					body: info
				}
				console.log("On Message: ", data)


				//console.log(payload.data)
				if (payload.data.body != null) {
					storeDatainDatabase(data)
				}
			});

			navigator.serviceWorker.addEventListener('message', function (event) {

				var info = JSON.parse(event.data.additionalData).info

				var data = {

					body: info
				}
				console.log("Event Listener: ", data)
				if (event.data.body != null) {
					storeDatainDatabase(data)
				}
			});

		}

		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}



    });


	function notifyMe() {


		if (!("Notification" in window)) {
			alert("This browser does not support desktop notification");
		}

		// Let's check whether notification permissions have already been granted
		else if (Notification.permission === "granted") {
			// If it's okay let's create a notification
			//call getAllUnsettledExpiredContracts
			expiredContractsFactory.getAllUnsettledExpiredContracts(function (result) {
				console.log(result)
				if (result.length != 0) {
					var title = 'Micro-Lending Reminder';
					var options = {
						body: 'You have some Unsettled contracts!',
						tag: 'reminder',

						lang: 'en-US',
						dir: 'ltr'
					};
					var notification = new Notification(title, options);
					notification.onclick = function (event) {
						//event.preventDefault();
						console.log("clicked")
						window.open('localhost:8100/#/tabs/allcontracts', '_self');
					}
				}
			});



		}

		// Otherwise, we need to ask the user for permission
		else if (Notification.permission !== "denied") {
			Notification.requestPermission(function (permission) {
				// If the user accepts, let's create a notification
				if (permission === "granted") {
					var notification = new Notification("Hi there!");
				}
			});
		}

		// At last, if the user has denied notifications, and you 
		// want to be respectful there is no need to bother them any more.
	}
	function storeDatainDatabase(data) {

		console.log('Message ', data);
		var NotiData = JSON.parse(data.body);
		var invoker = NotiData.invoker;
		console.log(invoker)

		try {


			databaseFactory.getDocById(contact_db, invoker, function (response) {

				//console.log("Database: ",response);

				if (response.status == "0") {

					console.log("Contact not found in database");
					$http.get(apiUrl + "/api/users/?email=" + invoker).then(function (response) {


						console.log("Get Call: ", response.data[0]);
						var publicKeyInvoker = response.data[0].publicKey;
						checkUserKeyStore(NotiData, publicKeyInvoker, invoker);

						contactEntry = {
							"_id": response.data[0].email,
							"eth_address": response.data[0].ethAccount,
							"name": response.data[0].name,
							"publicKey": response.data[0].publicKey
						}
						databaseFactory.putData(contact_db, contactEntry, function (response) {

							if (response.status == "0") {

								console.log("Error inserting into database")

							} else {
								console.log("Contract saved successfully")
							}
						});

					});
				} else {

					var publicKeyInvoker = response.data.publicKey;
					console.log("publicKeyInvoker: ", publicKeyInvoker);
					checkUserKeyStore(NotiData, publicKeyInvoker, invoker);

				}

			});


		} catch (err) {

			console.log("Error : ", err)
		}
	}

	function checkUserKeyStore(NotiData, publicKey, invoker) {

		getCurrentUserData.getData(function (response) {


			userKeyStore = response.data;
			console.log("Key Store: ", userKeyStore)

			databaseFactory.getDocById(deal_db, NotiData.dealId, function (response) {

				if (response.status == "0") {

					console.log("Check Doc: ", "deal ID not found")
					ProcessNotificationData(NotiData, publicKey, invoker);

				} else {

					var arr = response.data.tx;
					var tX = arr[arr.length - 1];
					console.log("Tx: ", tX)
					if (tX.eventName == "createContract" && NotiData.status != "createContractEvent") {

						ProcessNotificationData(NotiData, publicKey, invoker);
					} else if (tX.eventName == "acceptContract" && NotiData.status != "acceptContractEvent") {

						ProcessNotificationData(NotiData, publicKey, invoker);

					} else if (tX.eventName == "rejectContract" && NotiData.status != "rejectContractEvent") {

						ProcessNotificationData(NotiData, publicKey, invoker);

					} else if (tX.eventName == "initiateSettlement" && NotiData.status != "settleContractEvent") {

						ProcessNotificationData(NotiData, publicKey, invoker);

					} else if (tX.eventName == "acceptSettlement" && NotiData.status != "acceptSettleContractEvent") {

						ProcessNotificationData(NotiData, publicKey, invoker);
					} else {

						console.log("Duplicate entry");
					}



				}
			})



		});
	}



	function ProcessNotificationData(NotiData, publicKey, invoker) {

		console.log("NotiData: ", NotiData);
		console.log("publicKey", publicKey);

		var sign_s = NotiData.sig_s;
		var sign_r = NotiData.sig_r;
		var sign_v = NotiData.sig_v;
		var deal_id = NotiData.dealId;
		var sig_nonce = NotiData.nonce;

		console.log(userKeyStore)

		try {


			if (NotiData.contract_data != null && NotiData.key_symmteric != null) {


				var contract_data = NotiData.contract_data;
				var symmetric_key = NotiData.key_symmteric;
				console.log(symmetric_key)
				EthWallet.encryption_sign.asymDecrypt(symmetric_key, userKeyStore.ks_local, userKeyStore.pwDerivedKey, publicKey, userKeyStore.current_user_key, function (err, decryptedKey) {

					if (err) {

						console.log("Error decrypting symmetric key: ", err);

					} else {

						console.log("decryptedKey: ", decryptedKey);

						EthWallet.encryption_sign.symDecrypt(contract_data, decryptedKey, function (err, decryptedContractData) {

							if (err) {

								console.log("Error decrypting data: ", err);

							} else {

								console.log("Decrypted Contract Data: ", decryptedContractData);

								var dec_contract_data = JSON.parse(decryptedContractData);

								var temp_contract_data = {};

								temp_contract_data.deal_id = dec_contract_data.deal_id.toString();
								temp_contract_data.from_ethAddress = dec_contract_data.from_ethAddress;
								temp_contract_data.to_ethAddress = dec_contract_data.to_ethAddress;
								temp_contract_data.from_email = dec_contract_data.from_email;
								temp_contract_data.to_email = dec_contract_data.to_email;
								temp_contract_data.start_date = dec_contract_data.start_date;
								temp_contract_data.end_date = dec_contract_data.end_date;
								temp_contract_data.asset_id = dec_contract_data.asset_id;
								temp_contract_data.asset_name = dec_contract_data.asset_name;
								temp_contract_data.description = dec_contract_data.description;
								temp_contract_data.nonce = sig_nonce;

								console.log(temp_contract_data)

								var s_hex = buffer.from(sign_s.toString('hex'), 'hex');
								console.log(s_hex)
								var r_hex = buffer.from(sign_r.toString('hex'), 'hex');
								console.log(r_hex)
								var v_hex = parseInt(sign_v);
								console.log(v_hex)


								EthWallet.encryption_sign.verifyMsg(NotiData.from, JSON.stringify(temp_contract_data), v_hex, r_hex, s_hex, function (err, verifiedResult) {

									if (err) {

										console.log("Error in verifying signature: ", err);

									} else {

										console.log("Verification Status: ", verifiedResult);
										if (verifiedResult) {

											//enter into database
											var doc = {};

											doc._id = dec_contract_data.deal_id;
											doc.asset_name = dec_contract_data.asset_name;
											doc.counter_party_address = dec_contract_data.to_ethAddress;
											doc.counter_party_email = dec_contract_data.to_email;
											doc.creation_date = sig_nonce;
											doc.start_date = dec_contract_data.start_date;
											doc.end_date = dec_contract_data.end_date;
											doc.from_address = dec_contract_data.from_ethAddress;
											doc.from_email = dec_contract_data.from_email;
											doc.description = dec_contract_data.description;
											doc.asset_id = dec_contract_data.asset_id;
											doc.symmteric_key = decryptedKey;
											doc.status = "pending";
											doc.notification_flag = "true";
											doc.actionstatus = false;

											doc.tx = [{ caller: invoker, txHash: NotiData.transactionHash, eventName: "createContract" }];

											console.log(doc)
											databaseFactory.putData(deal_db, doc, function (res) {

												if (res.status == "1") {

													console.log("Deal : " + doc + " entered successfully");

												} else {

													console.log("Error entering deal in database: ");
												}

											});

										} else {

											console.log("Signature Verification Failed");

										}

									}

								});

							}
						});

					}

				});

			} else {

				//get event name;

				var eventName = NotiData.status;
				console.log("eventName: ", eventName)

				databaseFactory.getDocById(deal_db, deal_id, function (response) {

					if (response.status == "0") {

						console.log("Deail with id : " + deal_id + " not found in db");

					} else {

						var temp_contract_data = {};

						temp_contract_data.deal_id = response.data._id;
						temp_contract_data.from_ethAddress = response.data.from_address;
						temp_contract_data.to_ethAddress = response.data.counter_party_address;
						temp_contract_data.from_email = response.data.from_email;
						temp_contract_data.to_email = response.data.counter_party_email;
						temp_contract_data.start_date = response.data.start_date;
						temp_contract_data.end_date = response.data.end_date;
						temp_contract_data.asset_id = response.data.asset_id;
						temp_contract_data.asset_name = response.data.asset_name;
						temp_contract_data.description = response.data.description;
						temp_contract_data.nonce = sig_nonce;

						console.log(temp_contract_data)

						var s_hex = buffer.from(sign_s.toString('hex'), 'hex');
						console.log(s_hex)
						var r_hex = buffer.from(sign_r.toString('hex'), 'hex');
						console.log(r_hex)
						var v_hex = parseInt(sign_v);
						console.log(v_hex)

						EthWallet.encryption_sign.verifyMsg(NotiData.from, JSON.stringify(temp_contract_data), v_hex, r_hex, s_hex, function (err, verifiedResult) {

							if (err) {

								console.log("Error in verifying signature: ", err);

							} else {

								console.log("Verification Status: ", verifiedResult);
								if (verifiedResult) {


									var doc1 = response.data;
									var arr = response.data.tx;
									//arr.push({caller:invoker,txHash:NotiData.transactionHash});

									if (eventName == "acceptContractEvent") {

										doc1.status = "active";
										arr.push({ caller: invoker, txHash: NotiData.transactionHash, eventName: "acceptContract" });


									} else if (eventName == "settleContractEvent") {

										doc1.status = "pending";
										arr.push({ caller: invoker, txHash: NotiData.transactionHash, eventName: "initiateSettlement" });

									} else if (eventName == "acceptSettleContractEvent") {

										doc1.status = "completed";
										arr.push({ caller: invoker, txHash: NotiData.transactionHash, eventName: "acceptSettlement" });
									} else if (eventName == "rejectContractEvent") {
										doc1.status = "rejected";
										arr.push({ caller: invoker, txHash: NotiData.transactionHash, eventName: "rejectContract" });
									}
									doc1.notification_flag = "true";
									doc1.tx = arr;
									console.log("Doc: ", response.data)

									databaseFactory.putData(deal_db, doc1, function (res) {

										if (res.status == "0") {
											console.log("Error storing doc")
										} else {
											console.log("Deal update")
										}

									});


								} else {

									console.log("Signature Verification Failed");
								}
							}



						});

					}



				});



			}

		} catch (err) {

			console.log("Exception: ", err)

		}
	}




});

myApp.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function ($ionicSideMenuDelegate, $rootScope) {
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

}]);

myApp.directive('hrefInappbrowser', function () {
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
