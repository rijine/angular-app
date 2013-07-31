"use strict"

PlanCtrl = ($scope, $location, $routeParams, $http, storageService, webService, uuidService, dialogService) ->
  $scope.page = "plan"
  $scope.isSyncing = true

  $scope.addPlan = (plan) ->
    actionPlan.valueProposition = plan.valueProposition
    actionPlan.issue = plan.issue
    actionPlan.type = "actionPlans"
    $scope.showItems = true

  $scope.addInteraction = (interaction) ->
    customerInteraction.meetingDate = interaction.meetingDate
    customerInteraction.personMet = interaction.personMet
    customerInteraction.startTime = interaction.startTime
    customerInteraction.endTime = interaction.endTime
    customerInteraction.meetingObjective = interaction.meetingObjective
    customerInteraction.meetingResult = interaction.meetingResult
    customerInteraction.type = "interactions"
    $scope.showPoints = true

  $scope.addItems = (item) ->
    item.status = "green" unless item.status
    actionPlan.actionPlanItems.push({actionItem: item.actionItem, decisionMaker: item.decisionMaker, dueDate: item.dueDate, pic: item.pic, nextStep: item.nextStep, status: item.status})
    $scope.actionPlanItems.push({actionItem: item.actionItem, decisionMaker: item.decisionMaker, dueDate: item.dueDate, pic: item.pic, nextStep: item.nextStep, status: item.status})
    $scope.$$childTail.$$prevSibling.item = {} ##hack to clear fields

  $scope.addMainPoint = (mainPoint) ->
    customerInteraction.mainPoints.push({point: mainPoint.point, nextStep: mainPoint.nextStep, pic: mainPoint.pic})
    $scope.mainPoints.push({point: mainPoint.point, nextStep: mainPoint.nextStep, pic: mainPoint.pic})
    $scope.$$childTail.mainPoint = {} ##hack to clear fields

  $scope.savePlan = ->
    uuid = uuidService.getUUID()
    actionPlan.uniqueId = uuid
    actionPlan.accountId = $scope.accountId
    storageService.storeEncrypted(uuid, JSON.stringify(actionPlan))
    dialogService.showDialog "Plan Saved", "Plan saved successfully.", "plan/" + $scope.accountId + "/Action Plan"

  $scope.saveInteraction = ->
    uuid = uuidService.getUUID()
    customerInteraction.uniqueId = uuid
    customerInteraction.accountId = $scope.accountId
    storageService.storeEncrypted(uuid, JSON.stringify(customerInteraction))
    dialogService.showDialog "Interaction Saved", "Interaction saved successfully.", "plan/" + $scope.accountId + "/Customer Interaction"

  #Can send false positives, if item is not on server still a delete request is sent
  $scope.deletePlanOrInteraction = (id, type) ->
    $scope.isSyncing = true
    result = dialogService.showConfirmation("Are you sure you want to delete?")
    remoteId = id.substr(10, id.length) if id.substr(0, 10) is "pert-uuid-"
    remoteId = id if id.substr(0, 10) isnt "pert-uuid-"
    result.then (response) ->
      if response.toString() is "ok"
        promise = webService.deletePlan(remoteId) if type is "actionPlan"
        promise = webService.deleteInteraction(remoteId) if type is "interaction"
        promise.then (success) ->
          storageService.deleteItem("pert-uuid-" + remoteId) if storageService.get("pert-uuid-" + remoteId)
          dialogService.showDialog("Success", "Item deleted successfully.", "reload")
        , (error) ->
          alert("Could not connect to network. Please try again later.")
      else
        $scope.isSyncing = false

  $scope.sync = ->
    $scope.isSyncing = true
    localData = getLocallyStoredData($scope.accountId)
    actionPlans = localData.localActionPlans
    interactions = localData.localInteractions
    results = []
    if actionPlans.length > 0
      for actionPlan in actionPlans
        #.NET doesn't want any extra data in UUID
        actionPlan.uniqueId = actionPlan.uniqueId.substr(10, actionPlan.uniqueId.length)
        promise = webService.postPlan actionPlan
        promise.then (success) =>
          results.push({ok: true})
          checkResults(results, actionPlans, interactions)
        , (error) =>
          dialogService.showDialog("Sync Failed", "Please try again when network is available.", "reload")
    if interactions.length > 0
      for interaction in interactions
        interaction.uniqueId = interaction.uniqueId.substr(10, interaction.uniqueId.length)
        promise = webService.postInteraction interaction
        promise.then (success) =>
          results.push({ok: true})
          checkResults(results, actionPlans, interactions)
        , (error) =>
          dialogService.showDialog("Sync Failed!", "Please try again when network is available.", "reload")
    checkResults(results, actionPlans, interactions)
  
  #Check if all requests are successful
  checkResults = (results, actionPlans, interactions) ->
    console.log results
    if _.where(results, {ok: false}).length > 0
      dialogService.showDialog("Sync Failed", "Please try again when network is available.", "reload")
    if results.length is actionPlans.length + interactions.length
      dialogService.showDialog("Success", "Sync succeeded.", "reload")

  getLocallyStoredData = (accountId) ->
    actionPlansForThisAccount = []
    interactionsForThisAccount = []
    localData = storageService.getLocallyStoredRecords()
    
    if localData.length > 0
      actionPlans = _.filter(localData, (obj) -> obj.type and obj.type.toString() is "actionPlans")
      interactions = _.filter(localData, (obj) -> obj.type and obj.type.toString() is "interactions")
      
      if actionPlans.length > 0
        actionPlansForThisAccount = _.filter(actionPlans, (obj) -> obj.accountId.toString() is accountId.toString())
      if interactions.length > 0
        interactionsForThisAccount = _.filter(interactions, (obj) -> obj.accountId.toString() is accountId.toString())
    
    {localActionPlans: actionPlansForThisAccount, localInteractions: interactionsForThisAccount}

  getDataForAccount = (data, accountId) ->
    serverData = _.find(data, (obj) -> obj.id.toString() is accountId.toString())
    
    #Delete duplicates in local storage
    _.each serverData.actionPlans, (obj) -> storageService.deleteItem("pert-uuid-" + obj.uniqueId) if storageService.get("pert-uuid-" + obj.uniqueId)
    _.each serverData.interactions, (obj) -> storageService.deleteItem("pert-uuid-" + obj.uniqueId) if storageService.get("pert-uuid-" + obj.uniqueId)

    #Get remaining locally stored action plans / interactions for this account
    localData = getLocallyStoredData(accountId)
    actionPlansForThisAccount = localData.localActionPlans
    interactionsForThisAccount = localData.localInteractions

    serverData.actionPlan = _.union serverData.actionPlans, actionPlansForThisAccount
    serverData.interactions = _.union serverData.interactions, interactionsForThisAccount
    serverData

  setData = ->
    $scope.accountId = if $routeParams.accountId then $routeParams.accountId else $scope.accounts[0].id
    $scope.subpage   = if $routeParams.subpage then $routeParams.subpage else "Action Plan"
    $scope.accountDetails = getDataForAccount($scope.accounts, $scope.accountId)

  getAccountData = ->
    promise = webService.getActionPlan()
    promise.then (success) =>
      $scope.accounts  = success.data
      setData()
      #Also store it in local storage so that the action plans pages work offline
      storageService.storeEncrypted("action_plan", JSON.stringify($scope.accounts))
      $scope.isSyncing = false
    , (error) ->
      #if there is an error, show data from local storage
      $scope.accounts  = JSON.parse(storageService.getDecrypted("action_plan"))
      setData()
      $scope.isSyncing = false

  actionPlan = {}
  actionPlan.actionPlanItems = []

  $scope.showItems = false
  $scope.actionPlanItems = []

  customerInteraction = {}
  customerInteraction.mainPoints = []

  $scope.showPoints = false
  $scope.mainPoints = []

  getAccountData()


PlanCtrl.$inject = ["$scope", "$location", "$routeParams", "$http", "storageService", "webService", "uuidService", "dialogService"]
angular.module("webApp").controller "PlanCtrl", PlanCtrl