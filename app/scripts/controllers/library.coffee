"use strict"

class LibraryCtrl

  constructor: (@$scope, @$location, @$routeParams, @storageService) ->
    @$scope.page = "library"

LibraryCtrl.$inject = ["$scope", "$location", "$routeParams", "storageService"]
angular.module("webApp").controller "LibraryCtrl", LibraryCtrl