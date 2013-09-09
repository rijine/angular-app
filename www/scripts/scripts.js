(function() {
  'use strict';  angular.module("webApp", ["webApp.encryptionService", "webApp.storageService", "webApp.securityService", "webApp.webService", "webApp.uuidService", "ui.calendar", "ui.date", "ui.bootstrap", "webApp.dialogService"]).config(function($routeProvider) {
    return $routeProvider.when("/", {
      templateUrl: "views/login.html",
      controller: "LoginCtrl"
    }).when("/disclaimer", {
      templateUrl: "views/disclaimer.html",
      controller: "NavigationCtrl"
    }).when("/main", {
      templateUrl: "views/main.html",
      controller: "NavigationCtrl"
    }).when("/accounts", {
      templateUrl: "views/accounts.html",
      controller: "AccountsCtrl"
    }).when("/accounts/:accountId/:subpage", {
      templateUrl: "views/accounts.html",
      controller: "AccountsCtrl"
    }).when("/plan", {
      templateUrl: "views/plan.html",
      controller: "PlanCtrl"
    }).when("/plan/:accountId/:subpage", {
      templateUrl: "views/plan.html",
      controller: "PlanCtrl"
    }).when("/calendar", {
      templateUrl: "views/calendar.html",
      controller: "CalendarCtrl"
    }).when("/performance", {
      templateUrl: "views/performance.html",
      controller: "PerformanceCtrl"
    }).when("/library", {
      templateUrl: "views/library.html",
      controller: "LibraryCtrl"
    }).otherwise({
      redirectTo: "/"
    });
  }).config(function($httpProvider) {
    $httpProvider.responseInterceptors.push(function() {
      return function(promise) {
        return promise.then(function(response) {
          if (!response.data) {
            return {};
          }
          if (response.data.Message === "Authentication Successful.") {
            return {};
          }
          if (response.config.url.indexOf("http://") !== -1 || response.config.url.indexOf("https://") !== -1) {
            if (ENCRYPTION) {
              response.data = JSON.parse(Cryptographer.decrypt(response.data));
            }
            return response;
          }
          return response;
        });
      };
    });
    return $httpProvider.defaults.transformRequest.push(function(d) {
      if (ENCRYPTION) {
        if (d) {
          return Cryptographer.encrypt(d);
        } else {
          return d;
        }
      }
    });
  });

}).call(this);

(function() {
  "use strict";
  var AccountsCtrl;

  AccountsCtrl = (function() {
    function AccountsCtrl($scope, $location, $routeParams, $http, storageService, webService, encryptionService) {
      var promise;

      this.$scope = $scope;
      this.$location = $location;
      this.$routeParams = $routeParams;
      this.$http = $http;
      this.storageService = storageService;
      this.webService = webService;
      this.encryptionService = encryptionService;
      this.$scope.page = "accounts";
      this.$scope.isLoading = true;
      promise = this.webService.getAccounts();
      this.setScope(promise);
    }

    AccountsCtrl.prototype.setScope = function(promise) {
      var _this = this;

      return promise.then(function(success) {
        var promiseBB;

        _this.$scope.accounts = success.data;
        _this.$scope.accountId = _this.$routeParams.accountId ? _this.$routeParams.accountId : _this.$scope.accounts[0].id;
        _this.$scope.subpage = _this.$routeParams.subpage ? _this.$routeParams.subpage : "Company Profile";
        _this.$scope.accountDetails = _this.getDataForAccount(_this.$scope.accounts, _this.$scope.accountId);
        promiseBB = _this.webService.getBuyingBehavior();
        return _this.setBuyingBehaviorScope(promiseBB);
      }, function(error) {
        return console.log(error);
      });
    };

    AccountsCtrl.prototype.setBuyingBehaviorScope = function(promiseBB) {
      var _this = this;

      return promiseBB.then(function(suss) {
        var buyingBehavior;

        buyingBehavior = suss.data;
        _this.$scope.buyingBehavior = _.find(buyingBehavior, function(obj) {
          return obj.accountId.toString() === _this.$scope.accountId.toString();
        });
        return _this.$scope.isLoading = false;
      }, function(err) {
        return console.log(err);
      });
    };

    AccountsCtrl.prototype.getDataForAccount = function(data, accountid) {
      return _.find(data, function(obj) {
        return obj.id.toString() === accountid.toString();
      });
    };

    return AccountsCtrl;

  })();

  AccountsCtrl.$inject = ["$scope", "$location", "$routeParams", "$http", "storageService", "webService", "encryptionService"];

  angular.module("webApp").controller("AccountsCtrl", AccountsCtrl);

}).call(this);

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

(function() {
  "use strict";
  var LibraryCtrl;

  LibraryCtrl = (function() {
    function LibraryCtrl($scope, $location, $routeParams, storageService) {
      this.$scope = $scope;
      this.$location = $location;
      this.$routeParams = $routeParams;
      this.storageService = storageService;
      this.$scope.page = "library";
    }

    return LibraryCtrl;

  })();

  LibraryCtrl.$inject = ["$scope", "$location", "$routeParams", "storageService"];

  angular.module("webApp").controller("LibraryCtrl", LibraryCtrl);

}).call(this);

