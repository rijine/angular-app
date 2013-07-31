(function() {
  "use strict";
  var UUIDService;

  UUIDService = (function() {
    function UUIDService() {}

    UUIDService.prototype.getUUID = function() {
      var i, random, uuid;

      uuid = "";
      random = void 0;
      i = 0;
      while (i < 32) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += "-";
        }
        uuid += (i === 12 ? 4 : (i === 16 ? random & 3 | 8 : random)).toString(16);
        i++;
      }
      return "pert-uuid-" + uuid;
    };

    return UUIDService;

  })();

  angular.module("webApp.uuidService", [], function($provide) {
    return $provide.factory("uuidService", function() {
      return new UUIDService();
    });
  });

}).call(this);
