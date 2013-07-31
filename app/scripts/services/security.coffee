"use strict"

class SecurityService

  constructor: (@storageService, @$dialog) ->

  isSecure: ->
    lastAccessed = @storageService.getDecrypted("lastAccessed", ENCRYPTION_KEY)
    return false unless lastAccessed
    now = moment(moment().format("MMMM DD YYYY hh:mm:ss"), "MMMM DD YYYY hh:mm:ss")
    allowance = moment(lastAccessed, "MMMM DD YYYY hh:mm:ss").add('m', 15)
    if now.isAfter(allowance)
      @showDialog()
    else
      true

  showDialog: ->
    template = """
      <div class="modal-header">
        <h1>Please Unlock Application</h1>
      </div>
      <div class="modal-body">
        <form name="unlockForm" class="simple-form" data-ng-submit="unlock(user)">
          <div class="input-append">
            <input type="text" ng-model="user.username" placeholder="Username" required />
            <span class="add-on"><img src="images/uname_icon.png"/></span>
          </div>
          <div class="input-append">
            <input type="password" name="pin" ng-model="user.pin" placeholder="Security Pin" ng-maxlength="4" ng-minlength="4" ng-pattern="/^[0-9]{4}$/" required />
            <span class="add-on"><img src="images/password_icon.png"/></span>
          </div>
          <input class="btn-app" type="submit" value="Unlock">
        </form>
      </div>
      <div class="modal-footer"></div>
      """
    @$dialog.dialog({controller: 'SecurityCtrl', backdrop: true, backdropClick: false, keyboard: false, backdropFade: true, template: template}).open()



angular.module "webApp.securityService", [], ($provide) ->
  $provide.factory "securityService", ["storageService", "$dialog", (storageService, $dialog) -> new SecurityService(storageService, $dialog)]