(function() {
  "use strict";
  var LoginCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  LoginCtrl = (function() {
    function LoginCtrl($scope, $http, $location, storageService, webService, dialogService) {
      this.$scope = $scope;
      this.$http = $http;
      this.$location = $location;
      this.storageService = storageService;
      this.webService = webService;
      this.dialogService = dialogService;
      this.login = __bind(this.login, this);
      this.$scope.login = this.login;
      this.$scope.close = this.close;
    }

    LoginCtrl.prototype.login = function() {
      var promise,
        _this = this;

      this.$scope.isLoading = true;
      if (this.$scope.user.pin) {
        promise = this.webService.authenticate(this.$scope.user.username, this.$scope.user.password);
        return promise.then(function(success) {
          _this.$scope.isLoading = false;
          _this.storageService.storeEncrypted("pin", _this.$scope.user.pin, _this.$scope.user.username);
          _this.storageService.storeEncrypted("lastAccessed", moment().format("MMMM DD YYYY hh:mm:ss"));
          _this.storageService.storeEncrypted("username", _this.$scope.user.username);
          _this.storageService.storeEncrypted("password", _this.$scope.user.password);
          return _this.$location.url("disclaimer");
        }, function(error) {
          _this.$scope.isLoading = false;
          return _this.$scope.message = "Error : " + error.data.Message;
        });
      } else {
        return this.dialogService.showDialog("Error", "Security Pin should be a 4 digit number", "login");
      }
    };

    return LoginCtrl;

  })();

  LoginCtrl.$inject = ["$scope", "$http", "$location", "storageService", "webService", "dialogService"];

  angular.module("webApp").controller("LoginCtrl", LoginCtrl);

}).call(this);

(function() {
  "use strict";
  var NavigationCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  NavigationCtrl = (function() {
    function NavigationCtrl($scope, $location, $routeParams, storageService, securityService) {
      this.$scope = $scope;
      this.$location = $location;
      this.$routeParams = $routeParams;
      this.storageService = storageService;
      this.securityService = securityService;
      this.close = __bind(this.close, this);
      this.logout = __bind(this.logout, this);
      if (this.securityService.isSecure()) {
        this.$scope.logout = this.logout;
        this.$scope.close = this.close;
        this.$scope.username = this.storageService.getDecrypted("username");
      } else {
        this.logout();
      }
    }

    NavigationCtrl.prototype.logout = function() {
      this.storageService.logout();
      return this.$location.url("/");
    };

    NavigationCtrl.prototype.close = function() {
      return this.$location.url("main");
    };

    return NavigationCtrl;

  })();

  NavigationCtrl.$inject = ["$scope", "$location", "$routeParams", "storageService", "securityService"];

  angular.module("webApp").controller("NavigationCtrl", NavigationCtrl);

}).call(this);

(function() {
  "use strict";
  var PerformanceCtrl;

  PerformanceCtrl = (function() {
    function PerformanceCtrl($scope, $location, $routeParams, storageService, webService) {
      var promise;

      this.$scope = $scope;
      this.$location = $location;
      this.$routeParams = $routeParams;
      this.storageService = storageService;
      this.webService = webService;
      this.$scope.page = "performance";
      promise = this.webService.getSalesVolume();
      this.setScope(promise);
    }

    PerformanceCtrl.prototype.setScope = function(promise) {
      var _this = this;

      return promise.then(function(success) {
        return _this.$scope.salesVolume = success.data;
      }, function(error) {
        return console.log(error);
      });
    };

    return PerformanceCtrl;

  })();

  PerformanceCtrl.$inject = ["$scope", "$location", "$routeParams", "storageService", "webService"];

  angular.module("webApp").controller("PerformanceCtrl", PerformanceCtrl);

}).call(this);

