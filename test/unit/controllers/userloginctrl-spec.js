'use strict';

describe('CloudIDocValidationDemo UserLogin.controllers', function() {

  var $rootScope;
  var $scope;
  var $httpBackend;
  var requestI18n;
  var baseUrl;
  var envConfig;
  var EnvConfigProviderObj;

  beforeEach(function() {
    module('app');
    module('app.service-user');
    module('app.service-core');
    module('app.product-types');

    module(function ($provide) {
      $provide.provider('EnvConfig', function(){
        var envConfig = {"restUrl": "http://localhost:8080/IDocValidationService/resources",
                          "products":[  { "path":"/validationDemo", "name":"VALIDATION_DEMO"},
                                        { "path":"/", "name":"NOWHERE"}],
                          "locales":[ {"name":"LOCALE_EN","locale":"en-us"},
                                      {"name":"LOCALE_ES","locale":"es-es"},
                                      {"name":"LOCALE_NL","locale":"nl-nl"}]};

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
      $scope.pagestatus = $injector.get('PageStatus');

      baseUrl = $injector.get('BaseUrl');

      $httpBackend = _$httpBackend_;

      requestI18n = $httpBackend.whenGET('i18n/es-es.json').
      respond({ "APP_TITLE" : "CloudIDoc Validation Demo",
        "LOCALE_EN" : "Inglés",
        "LOCALE_ES" : "Español",
      });

      envConfig = $httpBackend.whenGET('./config.json').
      respond({ "restUrl": "http://localhost:8080/IDocValidationService/resources",
                "products":[  { "path":"/validationDemo", "name":"VALIDATION_DEMO"},
                              { "path":"/", "name":"NOWHERE"}],
                "locales":[ {"name":"LOCALE_EN","locale":"en-us"},
                            {"name":"LOCALE_ES","locale":"es-es"},
                            {"name":"LOCALE_NL","locale":"nl-nl"}]});
      $httpBackend.flush();
    
      $scope.$digest();
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('CloudIDoc UserLogin.controller', function() {

    describe('With previous login', function() {
        var UserLoginCtrl;
        var PageStatus;
        var location;
        var injector;
        var $httpBackend;
        var $timeout
        var validUser ={"user":"admin","pass":"admin"};
        var invalidUser ={"user":"paco","pass":"paco"};
        var ProductTypes;

        beforeEach(function() {
          inject(function($injector,_$location_,_$httpBackend_) {
            $httpBackend = _$httpBackend_;
            location = _$location_;
            injector = $injector;
            PageStatus = injector.get('PageStatus');
            PageStatus.setDefaultProduct('0');
            /*ProductTypes = injector.get('ProductTypes');
            ProductTypes.setSelected('0');*/
            $httpBackend.expectGET(baseUrl+'/authenticate').respond(200);
            $timeout = $injector.get('$timeout');
            PageStatus.setUserNotLogged();
          });
        });

        afterEach(function() {
          inject(function($injector,_$location_,_$httpBackend_) {
            PageStatus.setDefaultProduct('0');
          });
        });

        it('should go to list page if already have a session.', function() {
            spyOn(location, 'path');
            UserLoginCtrl = injector.get('$controller')('UserLoginCtrl', {$scope: $scope});
            UserLoginCtrl.updateSelectedProduct();
            $timeout.flush();
            $httpBackend.flush();
            expect(location.path).toHaveBeenCalledWith('/validationDemo');
        });

        it('should go nowhere if already have and nowhere is selected.', function() {
            PageStatus.setDefaultProduct('1');
            ProductTypes = injector.get('ProductTypes');
            spyOn(location, 'path');
            UserLoginCtrl = injector.get('$controller')('UserLoginCtrl', {$scope: $scope});
            UserLoginCtrl.updateSelectedProduct();
            $timeout.flush();
            $httpBackend.flush();
            expect(location.path).toHaveBeenCalledWith('/');
        });
    });

    describe('No previous login', function() {
        var UserLoginCtrl;
        var PageStatus;
        var location;
        var injector;
        var $httpBackend;
        var validUser ={"user":"admin","pass":"admin"};
        var invalidUser ={"user":"paco","pass":"paco"};

        beforeEach(function() {
          inject(function($injector,_$location_,_$httpBackend_) {
            $httpBackend = _$httpBackend_;
            location = _$location_;
            injector = $injector;
            $httpBackend.whenGET(baseUrl+'/authenticate').respond(401);
            $httpBackend.whenPOST(baseUrl+'/authenticate',validUser).respond(200);
            $httpBackend.whenPOST(baseUrl+'/authenticate',invalidUser).respond(401);
            PageStatus = $injector.get('PageStatus');
            PageStatus.setUserNotLogged();
            PageStatus.setDefaultProduct('0');
            UserLoginCtrl = $injector.get('$controller')('UserLoginCtrl', {$scope: $scope});
          });
        });

        it('Should be able to login with a valid user', function() {
          spyOn(location, 'path');
          UserLoginCtrl.user = validUser;
          UserLoginCtrl.login();
          $httpBackend.flush();
          expect(location.path).toHaveBeenCalledWith('/validationDemo');
          expect(PageStatus.isUserLogged()).toBe(true);
          expect(PageStatus.getUserName()).toBe('admin');
        });

        it('Not should be able to login with an invalid user', function() {
          spyOn(location, 'path');
          UserLoginCtrl.user = invalidUser;
          UserLoginCtrl.login();
          $httpBackend.flush();
          expect(location.path).not.toHaveBeenCalledWith('/validationDemo');
          expect(PageStatus.isUserLogged()).toBe(false);
          expect(PageStatus.getUserName()).toBe('');
        });

      });

  });

});
