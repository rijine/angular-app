"use strict"

class HistoricalSalesChart

  @options : () ->
    template: '<canvas width="600%" height="200%"></canvas>'
    replace: true
    link : (scope, element, attrs) ->
      drawGraph = ->
        data =
          labels: scope.buyingBehavior.labels
          datasets: [
            fillColor: "rgba(16,115,184,0.5)"
            strokeColor: "rgba(16,115,184,1)"
            data: scope.buyingBehavior.sales[0]
          ,
            fillColor: "rgba(211,28,39,0.5)"
            strokeColor: "rgba(211,28,39,1)"
            data: scope.buyingBehavior.sales[1]
          ,
            fillColor: "rgba(102,200,61,0.5)"
            strokeColor: "rgba(102,200,61,1)"
            data: scope.buyingBehavior.sales[2]
          ]
        ctx = $("." + attrs.class).get(0).getContext("2d")
        chart = new Chart(ctx).Bar(data, {scaleShowGridLines: false})

      scope.$watch('buyingBehavior', (n, o) -> drawGraph() if n)

class HistoricalRevenueChart

  @options : () ->
    template: '<canvas width="600%" height="200%"></canvas>'
    replace: true
    link : (scope, element, attrs) ->
      drawGraph = ->
        data =
          labels: scope.buyingBehavior.labels
          datasets: [
            fillColor: "rgba(16,115,184,0.5)"
            strokeColor: "rgba(16,115,184,1)"
            data: scope.buyingBehavior.revenues[0]
          ,
            fillColor: "rgba(211,28,39,0.5)"
            strokeColor: "rgba(211,28,39,1)"
            data: scope.buyingBehavior.revenues[1]
          ,
            fillColor: "rgba(102,200,61,0.5)"
            strokeColor: "rgba(102,200,61,1)"
            data: scope.buyingBehavior.revenues[2]
          ]
        ctx = $("." + attrs.class).get(0).getContext("2d")
        ctx.canvas.width = 820
        chart = new Chart(ctx).Bar(data, {scaleShowGridLines: false})

      scope.$watch('buyingBehavior', (n, o) -> drawGraph() if n)

      
angular.module("webApp").directive "historicalSalesChart", HistoricalSalesChart.options
angular.module("webApp").directive "historicalRevenueChart", HistoricalRevenueChart.options