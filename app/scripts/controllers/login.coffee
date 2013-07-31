"use strict"

class LoginCtrl

  constructor: (@$scope, @$http, @$location, @storageService, @webService, @dialogService) ->
    @$scope.login = @login
    @$scope.close = @close

  login: =>
    @$scope.isLoading = true
    if @$scope.user.pin
      promise = @webService.authenticate(@$scope.user.username, @$scope.user.password)
      promise.then (success) =>
        @$scope.isLoading = false
        @storageService.storeEncrypted("pin", @$scope.user.pin, @$scope.user.username)
        @storageService.storeEncrypted("lastAccessed", moment().format("MMMM DD YYYY hh:mm:ss"))
        @storageService.storeEncrypted("username", @$scope.user.username)
        @storageService.storeEncrypted("password", @$scope.user.password)
        @$location.url("disclaimer")
      , (error) =>
        @$scope.isLoading = false
        @$scope.message = "Error : " + error.data.Message
    else
      @dialogService.showDialog("Error", "Security Pin should be a 4 digit number", "login")

LoginCtrl.$inject = ["$scope", "$http", "$location", "storageService", "webService", "dialogService"]
angular.module("webApp").controller "LoginCtrl", LoginCtrl
