angular.module('app.services')
  .factory('getCurrentUserData', [function() {

    var service = {};

    //load addr,ks,pwdervedkey from ss or localstorage

    service.getData = function(callback) {



      if (window.cordova) {

        ss.get(
          function(value) {

            console.log('Success, got ' + value);
            var user_data = JSON.parse(value);
            var current_user_data = {};
            current_user_data.from_eth_address = user_data.address;
            current_user_data.from_email = user_data.email;
            var r_hex_e = buffer.from(sessionStorage.getItem("pwDerivedKey").toString('hex'), 'hex');
            current_user_data.pwDerivedKey =  r_hex_e;
            current_user_data.current_user_key = user_data.publicKey;


            ethdapp.importKeystore(user_data.ks, function(error, result) {
              console.log("DeSerialized keystore is");
              console.log(result);
              current_user_data.ks_local = result;
              callback({
                data: current_user_data
              });
            });



          },
          function(error) {
			console.log("data not found")
			callback({
                data: null
              });
            console.log('Error fetching local data ' + error);
          },
          'user_data');
		  
      } else {

		try{
		
			
			var user_data = JSON.parse(localStorage.getItem("user_data"));
			console.log(user_data);
			var current_user_data = {};
			current_user_data.from_eth_address = user_data.address;
			current_user_data.from_email = user_data.email;

			var r_hex_e = buffer.from(sessionStorage.getItem("pwDerivedKey").toString('hex'), 'hex');
			   current_user_data.pwDerivedKey =  r_hex_e;
			current_user_data.current_user_key = user_data.publicKey;
			ethdapp.importKeystore(user_data.ks, function(error, result) {
			  console.log("DeSerialized keystore is");
			  console.log(result);
			  current_user_data.ks_local = result;
			  callback({
				data: current_user_data
			  });
			});
			
		}catch(err){
			console.log("data not found")
			callback({
                data: null
              });
		}

      }


    };



    return service;


  }]);
