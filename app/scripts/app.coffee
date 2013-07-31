'use strict'

angular.module("webApp", ["webApp.encryptionService", "webApp.storageService", "webApp.securityService", "webApp.webService", "webApp.uuidService", "ui.calendar", "ui.date", "ui.bootstrap", "webApp.dialogService"])
  .config ($routeProvider) ->
    $routeProvider
    .when("/", {templateUrl: "views/login.html", controller: "LoginCtrl"})
    .when("/disclaimer", {templateUrl: "views/disclaimer.html", controller: "NavigationCtrl"})
    .when("/main", {templateUrl: "views/main.html", controller: "NavigationCtrl"})
    .when("/accounts", {templateUrl: "views/accounts.html", controller: "AccountsCtrl"})
    .when("/accounts/:accountId/:subpage", {templateUrl: "views/accounts.html", controller: "AccountsCtrl"})
    .when("/plan", {templateUrl: "views/plan.html", controller: "PlanCtrl"})
    .when("/plan/:accountId/:subpage", {templateUrl: "views/plan.html", controller: "PlanCtrl"})
    .when("/calendar", {templateUrl: "views/calendar.html", controller: "CalendarCtrl"})
    .when("/performance", {templateUrl: "views/performance.html", controller: "PerformanceCtrl"})
    .when("/library", {templateUrl: "views/library.html", controller: "LibraryCtrl"})
    .otherwise({redirectTo: "/"})
  .config ($httpProvider) ->
    
    $httpProvider.responseInterceptors.push ->
      (promise) ->
        promise.then (response) ->
          return {}  unless response.data
          return {}  if response.data.Message is "Authentication Successful."
          if response.config.url.indexOf("http://") isnt -1 or response.config.url.indexOf("https://") isnt -1
            response.data = JSON.parse(Cryptographer.decrypt(response.data)) if ENCRYPTION
            return response
          response

    $httpProvider.defaults.transformRequest.push (d) ->
      (if d then Cryptographer.encrypt(d) else d) if ENCRYPTION
