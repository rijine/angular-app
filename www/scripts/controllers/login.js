(function() {
  "use strict";
  var LoginCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  LoginCtrl = (function() {
    function LoginCtrl($scope, $http, $location, storageService, webService, dialogService) {
      this.$scope = $scope;
      this.$http = $http;
      this.$location = $location;
      this.storageService = storageService;
      this.webService = webService;
      this.dialogService = dialogService;
      this.login = __bind(this.login, this);
      this.$scope.login = this.login;
      this.$scope.close = this.close;
    }

    LoginCtrl.prototype.login = function() {
      var promise,
        _this = this;

      this.$scope.isLoading = true;
      if (this.$scope.user.pin) {
        promise = this.webService.authenticate(this.$scope.user.username, this.$scope.user.password);
        return promise.then(function(success) {
          _this.$scope.isLoading = false;
          _this.storageService.storeEncrypted("pin", _this.$scope.user.pin, _this.$scope.user.username);
          _this.storageService.storeEncrypted("lastAccessed", moment().format("MMMM DD YYYY hh:mm:ss"));
          _this.storageService.storeEncrypted("username", _this.$scope.user.username);
          _this.storageService.storeEncrypted("password", _this.$scope.user.password);
          return _this.$location.url("disclaimer");
        }, function(error) {
          _this.$scope.isLoading = false;
          return _this.$scope.message = "Error : " + error.data.Message;
        });
      } else {
        return this.dialogService.showDialog("Error", "Security Pin should be a 4 digit number", "login");
      }
    };

    return LoginCtrl;

  })();

  LoginCtrl.$inject = ["$scope", "$http", "$location", "storageService", "webService", "dialogService"];

  angular.module("webApp").controller("LoginCtrl", LoginCtrl);

}).call(this);