(function() {
  "use strict";
  var PlanCtrl;

  PlanCtrl = function($scope, $location, $routeParams, $http, storageService, webService, uuidService, dialogService) {
    var actionPlan, checkResults, customerInteraction, getAccountData, getDataForAccount, getLocallyStoredData, setData;

    $scope.page = "plan";
    $scope.isSyncing = true;
    $scope.addPlan = function(plan) {
      actionPlan.valueProposition = plan.valueProposition;
      actionPlan.issue = plan.issue;
      actionPlan.type = "actionPlans";
      return $scope.showItems = true;
    };
    $scope.addInteraction = function(interaction) {
      customerInteraction.meetingDate = interaction.meetingDate;
      customerInteraction.personMet = interaction.personMet;
      customerInteraction.startTime = interaction.startTime;
      customerInteraction.endTime = interaction.endTime;
      customerInteraction.meetingObjective = interaction.meetingObjective;
      customerInteraction.meetingResult = interaction.meetingResult;
      customerInteraction.type = "interactions";
      return $scope.showPoints = true;
    };
    $scope.addItems = function(item) {
      if (!item.status) {
        item.status = "green";
      }
      actionPlan.actionPlanItems.push({
        actionItem: item.actionItem,
        decisionMaker: item.decisionMaker,
        dueDate: item.dueDate,
        pic: item.pic,
        nextStep: item.nextStep,
        status: item.status
      });
      $scope.actionPlanItems.push({
        actionItem: item.actionItem,
        decisionMaker: item.decisionMaker,
        dueDate: item.dueDate,
        pic: item.pic,
        nextStep: item.nextStep,
        status: item.status
      });
      return $scope.$$childTail.$$prevSibling.item = {};
    };
    $scope.addMainPoint = function(mainPoint) {
      customerInteraction.mainPoints.push({
        point: mainPoint.point,
        nextStep: mainPoint.nextStep,
        pic: mainPoint.pic
      });
      $scope.mainPoints.push({
        point: mainPoint.point,
        nextStep: mainPoint.nextStep,
        pic: mainPoint.pic
      });
      return $scope.$$childTail.mainPoint = {};
    };
    $scope.savePlan = function() {
      var uuid;

      uuid = uuidService.getUUID();
      actionPlan.uniqueId = uuid;
      actionPlan.accountId = $scope.accountId;
      storageService.storeEncrypted(uuid, JSON.stringify(actionPlan));
      return dialogService.showDialog("Plan Saved", "Plan saved successfully.", "plan/" + $scope.accountId + "/Action Plan");
    };
    $scope.saveInteraction = function() {
      var uuid;

      uuid = uuidService.getUUID();
      customerInteraction.uniqueId = uuid;
      customerInteraction.accountId = $scope.accountId;
      storageService.storeEncrypted(uuid, JSON.stringify(customerInteraction));
      return dialogService.showDialog("Interaction Saved", "Interaction saved successfully.", "plan/" + $scope.accountId + "/Customer Interaction");
    };
    $scope.deletePlanOrInteraction = function(id, type) {
      var remoteId, result;

      $scope.isSyncing = true;
      result = dialogService.showConfirmation("Are you sure you want to delete?");
      if (id.substr(0, 10) === "pert-uuid-") {
        remoteId = id.substr(10, id.length);
      }
      if (id.substr(0, 10) !== "pert-uuid-") {
        remoteId = id;
      }
      return result.then(function(response) {
        var promise;

        if (response.toString() === "ok") {
          if (type === "actionPlan") {
            promise = webService.deletePlan(remoteId);
          }
          if (type === "interaction") {
            promise = webService.deleteInteraction(remoteId);
          }
          return promise.then(function(success) {
            if (storageService.get("pert-uuid-" + remoteId)) {
              storageService.deleteItem("pert-uuid-" + remoteId);
            }
            return dialogService.showDialog("Success", "Item deleted successfully.", "reload");
          }, function(error) {
            return alert("Could not connect to network. Please try again later.");
          });
        } else {
          return $scope.isSyncing = false;
        }
      });
    };
    $scope.sync = function() {
      var actionPlan, actionPlans, interaction, interactions, localData, promise, results, _i, _j, _len, _len1,
        _this = this;

      $scope.isSyncing = true;
      localData = getLocallyStoredData($scope.accountId);
      actionPlans = localData.localActionPlans;
      interactions = localData.localInteractions;
      results = [];
      if (actionPlans.length > 0) {
        for (_i = 0, _len = actionPlans.length; _i < _len; _i++) {
          actionPlan = actionPlans[_i];
          actionPlan.uniqueId = actionPlan.uniqueId.substr(10, actionPlan.uniqueId.length);
          promise = webService.postPlan(actionPlan);
          promise.then(function(success) {
            results.push({
              ok: true
            });
            return checkResults(results, actionPlans, interactions);
          }, function(error) {
            return dialogService.showDialog("Sync Failed", "Please try again when network is available.", "reload");
          });
        }
      }
      if (interactions.length > 0) {
        for (_j = 0, _len1 = interactions.length; _j < _len1; _j++) {
          interaction = interactions[_j];
          interaction.uniqueId = interaction.uniqueId.substr(10, interaction.uniqueId.length);
          promise = webService.postInteraction(interaction);
          promise.then(function(success) {
            results.push({
              ok: true
            });
            return checkResults(results, actionPlans, interactions);
          }, function(error) {
            return dialogService.showDialog("Sync Failed!", "Please try again when network is available.", "reload");
          });
        }
      }
      return checkResults(results, actionPlans, interactions);
    };
    checkResults = function(results, actionPlans, interactions) {
      console.log(results);
      if (_.where(results, {
        ok: false
      }).length > 0) {
        dialogService.showDialog("Sync Failed", "Please try again when network is available.", "reload");
      }
      if (results.length === actionPlans.length + interactions.length) {
        return dialogService.showDialog("Success", "Sync succeeded.", "reload");
      }
    };
    getLocallyStoredData = function(accountId) {
      var actionPlans, actionPlansForThisAccount, interactions, interactionsForThisAccount, localData;

      actionPlansForThisAccount = [];
      interactionsForThisAccount = [];
      localData = storageService.getLocallyStoredRecords();
      if (localData.length > 0) {
        actionPlans = _.filter(localData, function(obj) {
          return obj.type && obj.type.toString() === "actionPlans";
        });
        interactions = _.filter(localData, function(obj) {
          return obj.type && obj.type.toString() === "interactions";
        });
        if (actionPlans.length > 0) {
          actionPlansForThisAccount = _.filter(actionPlans, function(obj) {
            return obj.accountId.toString() === accountId.toString();
          });
        }
        if (interactions.length > 0) {
          interactionsForThisAccount = _.filter(interactions, function(obj) {
            return obj.accountId.toString() === accountId.toString();
          });
        }
      }
      return {
        localActionPlans: actionPlansForThisAccount,
        localInteractions: interactionsForThisAccount
      };
    };
    getDataForAccount = function(data, accountId) {
      var actionPlansForThisAccount, interactionsForThisAccount, localData, serverData;

      serverData = _.find(data, function(obj) {
        return obj.id.toString() === accountId.toString();
      });
      _.each(serverData.actionPlans, function(obj) {
        if (storageService.get("pert-uuid-" + obj.uniqueId)) {
          return storageService.deleteItem("pert-uuid-" + obj.uniqueId);
        }
      });
      _.each(serverData.interactions, function(obj) {
        if (storageService.get("pert-uuid-" + obj.uniqueId)) {
          return storageService.deleteItem("pert-uuid-" + obj.uniqueId);
        }
      });
      localData = getLocallyStoredData(accountId);
      actionPlansForThisAccount = localData.localActionPlans;
      interactionsForThisAccount = localData.localInteractions;
      serverData.actionPlan = _.union(serverData.actionPlans, actionPlansForThisAccount);
      serverData.interactions = _.union(serverData.interactions, interactionsForThisAccount);
      return serverData;
    };
    setData = function() {
      $scope.accountId = $routeParams.accountId ? $routeParams.accountId : $scope.accounts[0].id;
      $scope.subpage = $routeParams.subpage ? $routeParams.subpage : "Action Plan";
      return $scope.accountDetails = getDataForAccount($scope.accounts, $scope.accountId);
    };
    getAccountData = function() {
      var promise,
        _this = this;

      promise = webService.getActionPlan();
      return promise.then(function(success) {
        $scope.accounts = success.data;
        setData();
        storageService.storeEncrypted("action_plan", JSON.stringify($scope.accounts));
        return $scope.isSyncing = false;
      }, function(error) {
        $scope.accounts = JSON.parse(storageService.getDecrypted("action_plan"));
        setData();
        return $scope.isSyncing = false;
      });
    };
    actionPlan = {};
    actionPlan.actionPlanItems = [];
    $scope.showItems = false;
    $scope.actionPlanItems = [];
    customerInteraction = {};
    customerInteraction.mainPoints = [];
    $scope.showPoints = false;
    $scope.mainPoints = [];
    return getAccountData();
  };

  PlanCtrl.$inject = ["$scope", "$location", "$routeParams", "$http", "storageService", "webService", "uuidService", "dialogService"];

  angular.module("webApp").controller("PlanCtrl", PlanCtrl);

}).call(this);

