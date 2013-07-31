"use strict"

class AccountsCtrl

  constructor: (@$scope, @$location, @$routeParams, @$http, @storageService, @webService, @encryptionService) ->
    @$scope.page = "accounts"
    @$scope.isLoading = true
    
    promise = @webService.getAccounts()
    @setScope promise

  setScope: (promise) ->
    promise.then (success) =>
      @$scope.accounts  = success.data
      @$scope.accountId = if @$routeParams.accountId then @$routeParams.accountId else @$scope.accounts[0].id
      @$scope.subpage   = if @$routeParams.subpage then @$routeParams.subpage else "Company Profile"
      @$scope.accountDetails = @getDataForAccount(@$scope.accounts, @$scope.accountId)
      #Need to do this here to avoid race conditions in $scope
      promiseBB = @webService.getBuyingBehavior()
      @setBuyingBehaviorScope(promiseBB)
    , (error) ->
      console.log(error)

  setBuyingBehaviorScope: (promiseBB) ->
    promiseBB.then (suss) =>
      buyingBehavior = suss.data
      @$scope.buyingBehavior = _.find(buyingBehavior, (obj) => obj.accountId.toString() is @$scope.accountId.toString())
      @$scope.isLoading = false
    , (err) ->
      console.log(err)

  getDataForAccount: (data, accountid) ->
    _.find(data, (obj) -> obj.id.toString() is accountid.toString())

AccountsCtrl.$inject = ["$scope", "$location", "$routeParams", "$http", "storageService", "webService", "encryptionService"]
angular.module("webApp").controller "AccountsCtrl", AccountsCtrl