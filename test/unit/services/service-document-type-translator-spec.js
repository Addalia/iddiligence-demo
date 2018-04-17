'use strict';

describe('CloudIDoc service-document-type-translator', function() {

  var $rootScope;
  var $scope;
  var $httpBackend;
  var baseUrl;
  var envConfig;
  var EnvConfigProviderObj;

  beforeEach(function() {
    module('app');
    module('app.service-core');

    module(function ($provide) {
      $provide.provider('EnvConfig', function(){
        var envConfig = { "documentTypeTranslation" : {
                            "a":"1",
                            "b":"2",
                            "c":"2"
                        }};

        this.$get = function() {
          return envConfig;
        };
      });
    });
  });

  describe('DoctypeTranslator', function() {
    var DoctypeTranslator;
    beforeEach(function() {
      inject(function($injector,_$location_) {
        DoctypeTranslator = $injector.get('DoctypeTranslator');
      });
    });

    it('Should not hasTranslation for not configured input', function() {
      expect(DoctypeTranslator.hasTranslation("7")).not.toBeTruthy();
    });

    it('Should hasTranslation for configured input', function() {
      expect(DoctypeTranslator.hasTranslation("b")).toBeTruthy();
      expect(DoctypeTranslator.getRealDoctype("b")).toBe("2");
    });

    it('Should getRealDoctype for configured input', function() {
      expect(DoctypeTranslator.getRealDoctype("c")).toBe("2");
      expect(DoctypeTranslator.getRealDoctype("a")).toBe("1");
    });

  });

});