(function() {
  "use strict";
  var SecurityCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  SecurityCtrl = (function() {
    function SecurityCtrl($scope, $location, $routeParams, storageService, encryptionService) {
      this.$scope = $scope;
      this.$location = $location;
      this.$routeParams = $routeParams;
      this.storageService = storageService;
      this.encryptionService = encryptionService;
      this.unlock = __bind(this.unlock, this);
      this.$scope.unlock = this.unlock;
    }

    SecurityCtrl.prototype.unlock = function() {
      if (this.storageService.get("pin") === this.encryptionService.encrypt(this.$scope.user.pin, this.$scope.user.username)) {
        this.storageService.storeEncrypted("lastAccessed", moment().format("MMMM DD YYYY hh:mm:ss"));
        return location.reload();
      } else {
        this.storageService.logout();
        return this.$location.url("/");
      }
    };

    return SecurityCtrl;

  })();

  SecurityCtrl.$inject = ["$scope", "$location", "$routeParams", "storageService", "encryptionService"];

  angular.module("webApp").controller("SecurityCtrl", SecurityCtrl);

}).call(this);

(function() {
  "use strict";
  var HistoricalRevenueChart, HistoricalSalesChart;

  HistoricalSalesChart = (function() {
    function HistoricalSalesChart() {}

    HistoricalSalesChart.options = function() {
      return {
        template: '<canvas width="600%" height="200%"></canvas>',
        replace: true,
        link: function(scope, element, attrs) {
          var drawGraph;

          drawGraph = function() {
            var chart, ctx, data;

            data = {
              labels: scope.buyingBehavior.labels,
              datasets: [
                {
                  fillColor: "rgba(16,115,184,0.5)",
                  strokeColor: "rgba(16,115,184,1)",
                  data: scope.buyingBehavior.sales[0]
                }, {
                  fillColor: "rgba(211,28,39,0.5)",
                  strokeColor: "rgba(211,28,39,1)",
                  data: scope.buyingBehavior.sales[1]
                }, {
                  fillColor: "rgba(102,200,61,0.5)",
                  strokeColor: "rgba(102,200,61,1)",
                  data: scope.buyingBehavior.sales[2]
                }
              ]
            };
            ctx = $("." + attrs["class"]).get(0).getContext("2d");
            return chart = new Chart(ctx).Bar(data, {
              scaleShowGridLines: false
            });
          };
          return scope.$watch('buyingBehavior', function(n, o) {
            if (n) {
              return drawGraph();
            }
          });
        }
      };
    };

    return HistoricalSalesChart;

  })();

  HistoricalRevenueChart = (function() {
    function HistoricalRevenueChart() {}

    HistoricalRevenueChart.options = function() {
      return {
        template: '<canvas width="600%" height="200%"></canvas>',
        replace: true,
        link: function(scope, element, attrs) {
          var drawGraph;

          drawGraph = function() {
            var chart, ctx, data;

            data = {
              labels: scope.buyingBehavior.labels,
              datasets: [
                {
                  fillColor: "rgba(16,115,184,0.5)",
                  strokeColor: "rgba(16,115,184,1)",
                  data: scope.buyingBehavior.revenues[0]
                }, {
                  fillColor: "rgba(211,28,39,0.5)",
                  strokeColor: "rgba(211,28,39,1)",
                  data: scope.buyingBehavior.revenues[1]
                }, {
                  fillColor: "rgba(102,200,61,0.5)",
                  strokeColor: "rgba(102,200,61,1)",
                  data: scope.buyingBehavior.revenues[2]
                }
              ]
            };
            ctx = $("." + attrs["class"]).get(0).getContext("2d");
            ctx.canvas.width = 820;
            return chart = new Chart(ctx).Bar(data, {
              scaleShowGridLines: false
            });
          };
          return scope.$watch('buyingBehavior', function(n, o) {
            if (n) {
              return drawGraph();
            }
          });
        }
      };
    };

    return HistoricalRevenueChart;

  })();

  angular.module("webApp").directive("historicalSalesChart", HistoricalSalesChart.options);

  angular.module("webApp").directive("historicalRevenueChart", HistoricalRevenueChart.options);

}).call(this);

