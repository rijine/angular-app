(function() {
  "use strict";
  var WebService;

  WebService = (function() {
    function WebService($http, $storageService, encryptionService) {
      this.$http = $http;
      this.$storageService = $storageService;
      this.encryptionService = encryptionService;
    }

    WebService.prototype.getCredentails = function() {
      var password, username;

      username = this.$storageService.get("username");
      password = this.$storageService.get("password");
      return [username, password];
    };

    WebService.prototype.getOptions = function() {
      var creds;

      creds = this.getCredentails();
      return this.options = {
        headers: {
          'X-User': creds[0],
          'X-Password': creds[1]
        },
        cache: true
      };
    };

    WebService.prototype.authenticate = function(username, password) {
      var e_pw, e_un, promise, urlService;

      urlService = new URLService();
      e_un = this.encryptionService.encrypt(username);
      e_pw = this.encryptionService.encrypt(password);
      return promise = this.$http.get(urlService.auth(), {
        headers: {
          'X-User': e_un,
          'X-Password': e_pw
        },
        cache: false
      });
    };

    WebService.prototype.getAccounts = function() {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http.get(urlService.account(), this.getOptions());
    };

    WebService.prototype.getBuyingBehavior = function() {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http.get(urlService.buyingbehavior(), this.getOptions());
    };

    WebService.prototype.getActionPlan = function() {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http.get(urlService.actionplan(), this.getOptions());
    };

    WebService.prototype.getCalendar = function() {
      var urlService;

      urlService = new URLService();
      return urlService.calendar();
    };

    WebService.prototype.getSalesVolume = function() {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http.get(urlService.performance(), this.getOptions());
    };

    WebService.prototype.postPlan = function(obj) {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http.post(urlService.postplan(), obj, this.getOptions());
    };

    WebService.prototype.postInteraction = function(obj) {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http.post(urlService.postinteraction(), obj, this.getOptions());
    };

    WebService.prototype.deletePlan = function(id) {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http["delete"](urlService.deletePlan(id), this.getOptions());
    };

    WebService.prototype.deleteInteraction = function(id) {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http["delete"](urlService.deleteInteraction(id), this.getOptions());
    };

    return WebService;

  })();

  angular.module("webApp.webService", [], function($provide) {
    return $provide.factory("webService", [
      "$http", "storageService", "encryptionService", function($http, storageService, encryptionService) {
        return new WebService($http, storageService, encryptionService);
      }
    ]);
  });

}).call(this);
