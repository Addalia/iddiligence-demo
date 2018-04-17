'use strict';

describe('CloudIDoc service-view', function() {

  var $httpBackend;
  var baseUrl;
  var envConfig;
  var injector;
  var EnvConfigProviderObj;

  beforeEach(function() {
    module('app');
    module('app.service-view');

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



  describe('Service-View', function() {

	  var ViewService;

  	  beforeEach(function() {
  	  	ViewService = injector.get('View');
  	  });


	  it('should call POST method from resource.', function() {
		  $httpBackend.expectPOST('http://localhost:8080/IDocValidationService/resources/operations/1234/5678/new').
		  	respond({ "RespuestaDePrueba" : "post",
		    	      "MensajeDePrueba" : "mensaje"
	      	});
	      ViewService.create({'idop':'1234','iddoc':'5678'},{content:'content'});
	      $httpBackend.flush();
	  });

	  it('should call GET method from resource.', function() {
		  $httpBackend.expectGET('http://localhost:8080/IDocValidationService/resources/operations/1234/5678/9012').
		  	respond({ "RespuestaDePrueba" : "get",
		    	      "MensajeDePrueba" : "mensaje"
	      	});
	      ViewService.query({'idop':'1234','iddoc':'5678','idview':'9012'});
	      $httpBackend.flush();
	  });

	  it('should call PUT method from resource.', function() {
		  $httpBackend.expectPUT('http://localhost:8080/IDocValidationService/resources/operations/1234/5678/9012').
		  	respond({ "RespuestaDePrueba" : "put",
		    	      "MensajeDePrueba" : "mensaje"
	      	});
	      ViewService.update({'idop':'1234','iddoc':'5678','idview':'9012'},{content:'content'});
	      $httpBackend.flush();
	  });

	  it('should call GET method from resource when status is called.', function() {
		  $httpBackend.expectGET('http://localhost:8080/IDocValidationService/resources/operations/1234/5678/9012/status').
		  	respond({ "RespuestaDePrueba" : "get",
		    	      "MensajeDePrueba" : "mensaje"
	      	});
	      ViewService.status({'idop':'1234','iddoc':'5678','idview':'9012'});
	      $httpBackend.flush();
	  });

	  it('should call DELETE method from resource.', function() {
		  $httpBackend.expectDELETE('http://localhost:8080/IDocValidationService/resources/operations/1234/5678/9012').
		  	respond({ "RespuestaDePrueba" : "delete",
		    	      "MensajeDePrueba" : "mensaje"
	      	});
	      ViewService.delete({'idop':'1234','iddoc':'5678','idview':'9012'});
	      $httpBackend.flush();
	  });

	  it('should call PUT method from resource.', function() {
		  $httpBackend.expectPUT('http://localhost:8080/IDocValidationService/resources/operations/1234/5678/9012/file').
		  	respond({ "RespuestaDePrueba" : "put",
		    	      "MensajeDePrueba" : "mensaje"
	      	});
	      ViewService.upload({'idop':'1234','iddoc':'5678','idview':'9012'},{content:'content'});
	      $httpBackend.flush();
	  });

	  it('should call GET method from resource.', function() {
		  $httpBackend.expectGET('http://localhost:8080/IDocValidationService/resources/operations/1234/5678/9012/file').
		  	respond({ "RespuestaDePrueba" : "get",
		    	      "MensajeDePrueba" : "mensaje"
	      	});
	      ViewService.download({'idop':'1234','iddoc':'5678','idview':'9012'});
	      $httpBackend.flush();
	  });

  });

});