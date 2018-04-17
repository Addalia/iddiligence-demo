'use strict';

describe('CloudIDoc service-media', function() {

  var $httpBackend;
  var baseUrl;
  var envConfig;
  var injector;
  var EnvConfigProviderObj;

  beforeEach(function() {
    module('app');
    module('app.service-media');

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



  describe('Service-Media', function() {

      var MediaService;

      beforeEach(function() {
        MediaService = injector.get('Media');
      });


      it('should call POST method from resource.', function() {
      $httpBackend.expectPOST('http://localhost:8080/IDocValidationService/resources/patterns/facerecognition/1234/new').
        respond({ "RespuestaDePrueba" : "post",
                "MensajeDePrueba" : "mensaje"
          });
        MediaService.create({'idpattern':'1234'},{content:'content'});
        $httpBackend.flush();
      });

      it('should call GET method from resource.', function() {
        $httpBackend.expectGET('http://localhost:8080/IDocValidationService/resources/patterns/facerecognition/1234/views').
          respond({ "RespuestaDePrueba" : "get",
                  "MensajeDePrueba" : "mensaje"
            });
          MediaService.query({'idpattern':'1234'});
          $httpBackend.flush();
      });

      it('should call PUT method from resource.', function() {
        $httpBackend.expectPUT('http://localhost:8080/IDocValidationService/resources/patterns/facerecognition/1234/5678/file').
          respond({ "RespuestaDePrueba" : "put",
                  "MensajeDePrueba" : "mensaje"
            });
          MediaService.upload({'idpattern':'1234','idmedia':'5678'},{content:'content'});
          $httpBackend.flush();
      });

  });

});
