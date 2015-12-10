angular.module('starter.controllers', [])



.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, Authorization, $ionicPopup, $ionicLoading) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Open Loading Screen
  $scope.openappctrlloading = function() {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
  };

  // Close Loading Screen
  $scope.closeappctrlloading = function() {
    $ionicLoading.hide();
  };

  // Alert screen
  $scope.appctrlalert = function(msgObject) {
    $ionicPopup.alert({
      title: msgObject.title,
      template: msgObject.msg,
      // buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
      //   text: 'Cancel',
      //   type: 'button-assertive',
      //   onTap: function(e) {
      //     // e.preventDefault() will stop the popup from closing when tapped.
      //     // e.preventDefault();
      //   }
      // }, 
      // {
      //   text: 'OK',
      //   type: 'button-balanced',
      //   onTap: function(e) {
      //     // Returning a value will cause the promise to resolve with the given value.
      //     // return scope.data.response;
      //   }      
      // }]
    });
  };

  // Perform the login action when the user submits the login form
  //$scope.doLogin = function() {

  //$state.go('app.transaction');
  //};
  $scope.doLogin = function() {

    // Local variables
    msgObject = {};

    // Loading Screen
    $scope.openappctrlloading();

    // Calling backend GoogleAPI
    gapi.client.parkingusersapi.sgvpUserAuthentication({'Cust_Nric': $scope.loginData.username,
                                                        'Cust_Password': $scope.loginData.password}).execute(function(resp) {          
      if(resp.ResponseMsg == "Login Successful"){
        // Capture user data
        authorization.Cust_Nric = $scope.loginData.username;

        // Read user data
        gapi.client.parkingusersapi.sgvpGetUserInfo({'Cust_Nric': authorization.Cust_Nric}).execute(function(resp) {          
          if(resp.ResponseMsg == "Data Found"){
            authorization.Cust_Handphone = resp.Cust_Handphone;
            authorization.Cust_Amount = resp.Cust_Amount;
            authorization.Cust_FirstName = resp.Cust_FirstName;
            authorization.Cust_LastName = resp.Cust_LastName;
            authorization.Cust_Email = resp.Cust_Email;
            authorization.Cust_Vehicle = resp.Cust_Vehicle;
          }
          else{

          }

          // State Transition
          $state.go('app.parkingcoupon');
        });
      }
      else{
        msgObject.msg = resp.ResponseMsg;
        msgObject.title = '';
        $scope.appctrlalert(msgObject);
      }

      // Close Loading Screen
      $scope.closeappctrlloading();    

      // Clear Variables       
      $scope.loginData.username = '';      
      $scope.loginData.password = '';                                       
    }); 
  };

  // Perform the registration action when the user submits the Registration form
  $scope.doRegister = function() {

    // Local variables
    msgObject = {};
    msgObject.msg = '';
    msgObject.title = '';

    // Loading Screen
    $scope.openappctrlloading();

    // Calling backend GoogleAPI
    gapi.client.parkingusersapi.sgvpNewUserRegister({'Cust_Nric': $scope.loginData.username,
                                                    'Cust_Password': $scope.loginData.password,
                                                    'Cust_Handphone': $scope.loginData.handphone}).execute(function(resp) {
      
      if(resp.ResponseMsg == "Registration Successful"){
        msgObject.msg = resp.ResponseMsg;
        // Nric Capture
        authorization.Cust_Nric = $scope.loginData.username;
        
        // Next page
        $state.go('app.accountdetails');
      }
      else{
        if(resp.code == "503"){
          msgObject.msg = "Please enter valid Data";  
        }
        else{
          msgObject.msg = resp.ResponseMsg;
        }
      }

      // Alert Window
      $scope.appctrlalert(msgObject);

      // Close Loading Screen
      $scope.closeappctrlloading();

      // Clear Variables       
      $scope.loginData = '';                                       
   }); 
  };
})


