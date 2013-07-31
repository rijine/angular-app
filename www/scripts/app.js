(function() {
  'use strict';  angular.module("webApp", ["webApp.encryptionService", "webApp.storageService", "webApp.securityService", "webApp.webService", "webApp.uuidService", "ui.calendar", "ui.date", "ui.bootstrap", "webApp.dialogService"]).config(function($routeProvider) {
    return $routeProvider.when("/", {
      templateUrl: "views/login.html",
      controller: "LoginCtrl"
    }).when("/disclaimer", {
      templateUrl: "views/disclaimer.html",
      controller: "NavigationCtrl"
    }).when("/main", {
      templateUrl: "views/main.html",
      controller: "NavigationCtrl"
    }).when("/accounts", {
      templateUrl: "views/accounts.html",
      controller: "AccountsCtrl"
    }).when("/accounts/:accountId/:subpage", {
      templateUrl: "views/accounts.html",
      controller: "AccountsCtrl"
    }).when("/plan", {
      templateUrl: "views/plan.html",
      controller: "PlanCtrl"
    }).when("/plan/:accountId/:subpage", {
      templateUrl: "views/plan.html",
      controller: "PlanCtrl"
    }).when("/calendar", {
      templateUrl: "views/calendar.html",
      controller: "CalendarCtrl"
    }).when("/performance", {
      templateUrl: "views/performance.html",
      controller: "PerformanceCtrl"
    }).when("/library", {
      templateUrl: "views/library.html",
      controller: "LibraryCtrl"
    }).otherwise({
      redirectTo: "/"
    });
  }).config(function($httpProvider) {
    $httpProvider.responseInterceptors.push(function() {
      return function(promise) {
        return promise.then(function(response) {
          if (!response.data) {
            return {};
          }
          if (response.data.Message === "Authentication Successful.") {
            return {};
          }
          if (response.config.url.indexOf("http://") !== -1 || response.config.url.indexOf("https://") !== -1) {
            if (ENCRYPTION) {
              response.data = JSON.parse(Cryptographer.decrypt(response.data));
            }
            return response;
          }
          return response;
        });
      };
    });
    return $httpProvider.defaults.transformRequest.push(function(d) {
      if (ENCRYPTION) {
        if (d) {
          return Cryptographer.encrypt(d);
        } else {
          return d;
        }
      }
    });
  });

}).call(this);
