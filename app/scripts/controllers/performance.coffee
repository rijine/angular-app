"use strict"

class PerformanceCtrl

  constructor: (@$scope, @$location, @$routeParams, @storageService, @webService) ->
    @$scope.page = "performance"

    promise = @webService.getSalesVolume()
    @setScope promise

  setScope: (promise) ->
    promise.then (success) =>
      @$scope.salesVolume  = success.data
    , (error) ->
      console.log(error)

PerformanceCtrl.$inject = ["$scope", "$location", "$routeParams", "storageService", "webService"]
angular.module("webApp").controller "PerformanceCtrl", PerformanceCtrl