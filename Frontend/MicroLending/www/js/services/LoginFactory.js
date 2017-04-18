angular.module('app.services')

.factory('loginFactory',['$http','fileFactory',function($http,fileFactory) {
 
 var service = {};
    
     service.login = function (data,callback) {
               console.log(data.ks);
               console.log(data.username);
            ethdapp.retrieveKeystore (data.username,data.password,data.ks,function(error,result){
           
               if(error) {
                   
                        console.log("Error in bundle",error)
                        callback(error,null)    
               }
                else{
                        console.log(result);
                       callback(null,result)
               
                }
           
           })
  
       }
     
     
     
return service
      

}]);
