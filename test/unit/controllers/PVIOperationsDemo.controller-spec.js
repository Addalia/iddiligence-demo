'use strict';

describe('CloudIDocValidationDemo PVIOperationsDemo controller', function() {

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
      getViewFile : function(){return fakePromise(true,"getViewFileMock");},
      updateAuthorization : function(){return fakePromise(true,"updateAuthorizationMock");}
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
        var envConfig = { "restUrl": "http://localhost:8080/IDocValidationService/resources",
                  "documentGroups" : {
                    "Not_Recognized_Identity" : "Identity",
                    "Dni":"Identity",
                    "NIE":"Identity",
                    "Passport":"Identity",
                    "Not_Recognized_IdentityFront" : "IdentityFront",
                    "Dni_front":"IdentityFront",
                    "NIE_front":"IdentityFront",
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
                    "Not_Recognized_Identity":{
                        "PVIApp": {
                          "title": "DOC_AUTO_LABEL",
                          "doctype": "Not_Recognized_Identity",
                          "fields": []
                        }
                    },
                    "Not_Recognized_Income":{
                        "PVIApp": {
                          "title": "DOC_AUTO_LABEL",
                          "doctype": "Not_Recognized_Income",
                          "fields": []
                        }
                    },
                    "Not_Recognized_Receipt":{
                        "PVIApp": {
                          "title": "DOC_AUTO_LABEL",
                          "doctype": "Not_Recognized_Receipt",
                          "fields": []
                        }
                    },
                    "Dni" : {
                        "PVIApp": {
                              "title": "DNI_LABEL",
                              "doctype": "Dni",
                              "fields": [
                                {"label": "IDENTIFICATION_NUMBER_LABEL", "attrname": "dni_number", "controltype": "text", "required": "false", "show": "false", "id": "dninumber"},
                                {"label": "FIRST_NAME_LABEL", "attrname": "dni_first_name", "controltype": "text", "required": "false", "show": "false", "id": "dnifirstname"},
                                {"label": "LAST_NAME_LABEL", "attrname": "dni_last_name", "controltype": "text", "required": "false", "show": "false", "id": "dnilastname"},
                                {"label": "BIRTHDATE_LABEL", "attrname": "dni_birthdate", "controltype": "date", "required": "false", "show": "false", "id": "dnibirthdate"},
                                {"label": "EXPIRATION_DATE_LABEL", "attrname": "dni_expiration_date", "controltype": "date", "required": "false", "show": "false", "id": "dniexpirationdate"},
                                {"label": "TELEPHONE_NUMBER_LABEL", "attrname": "dni_telephone", "controltype": "text", "required": "true", "show": "true", "id": "dnitelephonenumber"},
                                {"label": "AUTHORIZATION_LABEL", "attrname": "operation_user_authorization", "controltype": "text", "required": "true", "show": "true", "id": "authorization"}
                              ]
                        }
                    },
                    "NIE" : {
                        "PVIApp" : {
                                "title": "NIE_LABEL",
                                "doctype": "NIE",
                                "fields": [
                                  {"label": "IDENTIFICATION_NUMBER_LABEL", "attrname": "nie_number", "controltype": "text", "required": "false", "show": "false", "id": "nienumber"},
                                ]
                        }
                    },
                    "Passport" : {
                        "PVIApp" : {
                                "title": "PASSPORT_LABEL",
                                "doctype": "Passport",
                                "fields": []
                        }
                    },
                    "Paysheet":{
                        "PVIApp" : {
                                "title": "PAYSHEET_LABEL",
                                "doctype": "Paysheet",
                                "fields": [
                                    {"label": "AMOUNT_LABEL", "attrname": "paysheet_amount", "controltype": "text", "required": "true", "show": "true", "id": "paysheetamount"}
                                ]
                        }
                    },
                    "IRPF":{
                        "PVIApp" : {
                                "title": "IRPF_LABEL",
                                "doctype": "IRPF",
                                "fields": [
                                    {"label": "AMOUNT_LABEL", "attrname": "IRPF_amount", "controltype": "text", "required": "true", "show": "true", "id": "irpfamount"}
                                ]
                        }
                    },
                    "Bank_Receipt":{
                        "PVIApp" : {
                                "title": "BANK_RECEIPT_LABEL",
                                "doctype": "Bank_Receipt",
                                "fields": [
                                    {"label": "ACCOUNT_LABEL", "attrname": "bank_receipt_account_number", "controltype": "text", "required": "true", "show": "true", "id": "bankreceiptaccount"}
                                ]
                        }
                    },
                    "Receipt":{
                        "PVIApp" : {
                                "title": "RECEIPT_LABEL",
                                "doctype": "Receipt",
                                "fields": [
                                ]
                        }
                    }
                  },
                  "validationConfiguration" : {
                      "Dni" : {
                        "PVIApp": {
                          "status" :"dis",
                          "headers" : [],
                          "attribs" : { "FIRST_NAME_LABEL" : {"value" : "", "checks" : []},
                                "LAST_NAME_LABEL" : {"value" : "", "checks" : []},
                                "IDENTIFICATION_NUMBER_LABEL" : {"value" : "", "checks" : []},
                                "EXPIRATION_DATE_LABEL" : {"value" : "", "checks" : []}
                                }
                        }
                      },
                      "NIE" : {
                        "PVIApp" : {
                          "status":"dis",
                          "headers" : [],
                          "attribs" : { "FIRST_NAME_LABEL" : {"value" : "", "checks" : []},
                                "LAST_NAME_LABEL" : {"value" : "", "checks" : []},
                                "IDENTIFICATION_NUMBER_LABEL" : {"value" : "", "checks" : []},
                                "EXPIRATION_DATE_LABEL" : {"value" : "", "checks" : []}
                                }
                        }
                      },
                      "Passport" : {
                        "PVIApp" : {
                          "status":"dis",
                          "headers" : [],
                          "attribs" : { "FIRST_NAME_LABEL" : {"value" : "", "checks" : []},
                                "LAST_NAME_LABEL" : {"value" : "", "checks" : []},
                                "IDENTIFICATION_NUMBER_LABEL" : {"value" : "", "checks" : []},
                                "EXPIRATION_DATE_LABEL" : {"value" : "", "checks" : []}
                                }
                        }
                      },
                      "Paysheet" : {
                        "PVIApp" : {
                          "status":"dis",
                          "validations":{ "EQUALS_NAME_INCOME_LABEL":"dis",
                                  "EQUALS_AMOUNT_LABEL":"dis"}
                        }
                      },
                      "IRPF" : {
                        "PVIApp" : {
                          "status":"dis",
                          "validations":{ "EQUALS_NAME_INCOME_LABEL":"dis",
                                  "EQUALS_AMOUNT_LABEL":"dis"}
                        }
                      },
                      "Bank_Receipt" : {
                        "PVIApp" : {
                          "status":"dis",
                          "validations":{ "EQUALS_NAME_RECEIPT_LABEL":"dis",
                                  "EQUALS_ACCOUNT_LABEL":"dis"}
                        }
                      },
                      "Receipt" : {
                        "PVIApp" : {
                          "status":"dis",
                          "validations":{ "EQUALS_IDENTIFICATION_NUMBER_LABEL":"dis",
                                  "EQUALS_DATE_LABEL":"dis"}
                        }
                      },
                      "Not_Recognized_Identity" : {
                        "PVIApp" : {
                          "status":"dis",
                          "validations":{},
                          "attribs" :{}
                        }
                      },
                      "Not_Recognized_Income" : {
                        "PVIApp" : {
                          "status":"dis",
                          "validations":{},
                          "attribs" :{}
                        }
                      },
                      "Not_Recognized_Receipt" : {
                        "PVIApp" : {
                          "status":"dis",
                          "validations":{},
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

  describe('CloudIDoc PVIOperationsDemo.controller', function() {

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
    var pviOperationsDemo;
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
        $httpBackend.whenDELETE(baseUrl+'/pviOperationsDemo').respond(200);
        operationManager = $injector.get('OperationManager');
        fieldsManager = $injector.get('FieldsManager');
        pviOperationsDemo = $injector.get('$controller')('PVIOperationsDemoCtrl',{$scope: $scope, OperationManager:fakeOperationManager, FieldsManager:fakeFieldsManager});
        pviOperationsDemo.resetAll();
      });
    });

    it('Should call OperationManager.finishOp() when terminated', function() {
      pviOperationsDemo.terminate();
      expect(fakePromiseValue).toBe('finishMock');
    });

    it('Should show an error when terminated is called and finishOp fails', function() {
      fakeOperationManager.finishOp =  function(){
        return fakePromise(false,'finishMock on error');
      },
      pviOperationsDemo.terminate();
      expect(pviOperationsDemo.modal).toBe(true);
      expect(pviOperationsDemo.modalmsg).toBe('finishMock on error');
    });

    it('Should reset all public values when resetAll is called', function() {

      pviOperationsDemo.clearIdentityImage = false;
      pviOperationsDemo.clearIncomeImage = false;
      pviOperationsDemo.clearReceiptImage = false;
      pviOperationsDemo.clearIdentityDocEntry = false;
      pviOperationsDemo.clearIncomeDocEntry = false;
      pviOperationsDemo.clearReceiptDocEntry = false;

      pviOperationsDemo.disableIdentityImage = false;
      pviOperationsDemo.disableIncomeImage = false;
      pviOperationsDemo.disableReceiptImage = false;
      pviOperationsDemo.disableIdentityDocEntry = false;
      pviOperationsDemo.disableIncomeDocEntry = false;
      pviOperationsDemo.disableReceiptDocEntry = false;
      pviOperationsDemo.mustClearIdentity = true;

      pviOperationsDemo.opStatus = '';
      pviOperationsDemo.opUserAuthorization = '0';

      pviOperationsDemo.ocr.Identity = 'en';
      pviOperationsDemo.ocr.Income ='en';
      pviOperationsDemo.ocr.Receipt = 'en';
      pviOperationsDemo.imageUpdated.Identity = true;
      pviOperationsDemo.imageUpdated.Income =true;
      pviOperationsDemo.imageUpdated.Receipt = true;

      pviOperationsDemo.resetAll();

      expect(pviOperationsDemo.clearIdentityImage).toBe(true);
      expect(pviOperationsDemo.clearIncomeImage).toBe(true);
      expect(pviOperationsDemo.clearReceiptImage).toBe(true);
      expect(pviOperationsDemo.clearIdentityDocEntry).toBe(true);
      expect(pviOperationsDemo.clearIncomeDocEntry).toBe(true);
      expect(pviOperationsDemo.clearReceiptDocEntry).toBe(true);

      expect(pviOperationsDemo.disableIdentityImage).toBe(false);
      expect(pviOperationsDemo.disableIncomeImage).toBe(true);
      expect(pviOperationsDemo.disableReceiptImage).toBe(true);
      expect(pviOperationsDemo.disableIdentityDocEntry).toBe(false);
      expect(pviOperationsDemo.disableIncomeDocEntry).toBe(true);
      expect(pviOperationsDemo.disableReceiptDocEntry).toBe(true);

      expect(pviOperationsDemo.ocr.Identity).toBe('dis');
      expect(pviOperationsDemo.ocr.Income ='dis');
      expect(pviOperationsDemo.ocr.Receipt).toBe('dis');
      expect(pviOperationsDemo.imageUpdated.Identity).toBe(false);
      expect(pviOperationsDemo.imageUpdated.Income =false);
      expect(pviOperationsDemo.imageUpdated.Receipt).toBe(false);

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

      pviOperationsDemo.cancel();
      expect(cleaned && deleted).toBe(true);
    });

    it('Should call clean when newOp is called', function() {
      var cleaned = false;
      fakeOperationManager.clean =  function(){
        cleaned = true;
        return fakePromise(true,'cleaned');
      };
      pviOperationsDemo.newOperation();
      expect(cleaned).toBe(true);
    });

    it('Should call sendViewFile when uploadIdentityImage is called', function() {
      var send = false;
      fakeOperationManager.sendViewFile =  function(){
        send = true;
        return fakePromise(true,'send');
      };
      pviOperationsDemo.uploadIdentityImage();
      expect(send).toBe(true);
    });

    it('Should uploadIncomeImage', function() {
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

      pviOperationsDemo.uploadIncomeImage();
      expect(attrUp).toBe(true);
      expect(sentView).toBe(true);
      expect(attrUp && sentView).toBe(true);
    });

    it('Should uploadReceiptImage', function() {
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

      pviOperationsDemo.uploadReceiptImage();
      expect(attrUp).toBe(true);
      expect(sentView).toBe(true);
      expect(attrUp && sentView).toBe(true);
    });

    it('Should isIncomeImageDisabled', function() {
      pviOperationsDemo.disableIncomeImage = false;
      expect(pviOperationsDemo.isIncomeImageDisabled()).toBe(false);
      pviOperationsDemo.disableIncomeImage = true;
      expect(pviOperationsDemo.isIncomeImageDisabled()).toBe(true);
      pviOperationsDemo.disableIncomeImage = true;
      expect(pviOperationsDemo.isIncomeImageDisabled()).toBe(true);
      pviOperationsDemo.disableIncomeImage = false;
      expect(pviOperationsDemo.isIncomeImageDisabled()).toBe(false);
    });

    it('Should isReceiptImageDisabled', function() {
      pviOperationsDemo.disableReceiptImage = false;
      expect(pviOperationsDemo.isReceiptImageDisabled()).toBe(false);
      pviOperationsDemo.disableReceiptImage = true;
      expect(pviOperationsDemo.isReceiptImageDisabled()).toBe(true);
      pviOperationsDemo.disableReceiptImage = true;
      expect(pviOperationsDemo.isReceiptImageDisabled()).toBe(true);
      pviOperationsDemo.disableReceiptImage = false;
      expect(pviOperationsDemo.isReceiptImageDisabled()).toBe(false);
    });

    it('Should isTerminateButtonDisabled', function() {
      pviOperationsDemo.terminated = false;
      fakeOperationManager.isStarted = function(){return false;};
      expect(pviOperationsDemo.isTerminateButtonDisabled()).toBe(true);
      pviOperationsDemo.terminated = false;
      fakeOperationManager.isStarted = function(){return true;};
      expect(pviOperationsDemo.isTerminateButtonDisabled()).toBe(false);
      pviOperationsDemo.terminated = true;
      fakeOperationManager.isStarted = function(){return true;};
      expect(pviOperationsDemo.isTerminateButtonDisabled()).toBe(true);
      pviOperationsDemo.terminated = true;
      fakeOperationManager.isStarted = function(){return false;};
      expect(pviOperationsDemo.isTerminateButtonDisabled()).toBe(true);
    });

    it('Should isCancelButtonDisabled', function() {
      fakeOperationManager.isStarted = function(){return true;};
      expect(pviOperationsDemo.isCancelButtonDisabled()).toBe(false);
      fakeOperationManager.isStarted = function(){return false;};
      expect(pviOperationsDemo.isCancelButtonDisabled()).toBe(true);
    });

  });

});

