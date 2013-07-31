(function() {
  "use strict";
  var AccountsCtrl;

  AccountsCtrl = (function() {
    function AccountsCtrl($scope, $location, $routeParams, $http, storageService, webService, encryptionService) {
      var promise;

      this.$scope = $scope;
      this.$location = $location;
      this.$routeParams = $routeParams;
      this.$http = $http;
      this.storageService = storageService;
      this.webService = webService;
      this.encryptionService = encryptionService;
      this.$scope.page = "accounts";
      this.$scope.isLoading = true;
      promise = this.webService.getAccounts();
      this.setScope(promise);
    }

    AccountsCtrl.prototype.setScope = function(promise) {
      var _this = this;

      return promise.then(function(success) {
        var promiseBB;

        _this.$scope.accounts = success.data;
        _this.$scope.accountId = _this.$routeParams.accountId ? _this.$routeParams.accountId : _this.$scope.accounts[0].id;
        _this.$scope.subpage = _this.$routeParams.subpage ? _this.$routeParams.subpage : "Company Profile";
        _this.$scope.accountDetails = _this.getDataForAccount(_this.$scope.accounts, _this.$scope.accountId);
        promiseBB = _this.webService.getBuyingBehavior();
        return _this.setBuyingBehaviorScope(promiseBB);
      }, function(error) {
        return console.log(error);
      });
    };

    AccountsCtrl.prototype.setBuyingBehaviorScope = function(promiseBB) {
      var _this = this;

      return promiseBB.then(function(suss) {
        var buyingBehavior;

        buyingBehavior = suss.data;
        _this.$scope.buyingBehavior = _.find(buyingBehavior, function(obj) {
          return obj.accountId.toString() === _this.$scope.accountId.toString();
        });
        return _this.$scope.isLoading = false;
      }, function(err) {
        return console.log(err);
      });
    };

    AccountsCtrl.prototype.getDataForAccount = function(data, accountid) {
      return _.find(data, function(obj) {
        return obj.id.toString() === accountid.toString();
      });
    };

    return AccountsCtrl;

  })();

  AccountsCtrl.$inject = ["$scope", "$location", "$routeParams", "$http", "storageService", "webService", "encryptionService"];

  angular.module("webApp").controller("AccountsCtrl", AccountsCtrl);

}).call(this);
