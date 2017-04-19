mycontrollerModule.controller('emailVerificationCtrl', ['$scope', '$stateParams','$state','$ionicLoading','$timeout','registerFactory','$http','firebaseFactory',
                   function ($scope, $stateParams,$state,$ionicLoading,$timeout,registerFactory,$http,firebaseFactory) {
                     
   
                      
   $scope.ResendOTP = function(data){

                     console.log("Resend OTP")

                     var userData = $stateParams.params.user_data
                     console.log(userData)
                     registerFactory.registerUser(userData,function(response){
                     console.log("resent OTP user: ",response);
                      $state.go('emailVerification',{params:{temp_id:response._id,passphrase:userData.password,user_data:userData}})
               })
      }
           
   
   
   $scope.Verify = function(data){

            
                  //take state params from the register controller
                  var otp_data ={} 
                  otp_data.otp = data.otp
                  otp_data.tmp_id = $stateParams.params.temp_id
                  console.log($stateParams)

                  //call factory function verifyOTP to verify otp
                  registerFactory.verifyOTP(otp_data,function(response,status){

                                 console.log(response)
                                 console.log("verify OTP")
                              
                              //re -register 
                              if (status==404){
                                 //retry 
                                 return
                              }
                           //wrong otp
                              

                  //if otp is verified then generate eth address and register with FCM
                  registerFactory.generateEthAccount($stateParams.params.passphrase,function(err,result){
                                     
                                 console.log(" generateEthAccount Called")
                                 if (err) console.log(err)
                                     //store the KVS in the localstorage;
                                      console.log("save the kvs", result)
                   
                                       local_data = {}
                                       local_data.fname = $stateParams.params.user_data.fname
                                       local_data.lname =  $stateParams.params.user_data.lname
                                       local_data.email =  $stateParams.params.user_data.email
                                       local_data.address = result.address
                                       local_data.ks =  result.ks
                                       local_data.seedWord = result.seedPhrase
                                       local_data.imagePath = ""
                                      
                  // get firebase token
                   firebaseFactory.getFirebaseToken(function(result_token){
                        
                      console.log("getFirebaseToken Called")
                        if (result_token.status == '0'){
                              console.log('Error')
                        
                        }
                      
                      //token = result_token.token
                      //console.log(token)
                  //for mobile store it in a file && for browser on localStorage
                  //{kvs:'',email:,eth_addr:,seed_word:}
                  registerFactory.saveUserDataLocally(local_data,'user_data',function(res){
                    
                                    console.log(local_data)
                                      
                                      if(window.cordova){
                                       
                                         ss.get(
                                           function (value) { console.log('Success, got ' + value); },
                                           function (error) { console.log('Error ' + error); },
                                           'user_data');
                                      
                                      }
                                      else{
                                             console.log('local storage',localStorage.getItem('user_data'))
                                      }
                                      var new_data = {}
                                      new_data.name = response.name
                                      new_data.ethAccount = result.address
                                      new_data.firebaseToken ='abc' 


                      //send to DB 
                      $http.post(apiUrl + "/api/users/"+response._id,new_data)
                           .success(function (response) {

                           console.log(response) 
                     registerFactory.createAppDirectory(function(response){
                          console.log("App creation",response)
                           $state.go('login')
                           
                        })                           
                     
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