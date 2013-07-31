(function() {
  "use strict";
  var Cryptographer;

  Cryptographer = (function() {
    function Cryptographer() {}

    Cryptographer.decrypt = function(encryptedText, key) {
      var C, aes, decrypted, x;

      if (key == null) {
        key = ENCRYPTION_KEY;
      }
      C = CryptoJS;
      encryptedText = C.enc.Base64.parse(encryptedText);
      key = C.enc.Utf8.parse(key);
      aes = C.algo.AES.createDecryptor(key, {
        mode: C.mode.CBC,
        padding: C.pad.Pkcs7,
        iv: key
      });
      decrypted = aes.finalize(encryptedText);
      x = C.enc.Utf8.stringify(decrypted);
      return x;
    };

    Cryptographer.encrypt = function(plainText, key) {
      var C, aes, encrypted, x;

      if (key == null) {
        key = ENCRYPTION_KEY;
      }
      C = CryptoJS;
      plainText = C.enc.Utf8.parse(plainText);
      key = C.enc.Utf8.parse(key);
      aes = C.algo.AES.createEncryptor(key, {
        mode: C.mode.CBC,
        padding: C.pad.Pkcs7,
        iv: key
      });
      encrypted = aes.finalize(plainText);
      x = C.enc.Base64.stringify(encrypted);
      return x;
    };

    return Cryptographer;

  })();

  window.Cryptographer = Cryptographer;

}).call(this);
