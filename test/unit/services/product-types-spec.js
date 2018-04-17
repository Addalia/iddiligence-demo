'use strict';

describe('CloudIDoc product-types', function() {

  var $rootScope;
  var $scope;
  var $httpBackend;
  var requestI18n;
  var baseUrl;
  var envConfig;
  var EnvConfigProviderObj;

  beforeEach(function() {
    module('app');
    module('app.service-core');
    module('app.product-types');

    module(function ($provide) {
      $provide.provider('EnvConfig', function(){
        var envConfig = { "restUrl": "http://localhost:8080/IDocValidationService/resources",
                          "products":[  { "path":"/validationDemo", "name":"VALIDATION_DEMO"},
                                        { "path":"/", "name":"NOWHERE"}],
                          "locales":[ {"name":"LOCALE_EN","locale":"en-us"},
                                      {"name":"LOCALE_ES","locale":"es-es"},
                                      {"name":"LOCALE_NL","locale":"nl-nl"}]
                        };

        this.$get = function() {
          return envConfig;
        };
      });
    });
    module(function (EnvConfigProvider) {
      EnvConfigProviderObj=EnvConfigProvider;
    });

    inject(function($injector,_$httpBackend_) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $scope.pagestatus = {};

      baseUrl = $injector.get('BaseUrl');

      $httpBackend = _$httpBackend_;

      requestI18n = $httpBackend.whenGET('i18n/es-es.json').
      respond({ "APP_TITLE" : "Cloud IDoc",
        "LOCALE_EN" : "Inglés",
        "LOCALE_ES" : "Español",
      });

      envConfig = $httpBackend.whenGET('./config.json').
      respond({"restUrl": "http://localhost:8080/IDocValidationService/resources"});

      $httpBackend.flush();

    });
  });

  describe('ProductTypes', function() {
    var ProductTypes;
    beforeEach(function() {
      inject(function($injector,_$location_) {
        ProductTypes = $injector.get('ProductTypes');
      });
    });

    it('Should the two products defined on config', function() {
      expect(ProductTypes.getServices().length).toBe(2);
    });

    it('Default selected should be the element at 0', function() {
      expect(ProductTypes.getSelected().name).toBe('VALIDATION_DEMO');
      expect(ProductTypes.getSelectedId()).toBe(0);
    });

    it('Should be able to change and return the selected product', function() {
      ProductTypes.setSelected('0');
      expect(ProductTypes.getSelected().name).toBe('VALIDATION_DEMO');
      ProductTypes.setSelected('1');
      expect(ProductTypes.getSelected().name).toBe('NOWHERE');
    });

  });

});
