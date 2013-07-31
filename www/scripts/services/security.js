(function() {
  "use strict";
  var SecurityService;

  SecurityService = (function() {
    function SecurityService(storageService, $dialog) {
      this.storageService = storageService;
      this.$dialog = $dialog;
    }

    SecurityService.prototype.isSecure = function() {
      var allowance, lastAccessed, now;

      lastAccessed = this.storageService.getDecrypted("lastAccessed", ENCRYPTION_KEY);
      if (!lastAccessed) {
        return false;
      }
      now = moment(moment().format("MMMM DD YYYY hh:mm:ss"), "MMMM DD YYYY hh:mm:ss");
      allowance = moment(lastAccessed, "MMMM DD YYYY hh:mm:ss").add('m', 15);
      if (now.isAfter(allowance)) {
        return this.showDialog();
      } else {
        return true;
      }
    };

    SecurityService.prototype.showDialog = function() {
      var template;

      template = "<div class=\"modal-header\">\n  <h1>Please Unlock Application</h1>\n</div>\n<div class=\"modal-body\">\n  <form name=\"unlockForm\" class=\"simple-form\" data-ng-submit=\"unlock(user)\">\n    <div class=\"input-append\">\n      <input type=\"text\" ng-model=\"user.username\" placeholder=\"Username\" required />\n      <span class=\"add-on\"><img src=\"images/uname_icon.png\"/></span>\n    </div>\n    <div class=\"input-append\">\n      <input type=\"password\" name=\"pin\" ng-model=\"user.pin\" placeholder=\"Security Pin\" ng-maxlength=\"4\" ng-minlength=\"4\" ng-pattern=\"/^[0-9]{4}$/\" required />\n      <span class=\"add-on\"><img src=\"images/password_icon.png\"/></span>\n    </div>\n    <input class=\"btn-app\" type=\"submit\" value=\"Unlock\">\n  </form>\n</div>\n<div class=\"modal-footer\"></div>";
      return this.$dialog.dialog({
        controller: 'SecurityCtrl',
        backdrop: true,
        backdropClick: false,
        keyboard: false,
        backdropFade: true,
        template: template
      }).open();
    };

    return SecurityService;

  })();

  angular.module("webApp.securityService", [], function($provide) {
    return $provide.factory("securityService", [
      "storageService", "$dialog", function(storageService, $dialog) {
        return new SecurityService(storageService, $dialog);
      }
    ]);
  });

}).call(this);
