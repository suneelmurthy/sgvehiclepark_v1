// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.factory('Authorization', function(){
  authorization = {};
  authorization.Cust_Nric = '';
  authorization.Cust_Handphone = '';
  authorization.Cust_Amount = '';
  authorization.Cust_FirstName = '';
  authorization.Cust_LastName = '';
  authorization.Cust_Email = '';
  authorization.Cust_Vehicle = '';

  return {
        getAuthObject: function () {
            return authorization;
        },
        setAuthObject: function (authObject) {
            authorization = authObject;
        }
    };
})

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  //Initialize Google app engine client.
  var ROOT = 'https://sgvehiclepark.appspot.com/_ah/api';
  gapi.client.load('parkingusersapi', 'v1', function() {
    }, ROOT);
  
  gapi.client.load('parkingcouponsapi', 'v1', function() {
  }, ROOT);

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('entry', {
    url: '/entry',
    templateUrl: 'templates/login.html',
    controller: 'AppCtrl'
  })

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'UpdateVehicleCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.accountdetails', {
      url: '/accountdetails',
      views: {
        'menuContent': {
          templateUrl: 'templates/accountdetails.html',
          controller: 'AccountdetailsCtrl'
        }
      }
    })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'AccountdetailsCtrl'
        }
      }
    })
  
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.parkingcoupon', {
      url: '/parkingcoupon',
      views: {
        'menuContent': {
          templateUrl: 'templates/parkingcoupon.html',
          controller: 'ParkingCouponCtrl'
        }
      }
    })
  
    .state('app.parkingstatus', {
      url: '/parkingstatus',
      views: {
        'menuContent': {
          templateUrl: 'templates/parkingstatus.html',
          controller: 'ParkingCouponCtrl'
        }
      }
    })

    .state('app.updatevehicle', {
      url: '/updatevehicle',
      views: {
        'menuContent': {
          templateUrl: 'templates/updatevehicle.html',
          controller: 'UpdateVehicleCtrl'
        }
      }
    })
    
    .state('app.updateuser', {
      url: '/updateuser',
      views: {
        'menuContent': {
          templateUrl: 'templates/updateuser.html',
          controller: 'UpdateVehicleCtrl'
        }
      }
    })
    .state('app.transaction', {
      url: '/transaction',
      views: {
        'menuContent': {
          templateUrl: 'templates/transaction.html',
          controller: 'TransactionCtrl'
        }
      }
    })
    
  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/entry');
});

