angular.module('app.services')

    .factory('expiredContractsFactory', ['databaseFactory', function (databaseFactory) {

        var service = {};

        service.getAllExpiredContracts = function (callback) {

            var currentTimeInMS = new Date().getTime() / 1000;
            var expiredContracts = [];
            console.log("currentTimeInMS", currentTimeInMS)
            databaseFactory.getAllData(deal_db, function (response) {


                response.data.rows.forEach(function (element) {
                    console.log("end date", element.doc.end_date)
                    if (currentTimeInMS <= element.doc.end_date) {
                        console.log(element)
                        expiredContracts.push(element.doc);
                    }
                    else {
                        console.log("No more")
                    }
                });
                //callback

            });
			
        };


        //get all contracts which are not settled and expired
        service.getAllUnSettledExpiredContracts = function (callback) {

            var currentTimeInMS = new Date().getTime() / 1000;
            var expiredContracts = [];
            console.log("currentTimeInMS", currentTimeInMS)
            databaseFactory.getAllData(deal_db, function (response) {


                response.data.rows.forEach(function (element) {
                    console.log("end date", element.doc.end_date)
                    if (currentTimeInMS <= element.doc.end_date && element.doc.tx.length == 2 && element.doc.tx[1].eventName == "acceptContract") {
                        console.log(element)
                        expiredContracts.push(element.doc);
                    }
                    else {
                        console.log("No more")
                    }
                });
                //callback

                console.log(expiredContracts)

            });


        };

        return service;

    }]);
