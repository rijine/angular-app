"use strict"

class WebService

  constructor: (@$http, @$storageService, @encryptionService) ->

  getCredentails: ->
    username = @$storageService.get("username")
    password = @$storageService.get("password")
    [username, password]

  getOptions: ->
    creds = @getCredentails()
    @options = {headers: {'X-User': creds[0], 'X-Password': creds[1]}, cache: true}
  
  authenticate: (username, password) ->
    urlService = new URLService()
    e_un = @encryptionService.encrypt(username)
    e_pw = @encryptionService.encrypt(password)
    promise = @$http.get(urlService.auth(), {headers: {'X-User': e_un, 'X-Password': e_pw}, cache: false})

  getAccounts: () ->
    urlService = new URLService()
    promise = @$http.get(urlService.account(), @getOptions())

  getBuyingBehavior: () ->
    urlService = new URLService()
    promise = @$http.get(urlService.buyingbehavior(), @getOptions())

  getActionPlan: () ->
    urlService = new URLService()
    promise = @$http.get(urlService.actionplan(), @getOptions())

  getCalendar: () ->
    urlService = new URLService()
    urlService.calendar()

  getSalesVolume: () ->
    urlService = new URLService()
    promise = @$http.get(urlService.performance(), @getOptions())
  
  postPlan: (obj) ->
    urlService = new URLService()
    promise = @$http.post(urlService.postplan(), obj, @getOptions())

  postInteraction: (obj) ->
    urlService = new URLService()
    promise = @$http.post(urlService.postinteraction(), obj, @getOptions())

  deletePlan: (id) ->
    urlService = new URLService()
    promise = @$http.delete(urlService.deletePlan(id), @getOptions())

  deleteInteraction: (id) ->
    urlService = new URLService()
    promise = @$http.delete(urlService.deleteInteraction(id), @getOptions())

angular.module "webApp.webService", [], ($provide) ->
  $provide.factory "webService", ["$http", "storageService", "encryptionService", ($http, storageService, encryptionService) -> new WebService($http, storageService, encryptionService)]
