"use strict"
angular.module("webApp").directive "myAnimatedView", ($http, $templateCache, $route, $anchorScroll, $compile, $controller) ->
  restrict: "ECA"
  terminal: true
  link: (scope, element, attr) ->
    destroyLastScope = ->
      if lastScope
        lastScope.$destroy()
        lastScope = null
    
    clearContent = ->
      element.html ""
      destroyLastScope()
    
    update = ->
      locals = $route.current and $route.current.locals
      template = locals and locals.$template
      
      if template
        element.html template
        #animate it bro
        animation = "animated fadeInRight"
        childElem = angular.element(element.children()[0])
        childElem.removeClass animation  if childElem.hasClass(animation)
        childElem.addClass animation
        destroyLastScope()
        link = $compile(element.contents())
        current = $route.current
        controller = undefined
        lastScope = current.scope = scope.$new()
        if current.controller
          locals.$scope = lastScope
          controller = $controller(current.controller, locals)
          element.children().data "$ngControllerController", controller
        link lastScope
        lastScope.$emit "$viewContentLoaded"
        lastScope.$eval onloadExp
        
        # $anchorScroll might listen on event...
        $anchorScroll()
      else
        clearContent()

    lastScope = undefined
    onloadExp = attr.onload or ""
    scope.$on "$routeChangeSuccess", update
    update()
