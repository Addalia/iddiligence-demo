(function(){
	'use strict';
	function ipsaDocEntry($window, $templateCache, $compile, $http){
		return {
			restrict : 'EA',
			scope: {
				title: '@',
				templateUser: '@',
				model: '=',
				selected: '=',
    		disable: '=',
				itemclick: '&',
    		onupload: '&',
    		disableimage: '=',
    		disabledropdown: '=',
    		image: '=?',
    		clearimage: '=',
    		inputstyle: '@',
    		isDisabled: '@',
    		clear: '=',
    		cssimage: '@',
        pattern: '@'
			},
			//replace: true,
			link: function(scope, element) {
				var defaulttemplate = 'views/docentry.tpl.html';
				var defaultinputstyle = 'default';

				function isEmpty(obj) {
					for(var prop in obj) {
						if(obj.hasOwnProperty(prop)) {
							return false;
						}
					}
					return true;
				}

				function isIE() {
					var ie = 0;
					try {
						ie = navigator.userAgent.match( /(MSIE |Trident.*rv[ :])([0-9]+)/ )[ 2 ];
					}
					catch(e){}
					return ie;
				}


				scope.image = scope.image || '';

				scope.hasDocs = !isEmpty(scope.model);
				if (scope.hasDocs) {
					scope.selected = scope.selected || scope.model[0];
				}

				if (typeof scope.templateUser === 'undefined') {
					scope.templateUser = defaulttemplate;
				}

				if (typeof scope.inputstyle === 'undefined') {
					scope.inputstyle = defaultinputstyle;
				}

				$http.get(scope.templateUser, {cache: $templateCache}).success(function(tplContent) {
					element.replaceWith($compile(tplContent)(scope));
				});

				scope.onuploaddocentry = function (fileParam) {
					scope.file = fileParam;
		            scope.onupload({$dataURI: scope.file});
				};

				scope.disableimagedocentry = function (forminvalid) {
					scope.forminvalid = forminvalid;
					return (scope.disableimage || forminvalid);
				};

				scope.imagedocentry = function () {
					if (scope.image !== '') {
						return scope.image;
					} else {
						return null;
					}
				};

				scope.clearimagedocentry = function() {
					return scope.clearimage;
				};

				scope.inputstyledocentry = function() {
					return scope.inputstyle;
				};

		        scope.toggleimage = function(value) {
	        		scope.disableimage = value;
		        };

		        scope.clearAttributes = function() {
					if (!isEmpty(scope.model)) {
						Object.keys(scope.model).forEach(function(key){
							for (var i = 0; i < scope.model[key].fields.length; i++) {
								if (typeof scope.model[key].fields[i].defaultvalue === 'undefined') {
									scope.model[key].fields[i].value = '';
								} else {
									scope.model[key].fields[i].value = scope.model[key].fields[i].defaultvalue;
								}
							}
						});
					}
					scope.clear = false;
					scope.inputform.$setPristine();
					scope.inputform.$setUntouched();
		        };

		        scope.$watch(function() {
		            return scope.disable;
		          }, function(value) {
		            if (value === true) {
						scope.isDisabled = true;
		              	scope.toggleimage(value);
		            } else {
						scope.isDisabled = false;
		              	scope.toggleimage(value);
		            }
		        });

		        scope.$watch(function() {
		            return scope.disabledropdown;
		          }, function(value) {
		            if (value === true) {
						scope.isDropdownDisabled = true;
		            } else {
						scope.isDropdownDisabled = false;
		            }
		        });

		        scope.$watch(function() {
		            return scope.clear;
		          }, function(value) {
		            if (value === true) {
		              	scope.clearAttributes();
		            }
		        });

		        scope.supportedDate = navigator.userAgent.indexOf('Firefox') === -1 && isIE() === 0;

			}
		};

	}

	ipsaDocEntry.$inject=['$window', '$templateCache', '$compile', '$http'];

	angular.module('app.directives')
		.directive('ipsaDocEntry', ipsaDocEntry);
})();
