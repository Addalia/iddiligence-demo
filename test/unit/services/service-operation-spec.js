'use strict';

describe('CloudIDoc service-operation', function() {

  var $httpBackend;
  var baseUrl;
  var envConfig;
  var injector;
  var EnvConfigProviderObj;

  beforeEach(function() {
    module('app');
    module('app.service-operation');

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



  describe('Service-Operation', function() {

	  var OperationService;

  	  beforeEach(function() {
  	  	OperationService = injector.get('Operation');
  	  });


	  it('should call POST method from resource.', function() {
		  $httpBackend.expectPOST('http://localhost:8080/IDocValidationService/resources/operations/new').
		  	respond({ "RespuestaDePrueba" : "post",
		    	      "MensajeDePrueba" : "mensaje"
	      	});
	      OperationService.create();
	      $httpBackend.flush();
	  });

	  it('should call GET method from resource.', function() {
		  $httpBackend.expectGET('http://localhost:8080/IDocValidationService/resources/operations/1234').
		  	respond([{ "RespuestaDePrueba" : "get",
		    	      "MensajeDePrueba" : "mensaje"
	      	}]);
	      OperationService.query({'idop':'1234'});
	      $httpBackend.flush();
	  });


	  it('should call PUT method from resource.', function() {
		  $httpBackend.expectPUT('http://localhost:8080/IDocValidationService/resources/operations/1234').
		  	respond({ "RespuestaDePrueba" : "put",
		    	      "MensajeDePrueba" : "mensaje"
	      	});
	      OperationService.update({'idop':'1234'},{content:'content'});
	      $httpBackend.flush();
	  });


	  it('should call GET method from resource when status is called.', function() {
		  $httpBackend.expectGET('http://localhost:8080/IDocValidationService/resources/operations/1234/status').
		  	respond({ "RespuestaDePrueba" : "get",
		    	      "MensajeDePrueba" : "mensaje"
	      	});
	      OperationService.status({'idop':'1234'});
	      $httpBackend.flush();
	  });

	  it('should call DELETE method from resource.', function() {
		  $httpBackend.expectDELETE('http://localhost:8080/IDocValidationService/resources/operations/1234').
		  	respond({ "RespuestaDePrueba" : "delete",
		    	      "MensajeDePrueba" : "mensaje"
	      	});
	      OperationService.delete({'idop':'1234'});
	      $httpBackend.flush();
	  });

  });

});
