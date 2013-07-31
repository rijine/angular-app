"use strict"

class CalendarCtrl

  constructor: (@$scope, @$location, @$routeParams, @$dialog, @storageService, @webService, @dialogService) ->
    @$scope.page = "calendar"
    @$scope.closeCalEntry = @closeCalEntry

    $scope.eventSource =
      url: @webService.getCalendar()
      headers: {"X-User": @storageService.get("username"), "X-Password": @storageService.get("password")}
      dataFilter: (data) => if ENCRYPTION then Cryptographer.decrypt(data) else data


    @$scope.alertEventOnClick = (date, allDay, jsEvent, view) ->
      $scope.$apply =>
        template = 
          """
            <div class="modal-header">
              <h1>Calendar Entry</h1>
            </div>
            <div class="modal-body">
              <table class="table">
                <tbody>
                  <tr>
                    <td>Account Name:</td><td>""" + date.accountName + """</td>
                  </tr>
                  <tr>
                    <td>Title:</td><td>""" + date.title + """</td>
                  </tr>
                  <tr>
                    <td>Details:</td><td>""" + date.details + """</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="modal-footer">
              <button class="btn-app" ng-click="closeCalEntry()">Close</button>
            </div>
          """
        $dialog.dialog({backdrop: false, keyboard: true, controller: 'CalendarCtrl', template: template}).open()

    @$scope.uiConfig = calendar:
      height: 600
      editable: true
      header:
        left: 'prev, next, today'
        center: 'title'
      eventClick: $scope.alertEventOnClick
      #loading: (isLoading) => @$scope.isLoading = isLoading

    @$scope.eventSources = [$scope.eventSource]

  closeCalEntry: () =>
    $(".modal").fadeOut() #hack but works


CalendarCtrl.$inject = ["$scope", "$location", "$routeParams", "$dialog", "storageService", "webService", "dialogService"]
angular.module("webApp").controller "CalendarCtrl", CalendarCtrl