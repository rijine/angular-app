"use strict"

class SecurityCtrl

  constructor: (@$scope, @$location, @$routeParams, @storageService, @encryptionService) ->
    @$scope.unlock = @unlock

  unlock: =>
    if @storageService.get("pin") is @encryptionService.encrypt(@$scope.user.pin, @$scope.user.username)
      @storageService.storeEncrypted("lastAccessed", moment().format("MMMM DD YYYY hh:mm:ss"))
      location.reload()
    else
      @storageService.logout()
      @$location.url("/")

SecurityCtrl.$inject = ["$scope", "$location", "$routeParams", "storageService", "encryptionService"]
angular.module("webApp").controller "SecurityCtrl", SecurityCtrl