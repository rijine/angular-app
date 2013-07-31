(function() {
  "use strict";
  var DialogService;

  DialogService = (function() {
    function DialogService($dialog, $location) {
      this.$dialog = $dialog;
      this.$location = $location;
    }

    DialogService.prototype.showDialog = function(title, body, path) {
      var btns,
        _this = this;

      btns = [
        {
          result: "ok",
          label: "OK",
          cssClass: "btn-app"
        }
      ];
      return this.$dialog.messageBox(title, body, btns).open().then(function() {
        if (path === "reload") {
          return location.reload();
        } else {
          return _this.$location.url(path);
        }
      });
    };

    DialogService.prototype.showHTMLDialog = function(template, controller) {
      return this.$dialog.dialog({
        backdrop: true,
        keyboard: true,
        controller: controller,
        template: template
      }).open();
    };

    DialogService.prototype.showConfirmation = function(body) {
      var btns, result;

      btns = [
        {
          result: "cancel",
          label: "Cancel"
        }, {
          result: "ok",
          label: "OK",
          cssClass: "btn-primary"
        }
      ];
      result = void 0;
      return this.$dialog.messageBox("Are you sure?", body, btns).open();
    };

    return DialogService;

  })();

  angular.module("webApp.dialogService", [], function($provide) {
    return $provide.factory("dialogService", [
      "$dialog", "$location", function($dialog, $location) {
        return new DialogService($dialog, $location);
      }
    ]);
  });

}).call(this);
