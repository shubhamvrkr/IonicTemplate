angular.module('app.services')

  .factory('databaseFactory', [function () {

    var service = {};

    service.putData = function (db, payload, callback) {

      db.put(payload)

        .then(function (response) {
          console.log(response);
          callback({ status: "1", data: response })
        })
        .catch(function (err) {
          console.log(err);
          callback({ status: "0", data: err })
        });
    }


    service.getAllData = function (db, searchText, callback) {

      db.allDocs({
        include_docs: true,
        startkey: searchText,
        endkey: searchText + '\uffff'
      }).then(function (result) {
        console.log(result);
        callback({ status: "1", data: result })
      }).catch(function (err) {
        console.log(err);
        callback({ status: "0", data: err })
      });

    }


    service.getDoc = function (db, indexData, callback) {

      db.find({
        selector: indexData,
        //sort: ['name']
      }).then(function (result) {
        console.log(result);
        callback({ status: "1", data: result })
      }).catch(function (err) {
        console.log(err);
        callback({ status: "0", data: err })

      });
    }

    service.deleteDoc = function (db, doc, callback) {

      db.remove(doc).then(function (result) {

        console.log(result);
        callback({ status: "1", data: result });
      }).catch(function (err) {
        console.log(err);
        callback({ status: "0", data: err })

      })
    }

    return service


  }]);
