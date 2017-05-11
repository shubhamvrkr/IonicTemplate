var obj = {};

obj.start = function(hrs,mins, successCallback, errorCallback) {
    cordova.exec(
      successCallback, errorCallback,
      "AlarmManager", "startAlarm", [hrs,mins]);
};

module.exports = obj;
