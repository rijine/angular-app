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
