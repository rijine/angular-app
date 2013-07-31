(function() {
  "use strict";
  var PerformanceCtrl;

  PerformanceCtrl = (function() {
    function PerformanceCtrl($scope, $location, $routeParams, storageService, webService) {
      var promise;

      this.$scope = $scope;
      this.$location = $location;
      this.$routeParams = $routeParams;
      this.storageService = storageService;
      this.webService = webService;
      this.$scope.page = "performance";
      promise = this.webService.getSalesVolume();
      this.setScope(promise);
    }

    PerformanceCtrl.prototype.setScope = function(promise) {
      var _this = this;

      return promise.then(function(success) {
        return _this.$scope.salesVolume = success.data;
      }, function(error) {
        return console.log(error);
      });
    };

    return PerformanceCtrl;

  })();

  PerformanceCtrl.$inject = ["$scope", "$location", "$routeParams", "storageService", "webService"];

  angular.module("webApp").controller("PerformanceCtrl", PerformanceCtrl);

}).call(this);