(function() {
  "use strict";  angular.module("webApp").directive("myAnimatedView", function($http, $templateCache, $route, $anchorScroll, $compile, $controller) {
    return {
      restrict: "ECA",
      terminal: true,
      link: function(scope, element, attr) {
        var clearContent, destroyLastScope, lastScope, onloadExp, update;

        destroyLastScope = function() {
          var lastScope;

          if (lastScope) {
            lastScope.$destroy();
            return lastScope = null;
          }
        };
        clearContent = function() {
          element.html("");
          return destroyLastScope();
        };
        update = function() {
          var animation, childElem, controller, current, lastScope, link, locals, template;

          locals = $route.current && $route.current.locals;
          template = locals && locals.$template;
          if (template) {
            element.html(template);
            animation = "animated fadeInRight";
            childElem = angular.element(element.children()[0]);
            if (childElem.hasClass(animation)) {
              childElem.removeClass(animation);
            }
            childElem.addClass(animation);
            destroyLastScope();
            link = $compile(element.contents());
            current = $route.current;
            controller = void 0;
            lastScope = current.scope = scope.$new();
            if (current.controller) {
              locals.$scope = lastScope;
              controller = $controller(current.controller, locals);
              element.children().data("$ngControllerController", controller);
            }
            link(lastScope);
            lastScope.$emit("$viewContentLoaded");
            lastScope.$eval(onloadExp);
            return $anchorScroll();
          } else {
            return clearContent();
          }
        };
        lastScope = void 0;
        onloadExp = attr.onload || "";
        scope.$on("$routeChangeSuccess", update);
        return update();
      }
    };
  });

}).call(this);

(function() {
  "use strict";
  var MyCurrentTime;

  MyCurrentTime = (function() {
    function MyCurrentTime() {}

    MyCurrentTime.options = function() {
      return {
        link: function(scope, element, attrs) {
          return element.html(new Date());
        }
      };
    };

    return MyCurrentTime;

  })();

  angular.module("webApp").directive("myCurrentTime", MyCurrentTime.options);

}).call(this);

(function() {
  "use strict";
  var WaterfallChart;

  WaterfallChart = (function() {
    function WaterfallChart() {}

    WaterfallChart.options = function() {
      return {
        link: function(scope, element, attrs) {
          var line1, plot1, ticks;

          line1 = [14, 3, 4, -3, 5, 2, -3, -7];
          ticks = ["2008", "Apricots", "Tomatoes", "Potatoes", "Rhubarb", "Squash", "Grapes", "Peanuts", "2009"];
          return plot1 = $.jqplot("wf-chart", [line1], {
            title: "Dummy Data",
            seriesColors: ["#E98E93", "#E98E93"],
            grid: {
              drawGridLines: true,
              background: "#FFFFFF",
              borderColor: '#FFFFFF',
              borderWidth: 1,
              shadow: false
            },
            seriesDefaults: {
              renderer: $.jqplot.BarRenderer,
              shadow: false,
              rendererOptions: {
                waterfall: true,
                varyBarColor: false
              },
              pointLabels: {
                hideZeros: true
              },
              yaxis: "yaxis"
            },
            axes: {
              xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks,
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: {
                  angle: 0,
                  fontSize: "10pt",
                  showMark: false,
                  showGridline: false
                }
              },
              y2axis: {
                min: 0,
                tickInterval: 5
              }
            }
          });
        }
      };
    };

    return WaterfallChart;

  })();

  angular.module("webApp").directive("waterfallChart", WaterfallChart.options);

}).call(this);

