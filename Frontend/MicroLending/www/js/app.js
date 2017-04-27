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




})

  .run(function ($ionicPlatform, $ionicPush) {


    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      $ionicPush.register().then(function (t) {
        return $ionicPush.saveToken(t);
      }).then(function (t) {
        console.log('Token saved:', t.token);
      });

      if (window.cordova) {
        ss = new cordova.plugins.SecureStorage(
          function () { console.log('Success') },
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

      }

      else {
        contact_db = new PouchDB('contacts');
        console.log(contact_db.adapter);

        deal_db = new PouchDB('deals');
        console.log(deal_db.adapter)


        // Clear DB
        // contact_db.destroy().then(function  (response)  {
        //     // success
        //   console.log(response)
        // }).catch(function  (err)  {
        //     console.log(err);
        // });

      }

    });
  })

  /*
    This directive is used to disable the "drag to open" functionality of the Side-Menu
    when you are dragging a Slider component.
  */
  .directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function ($ionicSideMenuDelegate, $rootScope) {
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
  }])

  /*
    This directive is used to open regular and dynamic href links inside of inappbrowser.
  */
  .directive('hrefInappbrowser', function () {
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
