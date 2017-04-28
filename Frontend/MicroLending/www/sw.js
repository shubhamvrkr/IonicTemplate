importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '1078648460837'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {

  
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
 
  console.log(payload.data.body)
  // Customize notification here
  notificationTitle = 'Resource Lending Notification!!';
  notificationOptions = {
    body: payload.data.body
  };

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
  
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      windowClient.postMessage(data);
    }
  })
  .then(() => {
  
    return self.registration.showNotification(notificationTitle, notificationOptions);
	
  });
  
  return promiseChain;
 
});
// [END background_handler]
