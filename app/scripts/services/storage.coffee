"use strict"

class StorageService

  constructor: (@encryptionService) ->

  storeEncrypted: (key, value, eKey = ENCRYPTION_KEY) ->
    localStorage.setItem(key, @encryptionService.encrypt(value, eKey))

  getDecrypted: (key, eKey = ENCRYPTION_KEY) ->
    e = @get(key)
    @encryptionService.decrypt(e, eKey)

  get: (key) ->
    localStorage.getItem key

  getLocallyStoredRecords: ->
    data = []
    for index in [0..localStorage.length - 1]
      keyVal = localStorage.key(index)
      if keyVal.substr(0, 10) is "pert-uuid-"
        data.push JSON.parse @getDecrypted keyVal
    data

  deleteItem: (key) ->
    localStorage.removeItem(key)

  logout: ->
    localStorage.removeItem("pin")
    localStorage.removeItem("username")
    localStorage.removeItem("lastAccessed")
    localStorage.removeItem("password")


angular.module "webApp.storageService", [], ($provide) ->
  $provide.factory "storageService", ["encryptionService", (encryptionService) -> new StorageService(encryptionService)]
