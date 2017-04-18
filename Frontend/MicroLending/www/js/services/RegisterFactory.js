angular.module('app.services')

.factory('registerFactory',['$http','fileFactory',function($http,fileFactory) {
 
 var service = {};
    
     service.registerUser = function (data,callback) {
       
            console.log(data)
             var post_data = {}

             post_data.email = data.email
             post_data.name = data.fname+data.lname

             
             console.log("Register user ",post_data)
             
            $http.post("http://10.51.230.147:3000/api/users",post_data)
                    .success(function (response) {

                    console.log(response)  
                    callback(response)
                    
                    
            })
  
       }
     
     
     
     service.verifyOTP = function (data,callback) {
       

          console.log("verify OTP ")
            
          $http.post("http://10.51.230.147:3000/api/users/verify/"+data.tmp_id,data)
                    .success(function (response) {

                    console.log(response)  
                    callback(response)
                    
                 
            }).catch(function(err){
                    console.log(err)
          }); 
          
  
       }
     
     
     service.saveUserDataLocally = function (data,callback) {
       
         /*ss.set(
            
               function ('user_data') { console.log('Set user_data'); },
               function (error) { console.log('Error ' + error); },
               'user_data', JSON.stringify(data)
         ); */   
        
        
        
      if (window.cordova) {    

                console.log('app',fileFactory)
                
                fileFactory.createFile("abc.json","/",function(res){

                        if (res.status == 1){         
                            fileFactory.writeToFile("abc.json","/",JSON.stringify(data),function(res){

                                console.log(res)
                               callback("abc")

                       })
                    }
                })
        }

      else{
                    console.log('web')
                    localStorage.setItem('user_data',JSON.stringify(data))
                    callback("abc")
          }
   }
     
     
     
     
        service.generateEthAccount = function (password,callback) {
       
           //get the passphrase
           ethdapp.generateKeystore(password,null,function(error,result){
           
               if(error) {
                   
                        console.log(error)
                        callback(error,null)    
                    }
                console.log(result);
               callback(null,result)
           
           })
  
       }
        
        
        
        service.getFirebaseToken = function(callback){
               
               /*messaging.getToken()
                   .then(function(currentToken) {
                     if (currentToken) {
                       callback({status:'1',token:currentToken});
                      
                     } else {
                       // Show permission request.
                       console.log('No Instance ID token available. Request permission to generate one.');
                       // Show permission UI.
                        callback({status:'0'})
                      
                     }
                   }).catch(function(err) {
                        console.log('An error occurred while retrieving token. ', err);
                        callback({status:'0'})
                       
                      });*/
                }
          
    
return service
      

}]);
