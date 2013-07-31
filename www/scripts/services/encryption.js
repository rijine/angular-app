(function() {
  "use strict";
  var EncryptionService;

  EncryptionService = (function() {
    function EncryptionService() {}

    EncryptionService.prototype.decrypt = function(encryptedText, key) {
      if (key == null) {
        key = ENCRYPTION_KEY;
      }
      return Cryptographer.decrypt(encryptedText, key);
    };

    EncryptionService.prototype.encrypt = function(plainText, key) {
      if (key == null) {
        key = ENCRYPTION_KEY;
      }
      return Cryptographer.encrypt(plainText, key);
    };

    return EncryptionService;

  })();

  angular.module("webApp.encryptionService", [], function($provide) {
    return $provide.factory("encryptionService", function() {
      return new EncryptionService();
    });
  });

}).call(this);
