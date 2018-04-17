'use strict';

describe('CloudIDoc service-document', function() {

  var $httpBackend;
  var baseUrl;
  var envConfig;
  var injector;
  var EnvConfigProviderObj;

  beforeEach(function() {
    module('app');
    module('app.service-document');

    module(function ($provide) {
      $provide.provider('EnvConfig', function(){
        var envConfig = {"restUrl": "http://localhost:8080/IDocValidationService/resources",
                          "documentGroups" : {
                              "Dni":"Identity",
                              "NIE":"Identity",
                              "Passport":"Identity",
                              "Dni_front":"IdentityFront",
                              "NIE_front":"IdentityFront",
                              "Paysheet":"Income",
                              "IRPF":"Income",
                              "Bank_Receipt":"Receipt",
                              "Receipt":"Receipt",
                              "SignatureCard": "SignatureCard",
                              "IdentityMedia": "IdentityMedia"
                          }
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


  describe('Service-Document', function() {

    var DocumentService;

    beforeEach(function() {
      DocumentService = injector.get('Document');
    });


    it('should call POST method from resource.', function() {
      $httpBackend.expectPOST('http://localhost:8080/IDocValidationService/resources/operations/1234/new').
        respond({ "RespuestaDePrueba" : "post",
                  "MensajeDePrueba" : "mensaje"
          });
        DocumentService.create({'idop':'1234'},{content:'content'});
        $httpBackend.flush();
    });

    it('should call GET method from resource.', function() {
      $httpBackend.expectGET('http://localhost:8080/IDocValidationService/resources/operations/1234/5678').
        respond({ "RespuestaDePrueba" : "get",
                  "MensajeDePrueba" : "mensaje"
        });
      DocumentService.query({'idop':'1234' , 'iddoc':'5678'});
      $httpBackend.flush();
    });

    it('should call PUT method from resource.', function() {
      $httpBackend.expectPUT('http://localhost:8080/IDocValidationService/resources/operations/1234/5678').
        respond({ "RespuestaDePrueba" : "put",
                  "MensajeDePrueba" : "mensaje"
          });
        DocumentService.update({'idop':'1234' , 'iddoc':'5678'},{content:'content'});
        $httpBackend.flush();
    });

    it('should call GET method from resource when status is called.', function() {
      $httpBackend.expectGET('http://localhost:8080/IDocValidationService/resources/operations/1234/5678/status').
        respond({ "RespuestaDePrueba" : "get",
                  "MensajeDePrueba" : "mensaje"
          });
        DocumentService.status({'idop':'1234' , 'iddoc':'5678'});
        $httpBackend.flush();
    });

    it('should call DELETE method from resource.', function() {
      $httpBackend.expectDELETE('http://localhost:8080/IDocValidationService/resources/operations/1234/5678').
        respond({ "RespuestaDePrueba" : "delete",
                  "MensajeDePrueba" : "mensaje"
          });
        DocumentService.delete({'idop':'1234' , 'iddoc':'5678'});
        $httpBackend.flush();
    });

  });

});