.controller('AccountdetailsCtrl', function($scope, $stateParams, $state, Authorization, $ionicPopup, $ionicLoading) {
  // Form data for the login modal
  $scope.accountData = {};

  // Open Loading Screen
  $scope.openaccctrlloading = function() {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
  };

  // Close Loading Screen
  $scope.closeaccctrlloading = function() {
    $ionicLoading.hide();
  };

  // Alert screen
  $scope.accctrlalert = function(msgObject) {
    $ionicPopup.alert({
      title: msgObject.title,
      template: msgObject.msg
    });
  };

  // Perform the update action when user submits the application.
  $scope.doUpdate = function() {

    // Local variables
    msgObject = {};
    msgObject.title = '';
    msgObject.msg = '';

    // Loading Screen
    $scope.openaccctrlloading();

    // Calling backend GoogleAPI
    gapi.client.parkingusersapi.sgvpUpdateUserInfo({'Cust_Nric': authorization.Cust_Nric,
                                                    'Cust_FirstName': $scope.accountData.firstname,
                                                    'Cust_LastName': $scope.accountData.lastname,
                                                    'Cust_Email': $scope.accountData.email}).execute(function(resp) {
      msgObject.msg = "Update User: " + resp.ResponseMsg + "\n";      
      if(resp.ResponseMsg == "User Information Update Successful"){
        // alert(resp.ResponseMsg);        
      }
      else{

      }

      // Calling backend GoogleAPI
      gapi.client.parkingusersapi.sgvpNewVehicleRegister({'Cust_Nric': authorization.Cust_Nric,
                                                          'Veh_Chassisnumber': "C123",
                                                          'Veh_Enginenumber': "E123",
                                                          'Veh_Regnumber': $scope.accountData.regnumber,
                                                          'Veh_Type': "Car"}).execute(function(resp) {
        msgObject.msg = msgObject.msg + "New Vehicle: " + resp.ResponseMsg + "\n";
        if(resp.ResponseMsg == "New Vehicle Added Successfully"){
          // alert(resp.ResponseMsg);        
        }
        else{

        }

        // Alert window.
        $scope.accctrlalert(msgObject);                                                    

        // Close Loading Screen
        $scope.closeaccctrlloading();

        // Calling Parking Coupon
        $state.go('app.parkingcoupon');

      });
    });
  };


  // Perform the skip action when user submits the application.
  $scope.doSkip = function() {
    // Calling Parking Coupon
    $state.go('app.parkingcoupon');
  };
  
})

