(function() {
  "use strict";
  var LibraryCtrl;

  LibraryCtrl = (function() {
    function LibraryCtrl($scope, $location, $routeParams, storageService) {
      this.$scope = $scope;
      this.$location = $location;
      this.$routeParams = $routeParams;
      this.storageService = storageService;
      this.$scope.page = "library";
    }

    return LibraryCtrl;

  })();

  LibraryCtrl.$inject = ["$scope", "$location", "$routeParams", "storageService"];

  angular.module("webApp").controller("LibraryCtrl", LibraryCtrl);

}).call(this);
