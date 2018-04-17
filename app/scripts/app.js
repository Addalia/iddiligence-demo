(function () {
  'use strict';

  angular.module('app', ['ngRoute', 'app.directives', 'app.controllers','app.IdentityDemoCtrl','app.FaceRecognitionDemoCtrl','app.PVIOperationsDemoCtrl','app.UserLoginCtrl', 'app.templates', 'pascalprecht.translate', 'tmh.dynamicLocale', 'ngTable']);

  angular
    .module('app')
    .factory('angularTranslateAsyncLoader', function ($q, $http) {

      return function(options) {

        var deferred = $q.defer();

        $http
          .get( 'i18n/' + options.key + '.json' )
          .success( function( data ) {
            deferred.resolve( data );
          })
          .error(function(){
            deferred.reject( options.key );
          });

          return deferred.promise;
      };

    });

  function config($locationProvider, $routeProvider, $translateProvider, tmhDynamicLocaleProvider, $compileProvider, $httpProvider) {
    var EXPIRES_HEADER = 'Expires';
    var CACHE_CONTROL_HEADER = 'Cache-Control';
    var PRAGMA_HEADER = 'Pragma';

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    function isie() {
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf('MSIE ');

      if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        return true;
      } else {
        return false;
      }
    }

    document.onkeydown = function(){
      switch (event.keyCode){
            case 116 : //F5 button
                event.preventDefault();
                event.returnValue = false;
                event.keyCode = 0;
                return false;
            case 82 : //R button
                if (event.ctrlKey){
                    event.preventDefault();
                    event.returnValue = false;
                    event.keyCode = 0;
                    return false;
                }
        }
    };


    if(isie()){ //Avoid ie navigators problem
      if (!$httpProvider.defaults.headers.get) {
          $httpProvider.defaults.headers.get = {};
      }
      $httpProvider.defaults.headers.get[EXPIRES_HEADER] = 0;
      $httpProvider.defaults.headers.get[CACHE_CONTROL_HEADER] = 'no-cache';
      $httpProvider.defaults.headers.get[PRAGMA_HEADER] = 'no-cache';
    }

    $locationProvider.html5Mode(true);

    $routeProvider
       .when('/', {
        templateUrl: 'views/user-login.tpl.html',
        controller: 'UserLoginCtrl',
        controllerAs: 'userlogin'
      })
      .when('/validationDemo', {
        templateUrl: 'views/validationDemo.tpl.html',
        controller: 'ValidationDemoCtrl',
        controllerAs: 'validationDemoCtrl'
      })
      .when('/identityDemo', {
        templateUrl: 'views/identityDemo.tpl.html',
        controller: 'IdentityDemoCtrl',
        controllerAs: 'identityDemoCtrl'
      })
      .when('/faceRecognitionDemo', {
        templateUrl: 'views/faceRecognitionDemo.tpl.html',
        controller: 'FaceRecognitionDemoCtrl',
        controllerAs: 'faceRecognitionDemoCtrl'
      })
      .when('/pviOperationsDemo', {
        templateUrl: 'views/pviOperationsDemo.tpl.html',
        controller: 'PVIOperationsDemoCtrl',
        controllerAs: 'pviOperationsDemoCtrl'
      })
      .when('/sendPVI', {
        templateUrl: 'views/page_under_construction.tpl.html',
        controllerAs: 'sendPVI'
      })
      .otherwise({
        redirectTo: '/'
      });

      $translateProvider.useLoader('angularTranslateAsyncLoader');
      $translateProvider.preferredLanguage('es-es');
      // Enable escaping of HTML
      $translateProvider.useSanitizeValueStrategy('escape');

      tmhDynamicLocaleProvider.localeLocationPattern('i18n/angular-locale_{{ locale }}.js');
  }
  config.$inject=['$locationProvider', '$routeProvider', '$translateProvider', 'tmhDynamicLocaleProvider', '$compileProvider', '$httpProvider'];

  function run($window, $translate, tmhDynamicLocale) {

    var language = ($window.navigator.userLanguage || $window.navigator.language).indexOf('es') === 0 ? 'es-es' : 'en-us';

    $translate.use(language);
    tmhDynamicLocale.set(language);
  }
  run.$inject=['$window', '$translate', 'tmhDynamicLocale'];

  angular
    .module('app')
    .config(config)
    .run(run);

})();