.controller('UpdateVehicleCtrl', function($scope, $ionicModal, $state, Authorization, $ionicPopup, $ionicLoading, $timeout) {

  // Form data for the login modal
  $scope.vehicleupdateData = {};
  $scope.userupdateData = {};
  
  // Default values
  $scope.menuData = {};
  $scope.menuData.title = authorization.Cust_Nric;
  $scope.menuData.amount = authorization.Cust_Amount;
  
  // Open Loading Screen
  $scope.openupdvehctrlloading = function() {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
  };

  // Close Loading Screen
  $scope.closeupdvehctrlloading = function() {
    $ionicLoading.hide();
  };

  // Alert screen
  $scope.updvehctrlalert = function(msgObject) {
    $ionicPopup.alert({
      title: msgObject.title,
      template: msgObject.msg
    });
  };

  // Create the updatevehicle modal that we will use later
  $ionicModal.fromTemplateUrl('templates/updatevehicle.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalupdatevehicle = modal;
  });

  // Create the updateuser modal that we will use later
  $ionicModal.fromTemplateUrl('templates/updateuser.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalupdateuser = modal;
  });
    
    
  // Triggered in the updatevehicle modal to close it
  $scope.closeUpdatevehicle = function() {
    $scope.modalupdatevehicle.hide();
  };

  // Open the updatevehicle modal
  $scope.updatevehicle = function() {
    $scope.modalupdatevehicle.show();
  };
  
  
  // Triggered in the updatevuser modal to close it
  $scope.closeUpdateuser = function() {
    $scope.modalupdateuser.hide();
  };

  // Open the updatevuser modal
  $scope.updateuser = function() {
    $scope.modalupdateuser.show();
  };


  // Perform the Vehicle update action when the user submits the form
  $scope.doUpdatevehicle = function() {

    // Local variables
    msgObject = {};
    msgObject.title = '';
    msgObject.msg = '';

    // Loading Screen
    $scope.openupdvehctrlloading();

    // Calling backend google API
    gapi.client.parkingusersapi.sgvpNewVehicleRegister({'Cust_Nric': authorization.Cust_Nric,
                                                        'Veh_Chassisnumber': "C123",
                                                        'Veh_Enginenumber': "E123",
                                                        'Veh_Regnumber': $scope.vehicleupdateData.regnumber,
                                                        'Veh_Type': "Car"}).execute(function(resp) {
      msgObject.msg = resp.ResponseMsg;
      if(resp.ResponseMsg == "New Vehicle Added Successfully"){
        // alert(resp.ResponseMsg);        
      }

      // Alert window.
      $scope.updvehctrlalert(msgObject);                                                    

      // Close Loading Screen
      $scope.closeupdvehctrlloading();

    });
  };

  // Perform the Vehicle update action when the user submits the form
  $scope.doUpdateuser = function() {

    // Local variables
    msgObject = {};
    msgObject.title = '';
    msgObject.msg = '';

    // Loading Screen
    $scope.openupdvehctrlloading();

    // Calling backend google API
    gapi.client.parkingusersapi.sgvpUpdateUserInfo({'Cust_Nric': authorization.Cust_Nric,
                                                    'Cust_FirstName': $scope.userupdateData.firstname,
                                                    'Cust_LastName': $scope.userupdateData.lastname,
                                                    'Cust_Email': $scope.userupdateData.email}).execute(function(resp) {
      msgObject.msg = resp.ResponseMsg;
      if(resp.ResponseMsg == "User Information Update Successful"){
         
      }
      
      // Alert window.
      $scope.updvehctrlalert(msgObject);                                                    

      // Close Loading Screen
      $scope.closeupdvehctrlloading();

    });
  };


  //Display the User transactions when the user submits the form
  $scope.viewtransactions = function() {
    
    // Loading Screen
    $scope.openupdvehctrlloading();

    // Obtaining the transactions of the user from GAPI
   gapi.client.parkingusersapi.sgvpUserTransactionHistory({"Cust_Nric": "user1001"}).execute(function(resp) {
                    //alert(resp.ResponseMsg);
                    // Load the data into the table only if valid data is available
                    if(resp.ResponseMsg == "Valid Data Available")
                    {
                      // Initializing the transactions table with the title
                      $scope.transactions = [
                      { Date: 'Date', Veh: 'Vehicle', Loc: 'Location', Amount: 'Amount', Start: 'Start Time', Stop: 'Stop Time',Duration: 'Duration(m)'}
                      ];
                      // Update the data into the transactions array
                      $scope.$apply( function() {
                          for (var i=0; i < resp.ResponseData.length; i++)
                        {
                            $scope.transactions.push({
                              Date: resp.ResponseData[i].Date,
                              Nric: resp.ResponseData[i].Nric,
                              Veh:  resp.ResponseData[i].Regnumber,
                              Loc:  resp.ResponseData[i].Location,
                            Amount: resp.ResponseData[i].Amount,
                            Start:  resp.ResponseData[i].Starttime,
                            Stop:   resp.ResponseData[i].Stoptime,
                          Duration: resp.ResponseData[i].Stopduration
                              
                            
                            });
                        }
                        });
                    }//Pop-out an error message in case of no data
                    else{
                      // A confirm dialog
                      var myPopup = $ionicPopup.show({
                          title: 'Transaction Error',
                          template: 'No transactions to display',
                          scope: $scope
                          });
                          $timeout(function() {
                           //close the popup automatically after 4 seconds
                           myPopup.close();  
                           // change state to parking coupon page
                          $state.go('app.parkingcoupon');
                        }, 4000);
                          
                        } 
                                      
                     })


    // Close Loading Screen
    $scope.closeupdvehctrlloading();
  };
  // Perform the Vehicle update action when the user submits the form
  $scope.doLogout = function() {
    
    // Loading Screen
    $scope.openupdvehctrlloading();

    // A confirm dialog
    var confirmPopup = $ionicPopup.confirm({
       title: 'Account Logout',
       template: 'Are you sure you want to Log Out?'
      });
    
    // Result of the confirm dialog
    confirmPopup.then(function(res) {
      if(res) {
        // Clear session variables
        authorization.Cust_Nric = null;

        // Reset functions.

        // change state to entry page
        $state.go('entry');
      } else {
        // Stay in the same page
      }
    });

    // Close Loading Screen
    $scope.closeupdvehctrlloading();
  };
})

