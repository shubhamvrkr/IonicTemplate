mycontrollerModule.controller('emailVerificationCtrl', ['$scope', '$stateParams','$state','$ionicLoading','$timeout','registerFactory','$http',
                   function ($scope, $stateParams,$state,$ionicLoading,$timeout,registerFactory,$http) {
                     
   
                      
   $scope.ResendOTP = function(){

                     console.log("Resend OTP")

                     var userData = $stateParams.params.user_data
                     console.log(userData)
                     registerFactory.registerUser(userData,function(response){
                     console.log("resent OTP user: ",response);
                     $state.go('emailVerification',{params:{temp_id:response._id,passphrase:userData.password}});
               })
      }
           
   
   
   $scope.Verify = function(data){

            
                  //take state params from the register controller
                  var otp_data ={} 
                  otp_data.otp = data.otp
                  otp_data.tmp_id = $stateParams.params.temp_id
                  console.log($stateParams)

                  //call factory function verifyOTP to verify otp
                  registerFactory.verifyOTP(otp_data,function(response){

                                 console.log(response)
                                 console.log("verify OTP")

                  //if otp is verified then generate eth address and register with FCM
                  registerFactory.generateEthAccount($stateParams.params.passphrase,function(err,result){
                                       if (err) console.log(err)
                                     //store the KVS in the localstorage;
                                      console.log("save the kvs", result)
                   
                                      
                  // get firebase token
                   registerFactory.getFirebaseToken(function(result_token){
                        
                        if (result.status == '0'){
                              console.log('Error')
                        
                        }
                      
                      token = result_token.token
                      console.log(token)
                  //for mobile store it in a file && for browser on localStorage
                  //{kvs:'',email:,eth_addr:,seed_word:}
                  registerFactory.saveUserDataLocally(result,function(res){
                                      console.log(res)
                                      console.log('local storage',localStorage.getItem('user_data'))

                                      var new_data = {}
                                      new_data.name = response.name
                                      new_data.ethAccount = result.address
                                      new_data.firebaseToken =token 


                      //send to DB 
                      $http.post(apiUrl + "/api/users/"+response._id,new_data)
                           .success(function (response) {

                           console.log(response)  
                           $state.go('login')


                       });     
                  });

               })

           })     


       })
               /*$ionicLoading.show({
                       templateUrl: 'templates/loading.html',
                       animation: 'fade-in',
                       showBackdrop: true,
                       maxWidth: 200,
                       showDelay: 0
                   });
                   $timeout(function () {

                       $ionicLoading.hide();
                       $state.go('menu.allContracts');

                   }, 2000);*/
   }

       }])