'use strict';

describe('CloudIDoc app', function() {

  var $locationProvider;
  var $rootScope;
  var $scope;
  var $httpBackend;
  var requestI18n;

  beforeEach(function() {
    angular.module('locationProviderConfig', [])
      .config(function(_$locationProvider_) {
        $locationProvider = _$locationProvider_;
        spyOn($locationProvider, 'html5Mode');
      });
    module('locationProviderConfig');

    module('app');

    inject(function($injector,_$httpBackend_) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();

      $httpBackend = _$httpBackend_;

      requestI18n = $httpBackend.whenGET('i18n/es-es.json').
      respond({ "APP_TITLE" : "CloudIDoc Validation Demo",
        "LOCALE_EN" : "Inglés",
        "LOCALE_ES" : "Español",
      });
      $httpBackend.flush();
    });
  });

  describe('LocationProviderConfig', function() {

    it('should set html5 mode', function() {
      expect($locationProvider.html5Mode).toHaveBeenCalledWith(true);
    });

  });

});
