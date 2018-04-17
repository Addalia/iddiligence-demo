(function () {
  'use strict';

  function ValidationEditModal($window, $templateCache, $compile, $http, OperationManager) {
    return {
      restrict: 'EA',
      scope: {
        show: '=',
        errcallback: '=',
        succcallback: '=',
        enableCondition: '='
      },
      replace: true,
      link: function(scope, element /*, attrs*/) {
        scope.loading = true;
        scope.operation = {};
        scope.modified = false;

        $http.get('views/validationEditModal.tpl.html', {cache: $templateCache}).success(function(tplContent) {
          element.replaceWith($compile(tplContent)(scope));
        });

        scope.$watch('show', function(newValue, oldValue, scope) {
          scope.clean();
          updateOp(newValue, oldValue, scope);
        }, true);

        function updateOp(newValue, oldValue, scope){
          if(newValue === true) {
            scope.loading = true;
            OperationManager.getOpStat().then(function(opStats){
              scope.operation = opStats;
              scope.cleanOp(scope.operation);
              scope.modified = false;
              scope.loading = false;
            },function(error){
              scope.operation = {};
              if(scope.errcallback){scope.errcallback(error);}
              scope.loading = false;
            });
          }
        }

        function callError(error){
          if(scope.errcallback){scope.errcallback(error);}
        }

        function callSuccess(opStats) {
          if(scope.succcallback){
            scope.succcallback(opStats).then(function(){
              scope.loading = false;
            },function(error){
              callError(error);
              scope.loading = false;
            });
          } else {
            scope.loading = false;
          }
        }

        scope.cleanOp = function(op) {
          op.documents = op.documents.filter(function(doc){return doc.idDocument!== '';});
        };

        scope.toggleValidation = function(validation) {
          if(validation.status === 'OK') {
            validation.status = 'KO';
          } else {
            validation.status = 'OK';
          }
          scope.modified = true;
        };


        scope.clean = function() {
          scope.operation = {};
        };

        scope.save = function() {
          scope.loading = true;
          if(scope.modified) {
            OperationManager.setOpStat().then(function(opStats){
              scope.operation = opStats;
              scope.cleanOp(scope.operation);
              scope.modified = false;
              callSuccess(opStats);
            },function(error){
              scope.operation = {};
              callError(error);
            });
          } else {
            callSuccess(scope.operation);
          }
        };

        scope.cancel = function() {
          scope.show = false;
        };
      }
    };
  }

  angular.module('app.directives')
  .directive('validationEditModal', ValidationEditModal);

})();
