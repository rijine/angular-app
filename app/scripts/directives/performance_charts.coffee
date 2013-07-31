"use strict"

class SalesVolumeChart

  @options : () ->
    template: '<canvas width="900%" height="180%"></canvas>'
    replace: true
    link : (scope, element, attrs) ->
      
      calculate_scale = (data) ->
        max = _.max(data)
        min = _.min(data)
        rangeOrderOfMagnitude = Math.floor(Math.log(max- min) / Math.LN10)
        stepValue = Math.pow(10, rangeOrderOfMagnitude)
        {noOfSteps: Math.ceil(max / stepValue), stepWidth: stepValue}

      drawGraph = ->
        sales_volume = scope.salesVolume
        data =
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "YTD", "Target"]
          datasets: [
            fillColor: "rgba(205,205,205,0.8)"
            strokeColor: "rgba(205,205,205,1)"
            data: sales_volume
          ]

        ctx = $("." + attrs.class).get(0).getContext("2d")
        scale = calculate_scale(sales_volume)
        chart = new Chart(ctx).Waterfall(data, {scaleShowGridLines: false, animation: true, scaleOverride : true, scaleStartValue : 0, scaleSteps: scale.noOfSteps , scaleStepWidth: scale.stepWidth})

      scope.$watch("salesVolume", (n, o) -> drawGraph() if n)

class PocketMarginsChart

  @options : () ->
    template: '<canvas width="900%" height="180%"></canvas>'
    replace: true
    link : (scope, element, attrs) ->
      data =
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        datasets: [
          fillColor: "rgba(205,205,205,0.8)"
          strokeColor: "rgba(205,205,205,1)"
          data: [10, 12, 13, 14, 15, 16, 17, 18, 10, 11, 12, 13]
        ]

      ctx = $("." + attrs.class).get(0).getContext("2d")
      ctx.canvas.width = 800
      chart = new Chart(ctx).Bar(data, {scaleShowGridLines: false, scaleOverride : true, scaleStartValue : 0, scaleSteps : 5, scaleStepWidth: 5})

      
angular.module("webApp").directive "salesVolumeChart", SalesVolumeChart.options
angular.module("webApp").directive "pocketMarginsChart", PocketMarginsChart.options