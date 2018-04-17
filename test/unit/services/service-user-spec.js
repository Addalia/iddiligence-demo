'use strict';

describe('CloudIDoc service-user', function() {

  var $httpBackend;
  var baseUrl;
  var envConfig;
  var injector;
  var EnvConfigProviderObj;

  beforeEach(function() {
    module('app');
    module('app.service-user');

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

  describe('Service-User', function() {

	  var UserService;

  	  beforeEach(function() {
  	  	UserService = injector.get('User');
  	  });


	  it('should call POST method from resource.', function() {
		  $httpBackend.expectPOST('http://localhost:8080/IDocValidationService/resources/authenticate').
		  	respond({ "RespuestaDePrueba" : "post",
		    	      "MensajeDePrueba" : "mensaje"
	      	});
	      UserService.save();
	      $httpBackend.flush();
	  });

	  it('should call GET method from resource.', function() {
		  $httpBackend.expectGET('http://localhost:8080/IDocValidationService/resources/authenticate').
		  	respond({ "RespuestaDePrueba" : "get",
		    	      "MensajeDePrueba" : "mensaje"
	      	});
	      UserService.get();
	      $httpBackend.flush();
	  });

	  it('should call DELETE method from resource.', function() {
		  $httpBackend.expectDELETE('http://localhost:8080/IDocValidationService/resources/authenticate').
		  	respond({ "RespuestaDePrueba" : "delete",
		    	      "MensajeDePrueba" : "mensaje"
	      	});
	      UserService.delete();
	      $httpBackend.flush();
	  });

  });

});