(function() {
  "use strict";
  var PocketMarginsChart, SalesVolumeChart;

  SalesVolumeChart = (function() {
    function SalesVolumeChart() {}

    SalesVolumeChart.options = function() {
      return {
        template: '<canvas width="900%" height="180%"></canvas>',
        replace: true,
        link: function(scope, element, attrs) {
          var calculate_scale, drawGraph;

          calculate_scale = function(data) {
            var max, min, rangeOrderOfMagnitude, stepValue;

            max = _.max(data);
            min = _.min(data);
            rangeOrderOfMagnitude = Math.floor(Math.log(max - min) / Math.LN10);
            stepValue = Math.pow(10, rangeOrderOfMagnitude);
            return {
              noOfSteps: Math.ceil(max / stepValue),
              stepWidth: stepValue
            };
          };
          drawGraph = function() {
            var chart, ctx, data, sales_volume, scale;

            sales_volume = scope.salesVolume;
            data = {
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "YTD", "Target"],
              datasets: [
                {
                  fillColor: "rgba(205,205,205,0.8)",
                  strokeColor: "rgba(205,205,205,1)",
                  data: sales_volume
                }
              ]
            };
            ctx = $("." + attrs["class"]).get(0).getContext("2d");
            scale = calculate_scale(sales_volume);
            return chart = new Chart(ctx).Waterfall(data, {
              scaleShowGridLines: false,
              animation: true,
              scaleOverride: true,
              scaleStartValue: 0,
              scaleSteps: scale.noOfSteps,
              scaleStepWidth: scale.stepWidth
            });
          };
          return scope.$watch("salesVolume", function(n, o) {
            if (n) {
              return drawGraph();
            }
          });
        }
      };
    };

    return SalesVolumeChart;

  })();

  PocketMarginsChart = (function() {
    function PocketMarginsChart() {}

    PocketMarginsChart.options = function() {
      return {
        template: '<canvas width="900%" height="180%"></canvas>',
        replace: true,
        link: function(scope, element, attrs) {
          var chart, ctx, data;

          data = {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
              {
                fillColor: "rgba(205,205,205,0.8)",
                strokeColor: "rgba(205,205,205,1)",
                data: [10, 12, 13, 14, 15, 16, 17, 18, 10, 11, 12, 13]
              }
            ]
          };
          ctx = $("." + attrs["class"]).get(0).getContext("2d");
          ctx.canvas.width = 800;
          return chart = new Chart(ctx).Bar(data, {
            scaleShowGridLines: false,
            scaleOverride: true,
            scaleStartValue: 0,
            scaleSteps: 5,
            scaleStepWidth: 5
          });
        }
      };
    };

    return PocketMarginsChart;

  })();

  angular.module("webApp").directive("salesVolumeChart", SalesVolumeChart.options);

  angular.module("webApp").directive("pocketMarginsChart", PocketMarginsChart.options);

}).call(this);

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

(function() {
  "use strict";
  var EncryptionService;

  EncryptionService = (function() {
    function EncryptionService() {}

    EncryptionService.prototype.decrypt = function(encryptedText, key) {
      if (key == null) {
        key = ENCRYPTION_KEY;
      }
      return Cryptographer.decrypt(encryptedText, key);
    };

    EncryptionService.prototype.encrypt = function(plainText, key) {
      if (key == null) {
        key = ENCRYPTION_KEY;
      }
      return Cryptographer.encrypt(plainText, key);
    };

    return EncryptionService;

  })();

  angular.module("webApp.encryptionService", [], function($provide) {
    return $provide.factory("encryptionService", function() {
      return new EncryptionService();
    });
  });

}).call(this);

