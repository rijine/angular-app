"use strict"

class DialogService

  constructor: (@$dialog, @$location) ->

  showDialog: (title, body, path) ->
    btns = [
      result: "ok"
      label: "OK"
      cssClass: "btn-app"
    ]
    @$dialog.messageBox(title, body, btns).open().then(=> if path is "reload" then location.reload() else @$location.url(path))

  showHTMLDialog: (template, controller) ->
    @$dialog.dialog({backdrop: true, keyboard: true, controller: controller, template: template}).open()

  showConfirmation: (body) ->
    btns = [
      result: "cancel"
      label: "Cancel"
    ,
      result: "ok"
      label: "OK"
      cssClass: "btn-primary"
    ]
    result = undefined
    @$dialog.messageBox("Are you sure?", body, btns).open()

angular.module "webApp.dialogService", [], ($provide) ->
  $provide.factory "dialogService", ["$dialog", "$location", ($dialog, $location) -> new DialogService($dialog, $location)]