// Transaction Controller to Update the transaction table
.controller('TransactionCtrl', function($scope,$ionicPopup,$timeout,$state) {
    
  // Obtaining the transactions of the user from GAPI
   gapi.client.parkingusersapi.sgvpUserTransactionHistory({"Cust_Nric": "user1234"}).execute(function(resp) {
                    //alert(resp.ResponseMsg);
                    // Load the data into the table only if valid data is available
                    if(resp.ResponseMsg == "Valid Data Available")
                    {
                      // Initializing the transactions table with the title
                      $scope.transactions = [
                      { Date: 'Date', Veh: 'Vehicle', Loc: 'Location', Amount: 'Amount', Start: 'Start Time', Stop: 'Stop Time',Duration: 'Duration(m)'}
                      ];
                      // Update the data into the transactions array
                      $scope.$apply( function() {
                          for (var i=0; i < resp.ResponseData.length; i++)
                        {
                            $scope.transactions.push({
                              Date: resp.ResponseData[i].Date,
                              Nric: resp.ResponseData[i].Nric,
                              Veh:  resp.ResponseData[i].Regnumber,
                              Loc:  resp.ResponseData[i].Location,
                            Amount: resp.ResponseData[i].Amount,
                            Start:  resp.ResponseData[i].Starttime,
                            Stop:   resp.ResponseData[i].Stoptime,
                          Duration: resp.ResponseData[i].Stopduration
                              
                            
                            });
                        }
                        });
                    }//Pop-out an error message in case of no data
                    else{
                      // A confirm dialog
                      var myPopup = $ionicPopup.show({
                          title: 'Transaction Error',
                          template: 'No transactions to display',
                          scope: $scope
                          });
                          $timeout(function() {
                           //close the popup automatically after 4 seconds
                           myPopup.close();  
                           // change state to parking coupon page
                          $state.go('app.parkingcoupon');
                        }, 4000);
                          
                        } 
                                      
                     })

  
   
})

