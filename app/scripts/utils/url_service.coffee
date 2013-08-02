"use strict"

class URLService

  constructor: () ->
    @remote = REMOTE
    @encrypted = ENCRYPTION
    @local = "http://localhost:9000/jsons/"
    @remoteEncrypted   = "http://localhost:3000/api/secure"
    @remoteUnencrypted = "http://crm-ng.in/jsons/"

  auth: ->
    url = @local + "auth.json" if !@remote
    url = @remoteEncrypted if @remote and @encrypted
    url = @remoteUnencrypted + "auth.json" if @remote and !@encrypted
    url

  account: ->
    url = @local + "accounts.json" if !@remote
    url = @remoteEncrypted   + "?/account" if @remote and @encrypted
    url = @remoteUnencrypted + "?/account" if @remote and !@encrypted
    url

  buyingbehavior: ->
    url = @local + "bb.json" if !@remote
    url = @remoteEncrypted   + "?/buyingbehavior" if @remote and @encrypted
    url = @remoteUnencrypted + "?/buyingbehavior" if @remote and !@encrypted
    url

  actionplan: ->
    url = @local + "plans.json" if !@remote
    url = @remoteEncrypted   + "?/actionplan" if @remote and @encrypted
    url = @remoteUnencrypted + "?/actionplan" if @remote and !@encrypted
    url

  performance: ->
    url = @local + "performance.json" if !@remote
    url = @remoteEncrypted   + "?/performance" if @remote and @encrypted
    url = @remoteUnencrypted + "?/performance" if @remote and !@encrypted
    url

  calendar: ->
    url = @local + "calendar.json" if !@remote
    url = @remoteEncrypted   + "?calendar" if @remote and @encrypted
    url = @remoteUnencrypted + "?calendar" if @remote and !@encrypted
    url

  postplan: ->
    url = @remoteEncrypted   + "?/actionplan" if @remote and @encrypted
    url = @remoteUnencrypted + "?/actionplan" if @remote and !@encrypted
    url

  postinteraction: ->
    url = @remoteEncrypted   + "?/interaction" if @remote and @encrypted
    url = @remoteUnencrypted + "?/interaction" if @remote and !@encrypted
    url

  deletePlan: (id) ->
    url = @remoteEncrypted   + "?/actionplan?uniqueId=" + id if @remote and @encrypted
    url = @remoteUnencrypted + "?/actionplan?uniqueId=" + id if @remote and !@encrypted
    url

  deleteInteraction: (id) ->
    url = @remoteEncrypted   + "?/interaction?uniqueId=" + id if @remote and @encrypted
    url = @remoteUnencrypted + "?/interaction?uniqueId=" + id if @remote and !@encrypted
    url

window.URLService = URLService
