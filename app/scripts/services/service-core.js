(function () {
  'use strict';

  angular.module('app.service-core', ['ngResource', 'ngStorage']);

  function config($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
  }
  config.$inject=['$httpProvider'];

  function EnvConfig(BaseUrl) {
    var envConfig = {
      restUrl: BaseUrl,
      products : [],
      documentGroups : {},
      autoTypes : [],
      documentTypeTranslation : {},
      docEntryConfiguration : {},
      validationConfiguration : {},
      locales : []
    };

    this.$get = function() {
      var q = jQuery.ajax({
        type: 'GET', url: './config.json', cache: false, async: false, contentType: 'application/json', dataType: 'json'
        });
      if (q.status === 200) {
        angular.extend(envConfig, angular.fromJson(q.responseText));
      }
      return envConfig;
    };

  }
  EnvConfig.$inject=['BaseUrl'];
  
  
function PageStatus ($Location, $sessionStorage) {
    this.appName = '';
    this.userName = '';
    this.userLogged = false;
    this.actualPage = '';
    this.inCallbacks = [];
    this.outCallbacks = [];
    this.location = $Location;
    this.store =$sessionStorage;
    var self = this;
    this.runInCallBacks = function(){
      for(var key in self.inCallbacks){
        self.inCallbacks[key]();
      }
    };
    this.runOutCallBacks = function(){
      for(var key  in self.outCallbacks){
        self.outCallbacks[key]();
      }
    };
    var pageStatus = {
      //appName : self.appName,
      setAppName:function(name){
        self.appName = name;
      },
      getAppName:function(){
        return self.appName;
      },
      isUserLogged : function(){
        return self.userLogged;
      },
      setUserLogged : function(){
        self.userLogged = true;
        self.runInCallBacks();
      },
      setUserNotLogged : function(){
        self.userLogged = false;
        self.runOutCallBacks();
      },
      setActualPage : function(name){
        self.actualPage=name;
      },
      getActualPage : function(){
        return self.actualPage;
      },
      setUserName : function(name){
        self.userName=name;
      },
      getUserName : function(){
        return self.userName;
      },
      addInCallBack : function(name,callback){
        self.inCallbacks[name] = callback;
      },
      addOutCallBack : function(name,callback){
        self.outCallbacks[name] = callback;
      },
      goLoginIfUnauthorized: function (status){
        if(status === 401 ){
          this.setUserNotLogged();
          self.location.path('/');
        }
      },
      getDefaultProduct: function(){
        return self.store.productId || '0';
      },
      getDefaultLanguage: function(){
        return self.store.language || 'es-es';
      },
      setDefaultProduct: function(id){
        self.store.productId = id;
      },
      setDefaultLanguage: function(lan){
        self.store.language =lan;
      }
    };
    return pageStatus;
  }
  PageStatus.$inject=['$location','$sessionStorage'];
  
angular
    .module('app.service-core')
    .constant('BaseUrl', 'http://localhost:8080/IDocValidationService/resources')
    .config(config)
    .provider('EnvConfig', EnvConfig)
    .factory('PageStatus',PageStatus);

})();