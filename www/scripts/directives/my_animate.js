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
