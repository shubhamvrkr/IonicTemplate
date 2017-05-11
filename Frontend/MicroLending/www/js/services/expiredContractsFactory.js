angular.module('app.services')

    .factory('expiredContractsFactory', ['databaseFactory', function (databaseFactory) {

        var service = {};

        service.getAllUnsettledExpiredContracts = function (callback) {

            var todayDate = new Date();
            var then = new Date(
                todayDate.getFullYear(),
                todayDate.getMonth(),
                todayDate.getDate() + 1,
                0, 0, 0);

            var currentTimeInMS = Math.round(new Date().getTime() / 1000);
            var DayAfterTimeInMs = Math.round(then.getTime() / 1000);
            var Contracts = [];
            var expiredContracts = [];
            console.log("currentTimeInMS", currentTimeInMS);
            console.log("DayAfterTimeInMs", DayAfterTimeInMs);

            databaseFactory.getDoc(deal_db, { status: "pending" }, function (pending_contracts) {

                console.log(pending_contracts)


                if (pending_contracts.status == "1") {
                    if (pending_contracts.data.docs.length != 0) {

                        pending_contracts.data.docs.forEach(function (ele) {
                            Contracts.push(ele);
                        });

                    }

                    databaseFactory.getDoc(deal_db, { status: "active" }, function (active_contracts) {

                        console.log(active_contracts)
                        if (active_contracts.status == "1") {
                            if (active_contracts.data.docs.length != 0) {
                                active_contracts.data.docs.forEach(function (ele) {
                                    Contracts.push(ele);
                                });
                            }

                            Contracts.forEach(function (element) {
                                console.log("end date", element.end_date);
                                    // && element.end_date <= DayAfterTimeInMs
                                if (currentTimeInMS <= element.end_date) {
                                    console.log("Found", element)
                                    expiredContracts.push(element);
                                } else {
                                    console.log("Not present")
                                }

                            });

                            callback(expiredContracts);
                        } else {
                            callback(expiredContracts);
                        }
                    });
                } else {
                    callback(expiredContracts)
                }
            });
        };


        //get all contracts which are not settled and expired
        service.updateExpireContractFlag = function (callback) {

            console.log("Updating");
            var todayDate = new Date();
            var then = new Date(
                todayDate.getFullYear(),
                todayDate.getMonth(),
                todayDate.getDate() + 1,
                0, 0, 0);

            var currentTimeInMS = Math.round(new Date().getTime() / 1000);

            var Contracts = [];
            var expiredContracts = [];
            console.log("currentTimeInMS", currentTimeInMS);


            databaseFactory.getDoc(deal_db, { status: "pending" }, function (pending_contracts) {

                console.log(pending_contracts.data.docs)
                if (pending_contracts.data.docs.length != 0) {

                    pending_contracts.data.docs.forEach(function (ele) {
                        Contracts.push(ele);
                    });

                }

                databaseFactory.getDoc(deal_db, { status: "active" }, function (active_contracts) {

                    if (active_contracts.data.docs.length != 0) {
                        active_contracts.data.docs.forEach(function (ele) {
                            Contracts.push(ele);
                        });
                    }

                    Contracts.forEach(function (element) {
                       
                        if (currentTimeInMS >= element.end_date) {
                            console.log("Expired contract", element);
                            //call update doc function
                            doc = element
                            doc.status = "expired";
                            databaseFactory.updateDoc(deal_db, doc, function (res) {
                                if (res.status == "1") {
                                    console.log("flag updated to expired");
                                    console.log("expired deal is", doc)
                                } else {
                                    callback({ status: "0" });
                                }


                            });

                        } else {
                            console.log("Not Expired")
                        }
                    });
                    callback({ status: "1" });
                });
            });
        };

        return service;

    }]);
