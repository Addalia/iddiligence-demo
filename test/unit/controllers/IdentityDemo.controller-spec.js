'use strict';

describe('CloudIDocValidationDemo IdentityDemo controller', function() {

  var $rootScope;
  var $scope;
  var $httpBackend;
  var requestI18n_es;
  var requestI18n_en;
  var baseUrl;
  var envConfig;
  var fakePromiseValue;
  var fakeOperationManager;
  var fakeFieldsManager;
  var EnvConfigProviderObj;

  var fakePromise = function(isSuccess,value){
    return {
      then: function(success,error){
        fakePromiseValue = value;
        if(isSuccess){
          success(value);
        } else {
          error(value);
        }
      }
    };
  };

  var resetFakeFieldsManager = function() {
    fakeFieldsManager = {
      setAttributesValues : function(){return fakePromise(true,"setAttributesValuesMock");}
    };
  };
  var resetFakeOperationManager = function() {
    fakeOperationManager = {
      initOp:function(){return;},
      clean : function(){return;},
      getOpStat : function(){return fakePromise(true,"getOpStatmock");},
      finishOp : function(){return fakePromise(true,"finishMock");},
      deleteOp : function(){return fakePromise(true,"deleteOpMock");},
      isTerminated : function(){return false;},
      isStarted : function(){return false;},
      setTerminated : function(){return;},
      getDoc : function(){return fakePromise(true,"getDocMock");},
      setAttributte : function(){return fakePromise(true,"setAttributteMock");},
      getView : function(){return fakePromise(true,"getViewMock");},
      sendViewFile : function(){return fakePromise(true,"sendViewFileMock");},
      getViewFile : function(){return fakePromise(true,"getViewFileMock");}
    };
  };

  beforeEach(function() {
    module('app');
    module('app.service-core');
    module('app.service-document');
    module('app.service-user');
    module('app.service-operationmanager');
    module('app.service-operationstore');
    module('app.service-operation');
    module('app.service-view');
    module('app.service-fieldsmanager');
    module('app.document-groups');        
    module('app.doc-entry-configuration');    

    module(function ($provide) {
      $provide.provider('EnvConfig', function(){
        var envConfig = { 
          "restUrl": "http://localhost:8080/IDocValidationService/resources",
          "documentGroups" : {
            "Not_Recognized_Identity" : "Identity",
            "Dni":"Identity",
            "NIE":"Identity",
            "Passport":"Identity",
            "Not_Recognized_IdentityFront" : "IdentityFront",
            "Dni_front":"IdentityFront",
            "Nie_front":"IdentityFront",
            "Not_Recognized_Income" : "Income",
            "Paysheet":"Income",
            "IRPF":"Income",
            "Not_Recognized_Receipt" : "Receipt",
            "Bank_Receipt":"Receipt",
            "Receipt":"Receipt",
            "Not_Recognized_SignatureCard" : "SignatureCard",
            "SignatureCard": "SignatureCard"
          },  
          "docEntryConfiguration" : { 
            "Dni" : { 
                "IdentityApp": {
                      "title": "DNI_LABEL",
                      "doctype": "Dni",
                      "fields": [
                        {"label": "IDENTIFICATION_NUMBER_LABEL", "attrname": "dni_number", "controltype": "text", "required": "true", "show": "true", "id": "dninumber"},
                        {"label": "FIRST_NAME_LABEL", "attrname": "dni_first_name", "controltype": "text", "required": "true", "show": "true", "id": "dnifirstname"},
                        {"label": "LAST_NAME_LABEL", "attrname": "dni_last_name", "controltype": "text", "required": "true", "show": "true", "id": "dnilastname"},
                        {"label": "BIRTHDATE_LABEL", "attrname": "dni_birthdate", "controltype": "date", "required": "true", "show": "true", "id": "dnibirthdate"},
                        {"label": "EXPIRATION_DATE_LABEL", "attrname": "dni_expiration_date", "controltype": "date", "required": "false", "show": "false", "id": "dniexpirationdate"}                        
                      ]
                }  
            },
            "Dni_front" : {
              "IdentityApp": {
                    "title": "DNI_FRONT_LABEL",
                    "doctype": "Dni_front",
                    "fields": []
              }
            },
            "NIE" : {  
                "IdentityApp" : {
                        "title": "NIE_LABEL",
                        "doctype": "NIE",              
                        "fields": [
                          {"label": "IDENTIFICATION_NUMBER_LABEL", "attrname": "nie_number", "controltype": "text", "required": "true", "show": "true", "id": "nienumber"},
                          {"label": "FIRST_NAME_LABEL", "attrname": "nie_first_name", "controltype": "text", "required": "true", "show": "true", "id": "niefirstname"},
                          {"label": "LAST_NAME_LABEL", "attrname": "nie_last_name", "controltype": "text", "required": "true", "show": "true", "id": "nielastname"},
                          {"label": "BIRTHDATE_LABEL", "attrname": "nie_birthdate", "controltype": "date", "required": "true", "show": "true", "id": "niebirthdate"},
                          {"label": "EXPIRATION_DATE_LABEL", "attrname": "nie_expiration_date", "controltype": "date", "required": "false", "show": "false", "id": "nieexpirationdate"}                        
                        ]
                }
            },
            "Nie_front" : {
              "IdentityApp": {
                "title": "NIE_FRONT_LABEL",
                "doctype": "Nie_front",              
                "fields": []
              }
            },
            "Passport" : {
                "IdentityApp" : {      
                        "title": "PASSPORT_LABEL",
                        "doctype": "Passport",              
                        "fields": [
                          {"label": "IDENTIFICATION_NUMBER_LABEL", "attrname": "passport_number", "controltype": "text", "required": "true", "show": "true", "id": "nienumber"},
                          {"label": "FIRST_NAME_LABEL", "attrname": "passport_first_name", "controltype": "text", "required": "true", "show": "true", "id": "niefirstname"},
                          {"label": "LAST_NAME_LABEL", "attrname": "passport_last_name", "controltype": "text", "required": "true", "show": "true", "id": "nielastname"},
                          {"label": "BIRTHDATE_LABEL", "attrname": "passport_birthdate", "controltype": "date", "required": "true", "show": "true", "id": "niebirthdate"},
                          {"label": "EXPIRATION_DATE_LABEL", "attrname": "passport_expiration_date", "controltype": "date", "required": "false", "show": "false", "id": "nieexpirationdate"}                        
                        ]
                }
            },
            "SignatureCard" : {
              "IdentityApp": {
                "title": "SIGNATURE_CARD_LABEL",
              "doctype": "SignatureCard",
              "fields": []
              }
            },
            "Not_Recognized_Identity":{
                "IdentityApp": {
                  "title": "DOC_AUTO_LABEL",
                  "doctype": "Not_Recognized_Identity",              
                  "fields": []
                }
            },
            "Not_Recognized_IdentityFront":{
                "IdentityApp": {
                  "title": "DOC_AUTO_LABEL",
                  "doctype": "Not_Recognized_IdentityFront",              
                  "fields": []
                }
            },
            "Not_Recognized_SignatureCard":{
                "IdentityApp": {
                  "title": "DOC_AUTO_LABEL",
                  "doctype": "Not_Recognized_SignatureCard",              
                  "fields": []
                }
            },
          },          
          "validationConfiguration" : { 
            "Dni" : {
              "IdentityApp": {
                "status" :"dis",
                "headers" : ["", "", "HEADER_DOCUMENT_LABEL", "HEADER_SYSTEM_LABEL"],
                "validations":{"VALIDATION_EXPIRATION_DATE_LABEL":"dis"},
                "attribs" : { "FIRST_NAME_LABEL" : {"value" : "", "checks" : ["",""]},
                      "LAST_NAME_LABEL" : {"value" : "", "checks" : ["",""]},
                      "IDENTIFICATION_NUMBER_LABEL" : {"value" : "", "checks" : ["",""]},
                      "BIRTHDATE_LABEL" : {"value" : "", "checks" : ["",""]}
                }
              }  
            }, 
            "Dni_front" : { 
              "IdentityApp": {
                "status" :"dis",
                "headers" : ["", "", "HEADER_DOCUMENT_LABEL", "HEADER_SYSTEM_LABEL"],
                "validations":{},
                "attribs" : { "FIRST_NAME_LABEL" : {"value" : "", "checks" : ["",""]},
                      "LAST_NAME_LABEL" : {"value" : "", "checks" : ["",""]},
                      "IDENTIFICATION_NUMBER_LABEL" : {"value" : "", "checks" : ["",""]},
                      "BIRTHDATE_LABEL" : {"value" : "", "checks" : ["",""]}
                }
              }  
            },
            "NIE" : {
              "IdentityApp": {
                "status" :"dis",
                "headers" : ["", "", "HEADER_DOCUMENT_LABEL", "HEADER_SYSTEM_LABEL"],
                "validations":{"VALIDATION_EXPIRATION_DATE_LABEL":"dis"},
                "attribs" : { "FIRST_NAME_LABEL" : {"value" : "", "checks" : ["",""]},
                      "LAST_NAME_LABEL" : {"value" : "", "checks" : ["",""]},
                      "IDENTIFICATION_NUMBER_LABEL" : {"value" : "", "checks" : ["",""]},
                      "BIRTHDATE_LABEL" : {"value" : "", "checks" : ["",""]}
                }
              }
            },
            "Nie_front" : {
              "IdentityApp": {
                "status" :"dis",
                "headers" : ["", "", "HEADER_DOCUMENT_LABEL", "HEADER_SYSTEM_LABEL"],
                "validations":{},
                "attribs" : { "FIRST_NAME_LABEL" : {"value" : "", "checks" : ["",""]},
                      "LAST_NAME_LABEL" : {"value" : "", "checks" : ["",""]},
                      "IDENTIFICATION_NUMBER_LABEL" : {"value" : "", "checks" : ["",""]},
                      "BIRTHDATE_LABEL" : {"value" : "", "checks" : ["",""]}
                }
              }
            },
            "Passport" : {
              "IdentityApp": {
                "status" :"dis",
                "headers" : ["", "", "HEADER_DOCUMENT_LABEL", "HEADER_SYSTEM_LABEL"],
                "validations":{"VALIDATION_EXPIRATION_DATE_LABEL":"dis"},
                "attribs" : { "FIRST_NAME_LABEL" : {"value" : "", "checks" : ["",""]},
                      "LAST_NAME_LABEL" : {"value" : "", "checks" : ["",""]},
                      "IDENTIFICATION_NUMBER_LABEL" : {"value" : "", "checks" : ["",""]},
                      "BIRTHDATE_LABEL" : {"value" : "", "checks" : ["",""]}
                }
              }
            },
            "Not_Recognized_Identity" : {
              "IdentityApp" : {
                "status":"dis",
                "validations":{},
                "attribs" :{}
              }
            },
            "Not_Recognized_IdentityFront" : {
              "IdentityApp" : {
                "status":"dis",
                "validations":{},
                "attribs" :{}
              }
            },
            "Not_Recognized_SignatureCard" : {
              "IdentityApp" : {
                "status":"dis",
                "validations":{},
                "attribs" :{}
              }
            },
            "SignatureCard" : {
              "IdentityApp" : {
                "status":"dis",
                "validations":{ "EQUALS_SIGN_LABEL":"dis"},
                "attribs" :{}
              }
            }
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
      $httpBackend.flush();

    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('CloudIDoc IdentityDemo.controller', function() {

    var injector;
    var filter;
    var location;
    var translate;
    var timeout;
    var interval;
    var ngTableParams;
    var pageStatus;
    var operationManager;
    var fieldsManager;
    var identityDemo;
    var $httpBackend;
    var validUser ={"user":"admin","pass":"admin"};

    beforeEach(function() {
      resetFakeOperationManager();
      resetFakeFieldsManager();
		  inject(function($injector, _$filter_, _$location_, _$translate_, _$timeout_, _$interval_, _$httpBackend_, NgTableParams, PageStatus, OperationManager, FieldsManager, OperationStore, DocumentGroups, DocEntryConfiguration) {
        $httpBackend = _$httpBackend_;
        location = _$location_;
        injector = $injector;
        filter = _$filter_;
        translate = _$translate_;
        timeout = _$timeout_;
        interval = _$interval_;
        ngTableParams = NgTableParams;
        pageStatus = PageStatus;
        $httpBackend.whenPOST(baseUrl+'/authenticate',validUser).respond(200);
        $httpBackend.whenDELETE(baseUrl+'/authenticate').respond(200);
        $httpBackend.whenDELETE(baseUrl+'/identityDemo').respond(200);
        operationManager = $injector.get('OperationManager');
        fieldsManager = $injector.get('FieldsManager');
        identityDemo = $injector.get('$controller')('IdentityDemoCtrl',{$scope: $scope, OperationManager:fakeOperationManager, FieldsManager:fakeFieldsManager});
        identityDemo.resetAll();
      });
    });

    it('Should call OperationManager.finishOp() when terminated', function() {
      identityDemo.terminate();
      expect(fakePromiseValue).toBe('finishMock');
    });

    it('Should show an error when terminated is called and finishOp fails', function() {
      fakeOperationManager.finishOp =  function(){
        return fakePromise(false,'finishMock on error');
      },
      identityDemo.terminate();
      expect(identityDemo.modal).toBe(true);
      expect(identityDemo.error).toBe('finishMock on error');
    });

    it('Should reset all public values when resetAll is called', function() {

      identityDemo.clearIdentityImage = false;
      identityDemo.clearSignatureCardImage = false;
      identityDemo.clearIdentityFrontImage = false;
      identityDemo.clearIdentityDocEntry = false;
      identityDemo.clearSignatureCardDocEntry = false;
      identityDemo.clearIdentityFrontDocEntry = false;

      identityDemo.disableIdentityImage = false;
      identityDemo.disableSignatureCardImage = false;
      identityDemo.disableIdentityFrontImage = false;
      identityDemo.disableIdentityDocEntry = false;
      identityDemo.disableSignatureCardDocEntry = false;
      identityDemo.disableIdentityFrontDocEntry = false;
      identityDemo.mustClearIdentity = true;

      identityDemo.ocr.Identity = 'en';
      identityDemo.ocr.SignatureCard ='en';
      identityDemo.ocr.IdentityFront = 'en';
      identityDemo.imageUpdated.Identity = true;
      identityDemo.imageUpdated.SignatureCard =true;
      identityDemo.imageUpdated.SignatureCard = true;

      identityDemo.resetAll();

      expect(identityDemo.clearIdentityImage).toBe(true);
      expect(identityDemo.clearSignatureCardImage).toBe(true);
      expect(identityDemo.clearIdentityFrontImage).toBe(true);
      expect(identityDemo.clearIdentityDocEntry).toBe(true);
      expect(identityDemo.clearSignatureCardDocEntry).toBe(true);
      expect(identityDemo.clearIdentityFrontDocEntry).toBe(true);

      expect(identityDemo.disableIdentityImage).toBe(false);
      expect(identityDemo.disableSignatureCardImage).toBe(true);
      expect(identityDemo.disableIdentityFrontImage).toBe(true);
      expect(identityDemo.disableIdentityDocEntry).toBe(false);
      expect(identityDemo.disableSignatureCardDocEntry).toBe(true);
      expect(identityDemo.disableIdentityFrontDocEntry).toBe(true);

      expect(identityDemo.ocr.Identity).toBe('dis');
      expect(identityDemo.ocr.SignatureCard ='dis');
      expect(identityDemo.ocr.IdentityFront).toBe('dis');
      expect(identityDemo.imageUpdated.Identity).toBe(false);
      expect(identityDemo.imageUpdated.SignatureCard =false);
      expect(identityDemo.imageUpdated.SignatureCard).toBe(false);

    });

    it('Should call deleteOp and clean when cancel is called', function() {
      var cleaned = false;
      var deleted = false;
      fakeOperationManager.clean =  function(){
        cleaned = true;
        return fakePromise(true,'cleaned');
      };
      fakeOperationManager.deleteOp =  function(){
        deleted = true;
        return fakePromise(true,'deleteOpMock');
      };

      identityDemo.cancel();
      expect(cleaned && deleted).toBe(true);
    });

    it('Should call clean when newOp is called', function() {
      var cleaned = false;
      fakeOperationManager.clean =  function(){
        cleaned = true;
        return fakePromise(true,'cleaned');
      };
      identityDemo.newOperation();
      expect(cleaned).toBe(true);
    });

    it('Should call sendViewFile when uploadIdentityImage is called', function() {
      var send = false;
      fakeOperationManager.sendViewFile =  function(){
        send = true;
        return fakePromise(true,'send');
      };
      identityDemo.uploadIdentityImage();
      expect(send).toBe(true);
    });

    it('Should uploadSignatureCardImage', function() {
      var sentView = false;

      fakeOperationManager.sendViewFile = function(){
        sentView = true;
        return fakePromise(true,"sendViewFileMock");
      };

      identityDemo.uploadSignatureCardImage();
      expect(sentView).toBe(true);
    });

    it('Should uploadIdentityFrontImage', function() {
      var attrUp = false;
      var sentView = false;

      fakeFieldsManager.setAttributesValues = function(){
        attrUp = true;
        return fakePromise(true,"setAttributteMock");
      };

      fakeOperationManager.sendViewFile = function(){
        sentView = true;
        return fakePromise(true,"sendViewFileMock");
      };

      identityDemo.uploadIdentityFrontImage();
      expect(attrUp).toBe(true);
      expect(sentView).toBe(true);
      expect(attrUp && sentView).toBe(true);
    });

    it('Should isSignatureCardImageDisabled', function() {
      identityDemo.disableSignatureCardImage = false;
      expect(identityDemo.isSignatureCardImageDisabled()).toBe(false);
      identityDemo.disableSignatureCardImage = true;
      expect(identityDemo.isSignatureCardImageDisabled()).toBe(true);
    });

    it('Should isIdentityFrontImageDisabled', function() {
      identityDemo.disableIdentityFrontImage = false;
      expect(identityDemo.isIdentityFrontImageDisabled()).toBe(false);
      identityDemo.disableIdentityFrontImage = true;
      expect(identityDemo.isIdentityFrontImageDisabled()).toBe(true);
    });

    it('Should isTerminateButtonDisabled', function() {
      identityDemo.terminated = false;
      fakeOperationManager.isStarted = function(){return false;};
      expect(identityDemo.isTerminateButtonDisabled()).toBe(true);
      identityDemo.terminated = false;
      fakeOperationManager.isStarted = function(){return true;};
      expect(identityDemo.isTerminateButtonDisabled()).toBe(false);
      identityDemo.terminated = true;
      fakeOperationManager.isStarted = function(){return true;};
      expect(identityDemo.isTerminateButtonDisabled()).toBe(true);
      identityDemo.terminated = true;
      fakeOperationManager.isStarted = function(){return false;};
      expect(identityDemo.isTerminateButtonDisabled()).toBe(true);
    });

    it('Should isCancelButtonDisabled', function() {
      fakeOperationManager.isStarted = function(){return true;};
      expect(identityDemo.isCancelButtonDisabled()).toBe(false);
      fakeOperationManager.isStarted = function(){return false;};
      expect(identityDemo.isCancelButtonDisabled()).toBe(true);
    });


    it('Should load from configuration three documentTypes in identity configuration', function() {
      var numkeys = Object.keys(identityDemo.identityConfiguration).length;
      expect(numkeys).toEqual(3);
    });

    it('Should load from configuration two documentTypes in identityFront configuration', function() {
      var numkeys = Object.keys(identityDemo.identityFrontConfiguration).length;
      expect(numkeys).toEqual(2);
    });

    it('Should load from configuration one documentType in signature configuration', function() {
      var numkeys = Object.keys(identityDemo.signatureCardConfiguration).length;
      expect(numkeys).toEqual(1);
    });

    it('Should load from configuration three documentTypes in identity validation', function() {
      var numkeys = Object.keys(identityDemo.identityValidation).length;
      expect(numkeys).toEqual(4);
    });

    it('Should load from configuration two documentTypes in identityFront validation', function() {
      var numkeys = Object.keys(identityDemo.identityFrontValidation).length;
      expect(numkeys).toEqual(3);
    });

    it('Should load from configuration one documentType in signature validation', function() {
      var numkeys = Object.keys(identityDemo.signatureCardValidation).length;
      expect(numkeys).toEqual(1);
    });

    it('Should load from configuration five documentTypes in opposite documents', function() {
      var numkeys = Object.keys(identityDemo.opposite).length;
      expect(numkeys).toEqual(7);
    });

    it('Should load from configuration one Group in ExceptionRules ', function() {
      var numkeys = Object.keys(identityDemo.sentExceptionRules).length;
      expect(numkeys).toEqual(1);
    });

  });

});

