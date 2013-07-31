(function() {
  "use strict";
  var SecurityCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  SecurityCtrl = (function() {
    function SecurityCtrl($scope, $location, $routeParams, storageService, encryptionService) {
      this.$scope = $scope;
      this.$location = $location;
      this.$routeParams = $routeParams;
      this.storageService = storageService;
      this.encryptionService = encryptionService;
      this.unlock = __bind(this.unlock, this);
      this.$scope.unlock = this.unlock;
    }

    SecurityCtrl.prototype.unlock = function() {
      if (this.storageService.get("pin") === this.encryptionService.encrypt(this.$scope.user.pin, this.$scope.user.username)) {
        this.storageService.storeEncrypted("lastAccessed", moment().format("MMMM DD YYYY hh:mm:ss"));
        return location.reload();
      } else {
        this.storageService.logout();
        return this.$location.url("/");
      }
    };

    return SecurityCtrl;

  })();

  SecurityCtrl.$inject = ["$scope", "$location", "$routeParams", "storageService", "encryptionService"];

  angular.module("webApp").controller("SecurityCtrl", SecurityCtrl);

}).call(this);