(function() {
  "use strict";
  var SecurityService;

  SecurityService = (function() {
    function SecurityService(storageService, $dialog) {
      this.storageService = storageService;
      this.$dialog = $dialog;
    }

    SecurityService.prototype.isSecure = function() {
      var allowance, lastAccessed, now;

      lastAccessed = this.storageService.getDecrypted("lastAccessed", ENCRYPTION_KEY);
      if (!lastAccessed) {
        return false;
      }
      now = moment(moment().format("MMMM DD YYYY hh:mm:ss"), "MMMM DD YYYY hh:mm:ss");
      allowance = moment(lastAccessed, "MMMM DD YYYY hh:mm:ss").add('m', 15);
      if (now.isAfter(allowance)) {
        return this.showDialog();
      } else {
        return true;
      }
    };

    SecurityService.prototype.showDialog = function() {
      var template;

      template = "<div class=\"modal-header\">\n  <h1>Please Unlock Application</h1>\n</div>\n<div class=\"modal-body\">\n  <form name=\"unlockForm\" class=\"simple-form\" data-ng-submit=\"unlock(user)\">\n    <div class=\"input-append\">\n      <input type=\"text\" ng-model=\"user.username\" placeholder=\"Username\" required />\n      <span class=\"add-on\"><img src=\"images/uname_icon.png\"/></span>\n    </div>\n    <div class=\"input-append\">\n      <input type=\"password\" name=\"pin\" ng-model=\"user.pin\" placeholder=\"Security Pin\" ng-maxlength=\"4\" ng-minlength=\"4\" ng-pattern=\"/^[0-9]{4}$/\" required />\n      <span class=\"add-on\"><img src=\"images/password_icon.png\"/></span>\n    </div>\n    <input class=\"btn-app\" type=\"submit\" value=\"Unlock\">\n  </form>\n</div>\n<div class=\"modal-footer\"></div>";
      return this.$dialog.dialog({
        controller: 'SecurityCtrl',
        backdrop: true,
        backdropClick: false,
        keyboard: false,
        backdropFade: true,
        template: template
      }).open();
    };

    return SecurityService;

  })();

  angular.module("webApp.securityService", [], function($provide) {
    return $provide.factory("securityService", [
      "storageService", "$dialog", function(storageService, $dialog) {
        return new SecurityService(storageService, $dialog);
      }
    ]);
  });

}).call(this);

(function() {
  "use strict";
  var StorageService;

  StorageService = (function() {
    function StorageService(encryptionService) {
      this.encryptionService = encryptionService;
    }

    StorageService.prototype.storeEncrypted = function(key, value, eKey) {
      if (eKey == null) {
        eKey = ENCRYPTION_KEY;
      }
      return localStorage.setItem(key, this.encryptionService.encrypt(value, eKey));
    };

    StorageService.prototype.getDecrypted = function(key, eKey) {
      var e;

      if (eKey == null) {
        eKey = ENCRYPTION_KEY;
      }
      e = this.get(key);
      return this.encryptionService.decrypt(e, eKey);
    };

    StorageService.prototype.get = function(key) {
      return localStorage.getItem(key);
    };

    StorageService.prototype.getLocallyStoredRecords = function() {
      var data, index, keyVal, _i, _ref;

      data = [];
      for (index = _i = 0, _ref = localStorage.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; index = 0 <= _ref ? ++_i : --_i) {
        keyVal = localStorage.key(index);
        if (keyVal.substr(0, 10) === "pert-uuid-") {
          data.push(JSON.parse(this.getDecrypted(keyVal)));
        }
      }
      return data;
    };

    StorageService.prototype.deleteItem = function(key) {
      return localStorage.removeItem(key);
    };

    StorageService.prototype.logout = function() {
      localStorage.removeItem("pin");
      localStorage.removeItem("username");
      localStorage.removeItem("lastAccessed");
      return localStorage.removeItem("password");
    };

    return StorageService;

  })();

  angular.module("webApp.storageService", [], function($provide) {
    return $provide.factory("storageService", [
      "encryptionService", function(encryptionService) {
        return new StorageService(encryptionService);
      }
    ]);
  });

}).call(this);

(function() {
  "use strict";
  var UUIDService;

  UUIDService = (function() {
    function UUIDService() {}

    UUIDService.prototype.getUUID = function() {
      var i, random, uuid;

      uuid = "";
      random = void 0;
      i = 0;
      while (i < 32) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += "-";
        }
        uuid += (i === 12 ? 4 : (i === 16 ? random & 3 | 8 : random)).toString(16);
        i++;
      }
      return "pert-uuid-" + uuid;
    };

    return UUIDService;

  })();

  angular.module("webApp.uuidService", [], function($provide) {
    return $provide.factory("uuidService", function() {
      return new UUIDService();
    });
  });

}).call(this);

