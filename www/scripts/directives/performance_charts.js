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
