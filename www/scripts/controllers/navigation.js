(function() {
  "use strict";
  var NavigationCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  NavigationCtrl = (function() {
    function NavigationCtrl($scope, $location, $routeParams, storageService, securityService) {
      this.$scope = $scope;
      this.$location = $location;
      this.$routeParams = $routeParams;
      this.storageService = storageService;
      this.securityService = securityService;
      this.close = __bind(this.close, this);
      this.logout = __bind(this.logout, this);
      if (this.securityService.isSecure()) {
        this.$scope.logout = this.logout;
        this.$scope.close = this.close;
        this.$scope.username = this.storageService.getDecrypted("username");
      } else {
        this.logout();
      }
    }

    NavigationCtrl.prototype.logout = function() {
      this.storageService.logout();
      return this.$location.url("/");
    };

    NavigationCtrl.prototype.close = function() {
      return this.$location.url("main");
    };

    return NavigationCtrl;

  })();

  NavigationCtrl.$inject = ["$scope", "$location", "$routeParams", "storageService", "securityService"];

  angular.module("webApp").controller("NavigationCtrl", NavigationCtrl);

}).call(this);
