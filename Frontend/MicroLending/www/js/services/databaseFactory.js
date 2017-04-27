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
        selector: indexData,
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



// to update pass {_id:doc._id,_rev:doc._rev,tx['','']}
//for tx_array get all the previous tx_id from array then update
service.updateDoc = function (db, doc, callback) {

     db.put(doc).then(function (result) {

        console.log(result);
        callback({ status: "1", data: result });
      }).catch(function (err) {
        console.log(err);
        callback({ status: "0", data: err });

      });
    };


    return service;


  }]);
