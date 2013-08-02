(function() {
  "use strict";
  var URLService;

  URLService = (function() {
    function URLService() {
      this.remote = REMOTE;
      this.encrypted = ENCRYPTION;
      this.local = "http://localhost:9000/jsons/";
      this.remoteEncrypted = "http://localhost:3000/api/secure";
      this.remoteUnencrypted = "http://crm-ng.in/jsons/";
    }

    URLService.prototype.auth = function() {
      var url;

      if (!this.remote) {
        url = this.local + "auth.json";
      }
      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted;
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "auth.json";
      }
      return url;
    };

    URLService.prototype.account = function() {
      var url;

      if (!this.remote) {
        url = this.local + "accounts.json";
      }
      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/account";
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/account";
      }
      return url;
    };

    URLService.prototype.buyingbehavior = function() {
      var url;

      if (!this.remote) {
        url = this.local + "bb.json";
      }
      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/buyingbehavior";
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/buyingbehavior";
      }
      return url;
    };

    URLService.prototype.actionplan = function() {
      var url;

      if (!this.remote) {
        url = this.local + "plans.json";
      }
      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/actionplan";
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/actionplan";
      }
      return url;
    };

    URLService.prototype.performance = function() {
      var url;

      if (!this.remote) {
        url = this.local + "performance.json";
      }
      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/performance";
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/performance";
      }
      return url;
    };

    URLService.prototype.calendar = function() {
      var url;

      if (!this.remote) {
        url = this.local + "calendar.json";
      }
      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?calendar";
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?calendar";
      }
      return url;
    };

    URLService.prototype.postplan = function() {
      var url;

      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/actionplan";
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/actionplan";
      }
      return url;
    };

    URLService.prototype.postinteraction = function() {
      var url;

      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/interaction";
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/interaction";
      }
      return url;
    };

    URLService.prototype.deletePlan = function(id) {
      var url;

      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/actionplan?uniqueId=" + id;
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/actionplan?uniqueId=" + id;
      }
      return url;
    };

    URLService.prototype.deleteInteraction = function(id) {
      var url;

      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/interaction?uniqueId=" + id;
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/interaction?uniqueId=" + id;
      }
      return url;
    };

    return URLService;

  })();

  window.URLService = URLService;

}).call(this);
