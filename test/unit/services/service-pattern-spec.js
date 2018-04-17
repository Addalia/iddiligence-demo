'use strict';

describe('CloudIDoc service-patterns', function() {

  var $httpBackend;
  var baseUrl;
  var envConfig;
  var injector;
  var EnvConfigProviderObj;

  beforeEach(function() {
    module('app');
    module('app.service-patterns');

    module(function ($provide) {
      $provide.provider('EnvConfig', function(){
        var envConfig = {"restUrl": "http://localhost:8080/IDocValidationService/resources"};

        this.$get = function() {
          return envConfig;
        };
      });
    });
    module(function (EnvConfigProvider) {
      EnvConfigProviderObj=EnvConfigProvider;
    });

    inject(function($injector,_$httpBackend_) {
      injector = $injector;
      baseUrl = $injector.get('BaseUrl');
      $httpBackend = _$httpBackend_;

      envConfig = $httpBackend.whenGET('./config.json')
        .respond({"restUrl": "http://localhost:8080/IDocValidationService/resources"});

      $httpBackend.whenGET('i18n/es-es.json')
          .respond({ "APP_TITLE" : "Cloud IDoc",
            "LOCALE_EN" : "Inglés",
            "LOCALE_ES" : "Español",
          });

      $httpBackend.flush();

    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });



  describe('Service-Patterns', function() {

      var PatternService;

      beforeEach(function() {
        PatternService = injector.get('Patterns');
      });


      it('should call POST method from resource.', function() {
          $httpBackend.expectPOST('http://localhost:8080/IDocValidationService/resources/patterns/facerecognition/new').
            respond({ "RespuestaDePrueba" : "post",
                      "MensajeDePrueba" : "mensaje"
            });
          PatternService.create();
          $httpBackend.flush();
      });

      it('should call GET method from resource.', function() {
          $httpBackend.expectGET('http://localhost:8080/IDocValidationService/resources/patterns/facerecognition/1234').
            respond({ "RespuestaDePrueba" : "get",
                      "MensajeDePrueba" : "mensaje"
            });
          PatternService.query({'idpattern':'1234'});
          $httpBackend.flush();
      });

      it('should call GET method from resource when status is called.', function() {
          $httpBackend.expectGET('http://localhost:8080/IDocValidationService/resources/patterns/facerecognition/1234/status').
            respond([{ "RespuestaDePrueba" : "get",
                      "MensajeDePrueba" : "mensaje"
            }]);
          PatternService.status({'idpattern':'1234'});
          $httpBackend.flush();
      });

      it('should call DELETE method from resource.', function() {
          $httpBackend.expectDELETE('http://localhost:8080/IDocValidationService/resources/patterns/facerecognition/1234').
            respond({ "RespuestaDePrueba" : "delete",
                      "MensajeDePrueba" : "mensaje"
            });
          PatternService.delete({'idpattern':'1234'});
          $httpBackend.flush();
      });

  });

});
