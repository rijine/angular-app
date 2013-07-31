(function() {
  "use strict";
  var CalendarCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CalendarCtrl = (function() {
    function CalendarCtrl($scope, $location, $routeParams, $dialog, storageService, webService, dialogService) {
      var _this = this;

      this.$scope = $scope;
      this.$location = $location;
      this.$routeParams = $routeParams;
      this.$dialog = $dialog;
      this.storageService = storageService;
      this.webService = webService;
      this.dialogService = dialogService;
      this.closeCalEntry = __bind(this.closeCalEntry, this);
      this.$scope.page = "calendar";
      this.$scope.closeCalEntry = this.closeCalEntry;
      $scope.eventSource = {
        url: this.webService.getCalendar(),
        headers: {
          "X-User": this.storageService.get("username"),
          "X-Password": this.storageService.get("password")
        },
        dataFilter: function(data) {
          if (ENCRYPTION) {
            return Cryptographer.decrypt(data);
          } else {
            return data;
          }
        }
      };
      this.$scope.alertEventOnClick = function(date, allDay, jsEvent, view) {
        var _this = this;

        return $scope.$apply(function() {
          var template;

          template = "<div class=\"modal-header\">\n  <h1>Calendar Entry</h1>\n</div>\n<div class=\"modal-body\">\n  <table class=\"table\">\n    <tbody>\n      <tr>\n        <td>Account Name:</td><td>" + date.accountName + "</td>\n</tr>\n<tr>\n  <td>Title:</td><td>" + date.title + "</td>\n</tr>\n<tr>\n  <td>Details:</td><td>" + date.details + "</td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn-app\" ng-click=\"closeCalEntry()\">Close</button>\n</div>";
          return $dialog.dialog({
            backdrop: false,
            keyboard: true,
            controller: 'CalendarCtrl',
            template: template
          }).open();
        });
      };
      this.$scope.uiConfig = {
        calendar: {
          height: 600,
          editable: true,
          header: {
            left: 'prev, next, today',
            center: 'title'
          },
          eventClick: $scope.alertEventOnClick
        }
      };
      this.$scope.eventSources = [$scope.eventSource];
    }

    CalendarCtrl.prototype.closeCalEntry = function() {
      return $(".modal").fadeOut();
    };

    return CalendarCtrl;

  })();

  CalendarCtrl.$inject = ["$scope", "$location", "$routeParams", "$dialog", "storageService", "webService", "dialogService"];

  angular.module("webApp").controller("CalendarCtrl", CalendarCtrl);

}).call(this);
