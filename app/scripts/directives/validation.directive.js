(function(){
	'use strict';
	function IdocValidation($window, $templateCache, $compile, $http){
		return {
			restrict : 'EA',
			scope: {
				title: '@',
				titletype: '=',
				ocr: '=',
				status: '=',
				headers: '=',				
				docattribs: '=',
				validations: '=',
				templateUser: '@'
			},
			replace: true,
			link: function(scope, element) {
				var defaulttemplate = 'views/validate.tpl.html';
				// checkValues are: 'ok' , 'ko' , 'dis' , 'pending' , '' , 'unchecked'				
				var defaultColHeaders = [4, 4, 2, 2];
				var defaultColSize = [4, 8, '', ''];
				var colSizeWithChecks = [3, 6, 1 ,1];

				function isEmpty(obj) {
					for(var prop in obj) {
						if(obj.hasOwnProperty(prop)) {
							return false;
						}
					}
					return true;
				}

				function isArrayEmpty(obj) {
					var bool = true;
					if (obj.length === 0) {
						return bool;
					}

					for (var i = 0; i < obj.length; i++) {
						if (obj[i] !== undefined) {
							bool = false;
						}
					}
					return bool;
				}

				function isEmptyChecks(obj) {
					var value = true;
					Object.keys(obj).forEach(function (key) {
						if (typeof obj[key].checks !== 'undefined' ) {
							if (!isArrayEmpty(obj[key].checks)) {
								value = false;
							}
						}
					});
					return value;
				}

				scope.hasAttribs = !isEmpty(scope.docattribs);
				scope.hasValidations = !isEmpty(scope.validations);
				scope.hasHeaders = !isEmpty(scope.headers);				
				scope.hasChecks = scope.hasAttribs && !isEmptyChecks(scope.docattribs);				

				scope.colHeaders = defaultColHeaders;

				if (scope.hasChecks) {
					scope.colSize = colSizeWithChecks; 					
				} else {
					scope.colSize = defaultColSize; 
				}

				if (typeof scope.templateUser === 'undefined') {
					scope.templateUser = defaulttemplate;
				}

				scope.$watch('docattribs', function () {
		            //console.log('$watch docattribs = ' + scope.docattribs);
					scope.hasAttribs = !isEmpty(scope.docattribs);
					scope.hasHeaders = !isEmpty(scope.headers);				
					scope.hasChecks = scope.hasAttribs && !isEmptyChecks(scope.docattribs);				

					if (scope.hasChecks) {
						scope.colSize = colSizeWithChecks; 					
					} else {
						scope.colSize = defaultColSize; 
					}
		        });

				$http.get(scope.templateUser, {cache: $templateCache}).success(function(tplContent) {
					element.replaceWith($compile(tplContent)(scope));
				});
			}
		};

	}

	IdocValidation.$inject=['$window', '$templateCache', '$compile', '$http'];  

	angular.module('app.directives')
	.directive('idocValidation', IdocValidation);
	
})();