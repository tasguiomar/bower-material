/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc.5-master-b9db09d
 */
goog.provide('ng.material.components.content');
goog.require('ng.material.core');
/**
 * @ngdoc module
 * @name material.components.content
 *
 * @description
 * Scrollable content
 */
angular.module('material.components.content', [
  'material.core'
])
  .directive('mdContent', mdContentDirective);

/**
 * @ngdoc directive
 * @name mdContent
 * @module material.components.content
 *
 * @restrict E
 *
 * @description
 *
 * The `<md-content>` directive is a container element useful for scrollable content. It achieves
 * this by setting the CSS `overflow` property to `auto` so that content can properly scroll.
 *
 * In general, `<md-content>` components are not designed to be nested inside one another. If
 * possible, it is better to make them siblings. This often results in a better user experience as
 * having nested scrollbars may confuse the user.
 *
 * ## Troubleshooting
 *
 * In some cases, you may wish to apply the `md-no-momentum` class to ensure that Safari's
 * momentum scrolling is disabled. Momentum scrolling can cause flickering issues while scrolling
 * SVG icons and some other components.
 *
 * Additionally, we now also automatically apply a new `md-no-flicker` class to the `<md-content>`
 * which applies a Webkit-specific transform of `translateX(0)` to help reduce the flicker. If you
 * need to disable this for any reason, you can do so globally with the following code, or on a
 * case-by-case basis by ensuring your CSS operator is more specific than our global class.
 *
 * <hljs lang="css">
 *   .md-no-flicker { -webkit-transform: none }
 * </hljs>
 *
 * @usage
 *
 * Add the `[layout-padding]` attribute to make the content padded.
 *
 * <hljs lang="html">
 *  <md-content layout-padding>
 *      Lorem ipsum dolor sit amet, ne quod novum mei.
 *  </md-content>
 * </hljs>
 */

function mdContentDirective($mdTheming) {
  return {
    restrict: 'E',
    controller: ['$scope', '$element', ContentController],
    link: function(scope, element) {
      element.addClass('_md');     // private md component indicator for styling
      element.addClass('md-no-flicker'); // add a class that helps prevent flickering on iOS devices

      $mdTheming(element);
      scope.$broadcast('$mdContentLoaded', element);

      iosScrollFix(element[0]);
    }
  };

  function ContentController($scope, $element) {
    this.$scope = $scope;
    this.$element = $element;
  }
}
mdContentDirective.$inject = ["$mdTheming"];

function iosScrollFix(node) {
  // IOS FIX:
  // If we scroll where there is no more room for the webview to scroll,
  // by default the webview itself will scroll up and down, this looks really
  // bad.  So if we are scrolling to the very top or bottom, add/subtract one
  angular.element(node).on('$md.pressdown', function(ev) {
    // Only touch events
    if (ev.pointer.type !== 't') return;
    // Don't let a child content's touchstart ruin it for us.
    if (ev.$materialScrollFixed) return;
    ev.$materialScrollFixed = true;

    if (node.scrollTop === 0) {
      node.scrollTop = 1;
    } else if (node.scrollHeight === node.scrollTop + node.offsetHeight) {
      node.scrollTop -= 1;
    }
  });
}

ng.material.components.content = angular.module("material.components.content");