(function() {
  "use strict";
  var WebService;

  WebService = (function() {
    function WebService($http, $storageService, encryptionService) {
      this.$http = $http;
      this.$storageService = $storageService;
      this.encryptionService = encryptionService;
    }

    WebService.prototype.getCredentails = function() {
      var password, username;

      username = this.$storageService.get("username");
      password = this.$storageService.get("password");
      return [username, password];
    };

    WebService.prototype.getOptions = function() {
      var creds;

      creds = this.getCredentails();
      return this.options = {
        headers: {
          'X-User': creds[0],
          'X-Password': creds[1]
        },
        cache: true
      };
    };

    WebService.prototype.authenticate = function(username, password) {
      var e_pw, e_un, promise, urlService;

      urlService = new URLService();
      e_un = this.encryptionService.encrypt(username);
      e_pw = this.encryptionService.encrypt(password);
      return promise = this.$http.get(urlService.auth(), {
        headers: {
          'X-User': e_un,
          'X-Password': e_pw
        },
        cache: false
      });
    };

    WebService.prototype.getAccounts = function() {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http.get(urlService.account(), this.getOptions());
    };

    WebService.prototype.getBuyingBehavior = function() {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http.get(urlService.buyingbehavior(), this.getOptions());
    };

    WebService.prototype.getActionPlan = function() {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http.get(urlService.actionplan(), this.getOptions());
    };

    WebService.prototype.getCalendar = function() {
      var urlService;

      urlService = new URLService();
      return urlService.calendar();
    };

    WebService.prototype.getSalesVolume = function() {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http.get(urlService.performance(), this.getOptions());
    };

    WebService.prototype.postPlan = function(obj) {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http.post(urlService.postplan(), obj, this.getOptions());
    };

    WebService.prototype.postInteraction = function(obj) {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http.post(urlService.postinteraction(), obj, this.getOptions());
    };

    WebService.prototype.deletePlan = function(id) {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http["delete"](urlService.deletePlan(id), this.getOptions());
    };

    WebService.prototype.deleteInteraction = function(id) {
      var promise, urlService;

      urlService = new URLService();
      return promise = this.$http["delete"](urlService.deleteInteraction(id), this.getOptions());
    };

    return WebService;

  })();

  angular.module("webApp.webService", [], function($provide) {
    return $provide.factory("webService", [
      "$http", "storageService", "encryptionService", function($http, storageService, encryptionService) {
        return new WebService($http, storageService, encryptionService);
      }
    ]);
  });

}).call(this);

(function() {
  "use strict";
  var Cryptographer;

  Cryptographer = (function() {
    function Cryptographer() {}

    Cryptographer.decrypt = function(encryptedText, key) {
      var C, aes, decrypted, x;

      if (key == null) {
        key = ENCRYPTION_KEY;
      }
      C = CryptoJS;
      encryptedText = C.enc.Base64.parse(encryptedText);
      key = C.enc.Utf8.parse(key);
      aes = C.algo.AES.createDecryptor(key, {
        mode: C.mode.CBC,
        padding: C.pad.Pkcs7,
        iv: key
      });
      decrypted = aes.finalize(encryptedText);
      x = C.enc.Utf8.stringify(decrypted);
      return x;
    };

    Cryptographer.encrypt = function(plainText, key) {
      var C, aes, encrypted, x;

      if (key == null) {
        key = ENCRYPTION_KEY;
      }
      C = CryptoJS;
      plainText = C.enc.Utf8.parse(plainText);
      key = C.enc.Utf8.parse(key);
      aes = C.algo.AES.createEncryptor(key, {
        mode: C.mode.CBC,
        padding: C.pad.Pkcs7,
        iv: key
      });
      encrypted = aes.finalize(plainText);
      x = C.enc.Base64.stringify(encrypted);
      return x;
    };

    return Cryptographer;

  })();

  window.Cryptographer = Cryptographer;

}).call(this);

(function() {
  "use strict";
  var URLService;

  URLService = (function() {
    function URLService() {
      this.remote = REMOTE;
      this.encrypted = ENCRYPTION;
      this.local = "http://crm-ng.in/jsons/";
      this.remoteEncrypted = "http://localhost:3000/api/secure";
      this.remoteUnencrypted = "http://localhost:3000/api";
    }

    URLService.prototype.auth = function() {
      var url;

      if (!this.remote) {
        url = this.local + "auth.json";
      }
      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted;
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted;
      }
      return url;
    };

    URLService.prototype.account = function() {
      var url;

      if (!this.remote) {
        url = this.local + "accounts.json";
      }
      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/account";
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/account";
      }
      return url;
    };

    URLService.prototype.buyingbehavior = function() {
      var url;

      if (!this.remote) {
        url = this.local + "bb.json";
      }
      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/buyingbehavior";
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/buyingbehavior";
      }
      return url;
    };

    URLService.prototype.actionplan = function() {
      var url;

      if (!this.remote) {
        url = this.local + "plans.json";
      }
      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/actionplan";
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/actionplan";
      }
      return url;
    };

    URLService.prototype.performance = function() {
      var url;

      if (!this.remote) {
        url = this.local + "performance.json";
      }
      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/performance";
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/performance";
      }
      return url;
    };

    URLService.prototype.calendar = function() {
      var url;

      if (!this.remote) {
        url = this.local + "calendar.json";
      }
      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?calendar";
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?calendar";
      }
      return url;
    };

    URLService.prototype.postplan = function() {
      var url;

      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/actionplan";
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/actionplan";
      }
      return url;
    };

    URLService.prototype.postinteraction = function() {
      var url;

      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/interaction";
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/interaction";
      }
      return url;
    };

    URLService.prototype.deletePlan = function(id) {
      var url;

      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/actionplan?uniqueId=" + id;
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/actionplan?uniqueId=" + id;
      }
      return url;
    };

    URLService.prototype.deleteInteraction = function(id) {
      var url;

      if (this.remote && this.encrypted) {
        url = this.remoteEncrypted + "?/interaction?uniqueId=" + id;
      }
      if (this.remote && !this.encrypted) {
        url = this.remoteUnencrypted + "?/interaction?uniqueId=" + id;
      }
      return url;
    };

    return URLService;

  })();

  window.URLService = URLService;

}).call(this);
