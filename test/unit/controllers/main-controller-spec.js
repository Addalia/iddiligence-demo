'use strict';

describe('CloudIDocValidationDemo Main controller', function() {

  var $rootScope;
  var $scope;
  var $httpBackend;
  var requestI18n_es;
  var requestI18n_en;
  var baseUrl;
  var envConfig;
  var EnvConfigProviderObj;

  beforeEach(function() {
    module('app');
    module('app.service-core');
    module('app.service-user');
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
      $scope.pagestatus = $injector.get('PageStatus');

      baseUrl = $injector.get('BaseUrl');

      $httpBackend = _$httpBackend_;

      requestI18n_en = $httpBackend.whenGET('i18n/en-us.json').
        respond({ "APP_TITLE" : "CloudIDoc Validation Demo",
          "LOCALE_EN" : "Inglés",
          "LOCALE_ES" : "Español",
      });

      requestI18n_es = $httpBackend.whenGET('i18n/es-es.json').
        respond({ "APP_TITLE" : "CloudIDoc Demo Validaciones",
          "LOCALE_EN" : "Inglés",
          "LOCALE_ES" : "Español",
      });

      envConfig = $httpBackend.whenGET('./config.json').
        respond({"restUrl": "http://localhost:8080/IDocValidationService/resources",
                          "products":[  { "path":"/validationDemo", "name":"VALIDATION_DEMO"},
                                        { "path":"/", "name":"NOWHERE"}],
                          "locales":[ {"name":"LOCALE_EN","locale":"en-us"},
                                      {"name":"LOCALE_ES","locale":"es-es"},
                                      {"name":"LOCALE_NL","locale":"nl-nl"}]});
      $httpBackend.flush();
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('CloudIDoc Main.controller', function() {

    var UserLoginCtrl;
    var MainCtrl;
    var ProductTypes;
    var PageStatus;
    var location;
    var injector;
    var $httpBackend;
    var validUser ={"user":"admin","pass":"admin"};

    beforeEach(function() {
      inject(function($injector,_$location_,_$httpBackend_) {
        $httpBackend = _$httpBackend_;
        location = _$location_;
        injector = $injector;
        $httpBackend.whenPOST(baseUrl+'/authenticate',validUser).respond(200);
        $httpBackend.whenDELETE(baseUrl+'/authenticate').respond(200);
        $httpBackend.whenDELETE(baseUrl+'/validationDemo').respond(200);
        UserLoginCtrl = $injector.get('$controller')('UserLoginCtrl', {$scope: $scope});
        MainCtrl = $injector.get('$controller')('MainController', {$scope: $scope});
        PageStatus = $injector.get('PageStatus');
        ProductTypes = $injector.get('ProductTypes');
        PageStatus.setUserNotLogged();
    
        $scope.$digest();
      });
    });

    it('Should get the Main Controller actualPage', function() {
      spyOn(location, 'path');
      UserLoginCtrl.user = validUser;
      UserLoginCtrl.login();
      $httpBackend.flush();
      expect(location.path).toHaveBeenCalledWith('/validationDemo');
      expect(MainCtrl.actualPage()).toBe('login');
    });

    it('Should get the Main Controller pageStatus object', function() {
      spyOn(location, 'path');
      UserLoginCtrl.user = validUser;
      UserLoginCtrl.login();
      $httpBackend.flush();
      expect(location.path).toHaveBeenCalledWith('/validationDemo');

      expect(MainCtrl.getPageStatus().isUserLogged()).toBe(true);
      expect(MainCtrl.getPageStatus().getUserName()).toBe('admin');
      expect(MainCtrl.getPageStatus().getActualPage()).toBe('login');
    });

    it('Should set the Main Controller logout', function() {
      spyOn(location, 'path');
      UserLoginCtrl.user = validUser;
      UserLoginCtrl.login();
      $httpBackend.flush();
      expect(location.path).toHaveBeenCalledWith('/validationDemo');

      MainCtrl.logout();
      $httpBackend.flush();
      expect(location.path).toHaveBeenCalledWith('/');
      expect(MainCtrl.getPageStatus().isUserLogged()).toBe(false);
      expect(MainCtrl.getPageStatus().getUserName()).toBe('');
      expect(MainCtrl.getPageStatus().getActualPage()).toBe('login');
    });

    it('should be able to change the locale to English', inject(function($locale, tmhDynamicLocale) {
      MainCtrl.changeLocale('en-us');
      $httpBackend.flush();
      expect($locale.id).toBe('en-us');
      expect($locale.DATETIME_FORMATS.DAY['0']).toBe('Sunday');
      expect(tmhDynamicLocale.get()).toBe('en-us');
    }));

    it('should be able to change the locale to Spanish', inject(function($locale, tmhDynamicLocale) {
      MainCtrl.changeLocale('es-es');
      expect($locale.id).toBe('en-us');
      expect($locale.DATETIME_FORMATS.DAY['0']).toBe('Sunday');
      expect(tmhDynamicLocale.get()).toBe('es-es');
      }));

      it('Should get the Main Controller now date time', function() {
      var today = new Date();
      expect(MainCtrl.now().getDate()).toEqual(today.getDate());
    });

  });

});

