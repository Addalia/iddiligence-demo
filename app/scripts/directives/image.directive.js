(function(){
  'use strict';
//   angular.module('app.directives', ['ngFileUpload']);

  function ipsaImage($window, $templateCache, $compile, $http, $log, Upload){
    return {
      restrict : 'EA',
      // templateUrl: 'views/image.tpl.html',
      scope: {
        title: '@',
        templateUser: '@',
        clear: '=',
        disable: '=',
        pattern: '@',
        image: '=?',

        onupload: '&'
      },
      link: function(scope, element, attrs) {
        var defaulttemplate = 'views/image.tpl.html';

        if (typeof scope.templateUser === 'undefined') {
          scope.templateUser = defaulttemplate;
        }

        $http.get(scope.templateUser, {cache: $templateCache}).success(function(tplContent) {
          element.replaceWith($compile(tplContent)(scope));
        });

        scope.attrs = attrs;
        scope.pattern = scope.pattern || 'image/*,application/pdf';
        scope.initialPattern = scope.pattern;
        scope.dragOverClass = {accept: 'dragover', reject: 'dragover-err'};
        scope.dragOverClass.pattern = scope.pattern;

        if (typeof scope.image === 'undefined') {
          scope.image = null;
        }
        scope.picFile = scope.image;
        scope.img = null;

        scope.uploadImgId = '#ipsa-img-' + scope.title;
        scope.uploadImgVisible = false;
        scope.downloadImgVisible = false;

        scope.onUploadFile = function (fileParam) {
          if (typeof fileParam.name !== 'undefined') {
            scope.uploadImgVisible = true;
            scope.showUploadImg(scope.uploadImgVisible);
            scope.downloadImgVisible = false;
            scope.img = null;

            scope.file = fileParam;
            scope.onupload({$dataURI: scope.file});
          }
        };

        scope.cleanImage = function() {
          // $log.info('title ' + scope.title +' Enter clean uploadImgVisible=' + scope.uploadImgVisible + ' downloadImgVisible=' + scope.downloadImgVisible + ' picFile= ' + scope.picFile + ' img=' + scope.img);

          scope.picFile = null;
          scope.img = null;
          if (typeof scope.ipsaImageForm !== 'undefined') {
            scope.ipsaImageForm.$valid = false;
          }
          scope.uploadImgVisible = false;
          scope.showUploadImg(scope.uploadImgVisible);
          scope.downloadImgVisible = false;

          scope.clear = false;
          // $log.info('title ' + scope.title +' Exit clean uploadImgVisible=' + scope.uploadImgVisible + ' downloadImgVisible=' + scope.downloadImgVisible + ' ipsaImageForm.$valid= ' + scope.ipsaImageForm.$valid);
        };

        scope.showUploadImg = function(show) {
          scope.imgUploadElement = angular.element( document.querySelector( scope.uploadImgId ) );
          if (show) {
            scope.imgUploadElement.removeClass('ng-hide');
          } else {
            scope.imgUploadElement.addClass('ng-hide');
          }
        };

        scope.$watch('picFile', function () {
          if (typeof scope.picFile !== 'undefined' && scope.picFile !== null && scope.picFile !== scope.image ) {
            //console.log('picFile.$watch: picFile=' + scope.picFile.name + ' disable=' + scope.disable + ' pattern=' + scope.pattern);
            scope.onUploadFile(scope.picFile);
          }
        });

        scope.$watch(function() {
            return scope.clear;
          }, function(value) {
            if (value === true) {
              scope.cleanImage();
            }
        });

        scope.$watch(function() {
            return scope.disable;
          }, function(value) {
            // console.log('disable.$watch: disable=' + scope.disable + ' value=' + value);
            if (value === true) {
              scope.pattern = 'disabled';
            } else {
              scope.pattern = scope.initialPattern;
            }
            scope.dragOverClass.pattern = scope.pattern;
            // console.log('disable.$watch: dragOverClass.pattern=' + scope.dragOverClass.pattern);
        });

        function _arrayBufferToBase64( buffer ) {
          var binary = '';
          var bytes = new Uint8Array( buffer );
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
          }
          return window.btoa( binary );
        }

        scope.processImageObject =  function(imageObject) {
          var CONTENT = 'content-type';
          var contentType = imageObject.header[CONTENT] || 'image/jpeg';
          scope.img = 'data:' + contentType + ';base64,' + _arrayBufferToBase64(imageObject.data);
        };

        scope.processImage = function(image) {
          if (Upload.isFile(image)) {
            scope.picFile = image;
          } else {
            if (typeof image === 'object') {
              scope.processImageObject(image);
            } else {
              Upload.urlToBlob(image).then(function(blob) {
                scope.picFile = blob;
              });
            }
          }
          scope.uploadImgVisible = false;
          scope.showUploadImg(scope.uploadImgVisible);
          scope.downloadImgVisible = true;
          scope.ipsaImageForm.$valid = false;
          // $log.info('processImage(): scope.image=' + scope.image + ' image=' + image + ' scope.picFile ' + scope.picFile );
        };

        scope.$watch(function() {
            return scope.image;
          }, function(value) {
            if (value !== null) {
              scope.processImage(value);
            }
        });
      }
    };

  }
  ipsaImage.$inject=['$window', '$templateCache', '$compile', '$http', '$log', 'Upload'];

  angular.module('app.directives')
    .directive('ipsaImage', ipsaImage);

})();
