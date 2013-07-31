"use strict"

class UUIDService

  getUUID: ->
    uuid = ""
    random = undefined
    i = 0
    while i < 32
      random = Math.random() * 16 | 0
      uuid += "-"  if i is 8 or i is 12 or i is 16 or i is 20
      uuid += ((if i is 12 then 4 else ((if i is 16 then (random & 3 | 8) else random)))).toString(16)
      i++
    "pert-uuid-" + uuid #Need this as Apple stores it's own rubbish in localStorage which may cause sync problems

angular.module "webApp.uuidService", [], ($provide) ->
  $provide.factory "uuidService", -> new UUIDService()
