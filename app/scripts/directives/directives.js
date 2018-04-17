(function () {
	'use strict';

  angular.module('app.directives', ['app.controllers', 'ngFileUpload']);

  function ipsaModal($window, $templateCache, $compile, $http) {
    return {
     restrict: 'EA',
     scope: {
      show: '=',
      savechanges: '&',
      templateUser: '@',
      msg: '@',
      title: '@',
      type: '@',
      cancelable: '='
    },
    replace: true,
    link: function(scope, element, attrs) {
      var types ={'i':0,'w':1,'e':2, def:0};
      var defaulttemplate = 'views/modal.tpl.html';

      scope.refreshStyle = function(){
        if ((typeof scope.type !== 'undefined') && types.hasOwnProperty(scope.type.toLowerCase())) {
          scope.modaltype = types[scope.type.toLowerCase()];
        } else {
          scope.modaltype = types.def;
        }
      };

      scope.$watch('show', function(newValue, oldValue, scope) {
        scope.refreshStyle();
      }, true);

      scope.refreshStyle();

      if (typeof scope.templateUser === 'undefined') {
        scope.templateUser = defaulttemplate;
      }

      $http.get(scope.templateUser, {cache: $templateCache}).success(function(tplContent) {
       element.replaceWith($compile(tplContent)(scope));
      });

      scope.dialogStyle = {};

      if (attrs.width) {
       scope.dialogStyle.width = attrs.width + '%';
       scope.dialogStyle.left = ( ( 100 - attrs.width ) / 2 ) + '%';
      }

      if (attrs.height) {
       scope.dialogStyle.height = attrs.height + '%';
       scope.dialogStyle.top = ( ( 100 - attrs.height ) / 2 ) + '%';
      }

      scope.save = function() {
       scope.savechanges();
       scope.show = false;
      };

      scope.cancel = function() {
       scope.show = false;
      };
   }
 };
}

angular.module('app.directives')
.directive('ipsaModal', ipsaModal);

})();
