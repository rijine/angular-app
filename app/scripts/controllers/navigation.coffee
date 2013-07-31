"use strict"

class NavigationCtrl

  constructor: (@$scope, @$location, @$routeParams, @storageService, @securityService) ->
    if @securityService.isSecure()
      @$scope.logout = @logout
      @$scope.close = @close
      @$scope.username = @storageService.getDecrypted("username")
    else
      @logout()

  logout: =>
    @storageService.logout()
    @$location.url("/")

  close: =>
	  @$location.url("main")

NavigationCtrl.$inject = ["$scope", "$location", "$routeParams", "storageService", "securityService"]
angular.module("webApp").controller "NavigationCtrl", NavigationCtrl