angular.module('app.services')

  .factory('databaseFactory', [function () {

    var service = {};

    service.putData = function (db, payload, callback) {

      db.put(payload)

        .then(function (response) {
          console.log(response);
          callback({ status: "1", data: response });
        })
        .catch(function (err) {
          console.log(err);
          callback({ status: "0", data: err });
        });
    };


    service.getAllData = function (db, callback) {

      db.allDocs({
        include_docs: true
      }).then(function (result) {
        console.log(result);
        callback({ status: "1", data: result });
      }).catch(function (err) {
        console.log(err);
        callback({ status: "0", data: err });
      });

    };


    service.getDoc = function (db, indexData, callback) {

      db.find({
        selector: indexData
        //sort: ['name']
      }).then(function (result) {
        console.log(result);
        callback({ status: "1", data: result });
      }).catch(function (err) {
        console.log(err);
        callback({ status: "0", data: err });

      });
    };

    service.deleteDoc = function (db, doc, callback) {

		db.remove(doc._id, doc._rev).then(function (result) {

        console.log(result);
        callback({ status: "1", data: result });
      }).catch(function (err) {
        console.log(err);
        callback({ status: "0", data: err });

      });
    };


	service.updateDoc = function (db, doc, callback) {

     db.put(doc).then(function (result) {

			console.log(result);
			callback({ status: "1", data: result });
		  }).catch(function (err) {
			console.log(err);
			callback({ status: "0", data: err });

		  });
    };
	
	service.getDocById = function (db, id, callback) {

     db.get(id).then(function (result) {

			console.log(result);
			callback({ status: "1", data: result });
		  }).catch(function (err) {
			console.log(err);
			callback({ status: "0", data: err });

		  });
    };

service.bulkUpadte = function(db,data_array,callback){

//var object = { 'a': 1, 'b': '2', 'c': 3 };
 
console.log("DAta array",data_array);


//check if the array is empty or not.  
if(data_array.length==0){
  callback({status:"0"});
}
else{


db.bulkDocs(data_array).then(function (result) {
 console.log(result);
 
  callback({status:"0"});
}).catch(function (err) {
  console.log(err);
});
}
}
 return service;

}]);
