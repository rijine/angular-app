(function() {
  "use strict";
  var StorageService;

  StorageService = (function() {
    function StorageService(encryptionService) {
      this.encryptionService = encryptionService;
    }

    StorageService.prototype.storeEncrypted = function(key, value, eKey) {
      if (eKey == null) {
        eKey = ENCRYPTION_KEY;
      }
      return localStorage.setItem(key, this.encryptionService.encrypt(value, eKey));
    };

    StorageService.prototype.getDecrypted = function(key, eKey) {
      var e;

      if (eKey == null) {
        eKey = ENCRYPTION_KEY;
      }
      e = this.get(key);
      return this.encryptionService.decrypt(e, eKey);
    };

    StorageService.prototype.get = function(key) {
      return localStorage.getItem(key);
    };

    StorageService.prototype.getLocallyStoredRecords = function() {
      var data, index, keyVal, _i, _ref;

      data = [];
      for (index = _i = 0, _ref = localStorage.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; index = 0 <= _ref ? ++_i : --_i) {
        keyVal = localStorage.key(index);
        if (keyVal.substr(0, 10) === "pert-uuid-") {
          data.push(JSON.parse(this.getDecrypted(keyVal)));
        }
      }
      return data;
    };

    StorageService.prototype.deleteItem = function(key) {
      return localStorage.removeItem(key);
    };

    StorageService.prototype.logout = function() {
      localStorage.removeItem("pin");
      localStorage.removeItem("username");
      localStorage.removeItem("lastAccessed");
      return localStorage.removeItem("password");
    };

    return StorageService;

  })();

  angular.module("webApp.storageService", [], function($provide) {
    return $provide.factory("storageService", [
      "encryptionService", function(encryptionService) {
        return new StorageService(encryptionService);
      }
    ]);
  });

}).call(this);
