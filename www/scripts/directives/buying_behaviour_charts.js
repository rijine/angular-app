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
