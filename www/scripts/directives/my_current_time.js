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
