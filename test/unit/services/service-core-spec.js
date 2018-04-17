'use strict';

describe('CloudIDoc service-core', function() {

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

  describe('PageStatus', function() {
    var PageStatus;
    var location;
    beforeEach(function() {
      inject(function($injector,_$location_) {
        PageStatus = $injector.get('PageStatus');
        location = _$location_;
      });
    });

    it('Should have user not logged', function() {
      expect(PageStatus.isUserLogged()).not.toBeTruthy();
    });

    it('Should be able to toggle user status', function() {
      PageStatus.setUserLogged();
      expect(PageStatus.isUserLogged()).toBeTruthy();
      PageStatus.setUserNotLogged();
      expect(PageStatus.isUserLogged()).not.toBeTruthy();
    });

    it('Should be able to toggle user status', function() {
      PageStatus.setUserLogged();
      expect(PageStatus.isUserLogged()).toBeTruthy();
      PageStatus.setUserNotLogged();
      expect(PageStatus.isUserLogged()).not.toBeTruthy();
    });

    it('Actual page must be empty at the beginning and can be changed', function() {
      expect(PageStatus.getActualPage()).not.toBeTruthy();
      PageStatus.setActualPage('firstpage');
      expect(PageStatus.getActualPage()).toBe('firstpage');
    });

    it('User name must be empty at the beginning and can be changed', function() {
      expect(PageStatus.getUserName()).not.toBeTruthy();
      PageStatus.setUserName('someuser');
      expect(PageStatus.getUserName()).toBe('someuser');
    });

    it('Should be able to exec login without any callback', function() {
      PageStatus.setUserLogged();
    });

    it('Should be able to exec login callbacks', function() {
      this.calledcallbacks = 0;
      var self = this;
      PageStatus.addInCallBack('test1',function(){
        self.calledcallbacks++;
      });
      PageStatus.addInCallBack('test2',function(){
        self.calledcallbacks++;
      });
      PageStatus.setUserLogged();
      expect(self.calledcallbacks).toBe(2);
    });

    it('Login callbacks must overwrite if have same name', function() {
      this.calledcallbacks = 0;
      var self = this;
      PageStatus.addInCallBack('test1',function(){
        self.calledcallbacks++;
      });
      PageStatus.addInCallBack('test2',function(){
        self.calledcallbacks++;
      });
      PageStatus.addInCallBack('test2',function(){
        self.calledcallbacks++;
      });
      PageStatus.setUserLogged();
      expect(self.calledcallbacks).toBe(2);
    });

    it('Should be able to exec Logout without any callback', function() {
      PageStatus.setUserNotLogged();
    });

    it('Should be able to exec Logout callbacks', function() {
      this.calledcallbacks = 0;
      var self = this;
      PageStatus.addOutCallBack('test1',function(){
        self.calledcallbacks++;
      });
      PageStatus.addOutCallBack('test2',function(){
        self.calledcallbacks++;
      });
      PageStatus.setUserNotLogged();
      expect(self.calledcallbacks).toBe(2);
    });

    it('Logout callbacks must overwrite if have same name', function() {
      this.calledcallbacks = 0;
      var self = this;
      PageStatus.addOutCallBack('test1',function(){
        self.calledcallbacks++;
      });
      PageStatus.addOutCallBack('test2',function(){
        self.calledcallbacks++;
      });
      PageStatus.addOutCallBack('test2',function(){
        self.calledcallbacks++;
      });
      PageStatus.setUserNotLogged();
      expect(self.calledcallbacks).toBe(2);
    });

    it('Should go login if 401', function() {
      spyOn(location, 'path');
      var status = 401;
      PageStatus.goLoginIfUnauthorized(status);
      expect(location.path).toHaveBeenCalledWith('/');
    });

    it('Should not go login if non 401 status is given', function() {
      spyOn(location, 'path');
      var status = 500;
      PageStatus.goLoginIfUnauthorized(status);
      expect(location.path).not.toHaveBeenCalledWith('/');
    });

  });

});