.controller('ParkingCouponCtrl', function($scope, $ionicModal, $timeout, $interval, $ionicSlideBoxDelegate, 
                                          $state, Authorization,$ionicTabsDelegate, $ionicLoading, $ionicPopup) {

  $scope.parkingcouponData = {};
  $scope.endtime = 0;
  // $scope.parkingcouponData.slideboxdata = [];
  $scope.parkingcouponData.slideboxdata = [];
  $scope.parkingcouponData.vehiclelist = [];
  $scope.parkingcouponData.couponduration = 0.5;
    // {
    //   vehiclenum: '',
    //   hours: '',
    //   minutes: '',
    //   seconds: ''
    // }];
  
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];

$scope.playlists.push('');
  // Data Initializations
  if(authorization.Cust_FirstName == null){
    $scope.parkingcouponData.pageheader = 'Welcome!';
  }
  else{
    $scope.parkingcouponData.pageheader = 'Welcome ' + authorization.Cust_FirstName + '!';
  }

  // Coupon Type
  $scope.parkingcouponData.coupontype = 'car';

  // Vehicle Numbers
  $scope.parkingcouponData.validvehicle = false;
  for (var i=0; i < authorization.Cust_Vehicle.length; i++){
    // $scope.parkingcouponData.slideboxdata.push({vehiclenum: authorization.Cust_Vehicle[i].Veh_Regnumber});
    $scope.parkingcouponData.vehiclelist.push({vehiclenum: authorization.Cust_Vehicle[i].Veh_Regnumber});
    $scope.parkingcouponData.regnum = authorization.Cust_Vehicle[0].Veh_Regnumber;
    $scope.parkingcouponData.validvehicle = true;
  }
  
  // Open Loading Screen
  $scope.openparkcoupctrlloading = function() {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
  };

  // Close Loading Screen
  $scope.closeparkcoupctrlloading = function() {
    $ionicLoading.hide();
  };

  // Alert screen
  $scope.updvehctrlalert = function(msgObject) {
    $ionicPopup.alert({
      title: msgObject.title,
      template: msgObject.msg
    });
  };

  $scope.statusrepeatDone = function(){
    $ionicSlideBoxDelegate.update();    
  }

  $scope.doStartcoupon = function() {
  
    // Local variables
    msgObject = {};
    msgObject.msg = '';
    msgObject.title = '';
    parkcoupon = ($scope.parkingcouponData.coupontype == 'car') ? 0 : 1;

    // Loading Screen
    $scope.openparkcoupctrlloading();

    // Calling backend google API
    gapi.client.parkingcouponsapi.sgvpStartCoupon({'Cust_Nric': authorization.Cust_Nric,
                                                   'Park_Coupon': parkcoupon,
                                                   'Park_Duration': ($scope.parkingcouponData.couponduration)*2,
                                                   'Park_Loclong': 12.1,
                                                   'Park_Loclat': 51.1,
                                                   'Veh_Regnumber': $scope.parkingcouponData.regnum}).execute(function(resp) {
      if(resp.ResponseMsg == "Coupon started successfully"){
      // if(true){
        // Timer start
        var now = new Date();
        var now = (Date.parse(now) / 1000);
        $scope.endtime = now + (1*60);
        

        // Slide Box.
        $scope.parkingcouponData.slidebox = true;

        // Slide Box Data
        $scope.parkingcouponData.slideboxdata.push({vehiclenum: $scope.parkingcouponData.regnum});
        // $scope.parkingcouponData.slideboxdata.push({vehiclenum: 'SGD 123'});
        // $scope.parkingcouponData.slideboxdata.push({vehiclenum: 'SGD 123'});
        // $scope.parkingcouponData.slideboxdata[0] = ($scope.parkingcouponData.regnum);

        // Active Slide
        // $scope.parkingcouponData.myactiveslide = $scope.parkingcouponData.slideboxdata.length;
        // $scope.parkingcouponData.myactiveslide = $scope.parkingcouponData.slideboxdata.length;

        // Activate slide box tab
        $ionicTabsDelegate.select(1);
        $scope.parkingcouponData.myactiveslide = $scope.parkingcouponData.slideboxdata.length;
        // $ionicSlideBoxDelegate.update();

        $scope.makeTimer($scope.parkingcouponData.slideboxdata);
      }
      else{
        // Alert window.
        msgObject.msg = resp.ResponseMsg;
        $scope.updvehctrlalert(msgObject);                                                    
      }
      

      // Close Loading Screen
      $scope.closeparkcoupctrlloading();
    });

    // Loading screen

    // // Slide box activation
    // $scope.parkingcouponData.slidebox = true;

    // //Google API
  
    // // Slidebox control
    // $ionicTabsDelegate.select(1);
    // $scope.parkingcouponData.myactiveslide = 1;
    
    // // $scope.parkingcouponData.slideboxdata.vehregnum.push('SGD 125');
    // $scope.makeTimer();
    // $ionicSlideBoxDelegate.update();
    //   var now = new Date();
    //   var now = (Date.parse(now) / 1000);
    //   $scope.endtime = now + (1*60);

  };


  $scope.doStop = function() {


  };

  $scope.doRenew = function() {


  };

  $scope.makeTimer = function(timerObject) {


      coupontimer = $timeout(function() {
        // alert('Hello');
      // var endTime = new Date("August 26, 2013 18:00:00 PDT");     
      // var endTime = (Date.parse(endTime)) / 1000;

      var now = new Date();
      var now = (Date.parse(now) / 1000);


      var timeLeft = $scope.endtime - now;

      var days = Math.floor(timeLeft / 86400); 
      var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
      var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600 )) / 60);
      var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

      if (hours < "10") { hours = "0" + hours; }
      if (minutes < "10") { minutes = "0" + minutes; }
      if (seconds < "10") { seconds = "0" + seconds; }


      // $scope.parkingcouponData.hours = hours;
      // $scope.parkingcouponData.minutes = minutes;
      // $scope.parkingcouponData.seconds = seconds;

      timerObject[0].hours = hours;
      timerObject[0].minutes = minutes;
      timerObject[0].seconds = seconds;

      if(timeLeft == 0){
        $timeout.cancel(coupontimer);
      }
      else{
        $scope.makeTimer(timerObject);  
      }
      
},1000);
      // $("#days").html(days + "<span>Days</span>");
      // $("#hours").html(hours + "<span>Hours</span>");
      // $("#minutes").html(minutes + "<span>Minutes</span>");
      // $("#seconds").html(seconds + "<span>Seconds</span>");   

  };

});

