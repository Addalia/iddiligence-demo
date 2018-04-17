'use strict';

describe('CloudIDocValidationDemo DisplayDemo controller', function() {

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
                        "DemoApp": {
                          "title": "DOC_AUTO_LABEL",
                          "doctype": "Not_Recognized_Identity",
                          "fields": []
                        }
                    },
                    "Not_Recognized_Income":{
                        "DemoApp": {
                          "title": "DOC_AUTO_LABEL",
                          "doctype": "Not_Recognized_Income",
                          "fields": []
                        }
                    },
                    "Not_Recognized_Receipt":{
                        "DemoApp": {
                          "title": "DOC_AUTO_LABEL",
                          "doctype": "Not_Recognized_Receipt",
                          "fields": []
                        }
                    },
                    "Dni" : {
                        "DemoApp": {
                              "title": "DNI_LABEL",
                              "doctype": "Dni",
                              "fields": [
                                {"label": "IDENTIFICATION_NUMBER_LABEL", "attrname": "dni_number", "controltype": "text", "required": "false", "show": "false", "id": "dninumber"},
                                {"label": "FIRST_NAME_LABEL", "attrname": "dni_first_name", "controltype": "text", "required": "false", "show": "false", "id": "dnifirstname"},
                                {"label": "LAST_NAME_LABEL", "attrname": "dni_last_name", "controltype": "text", "required": "false", "show": "false", "id": "dnilastname"},
                                {"label": "BIRTHDATE_LABEL", "attrname": "dni_birthdate", "controltype": "text", "required": "false", "show": "false", "id": "dnibirthdate"},
                                {"label": "EXPIRATION_DATE_LABEL", "attrname": "dni_expiration_date", "controltype": "text", "required": "false", "show": "false", "id": "dniexpirationdate"}
                              ]
                        }
                    },
                    "NIE" : {
                        "DemoApp" : {
                                "title": "NIE_LABEL",
                                "doctype": "NIE",
                                "fields": [
                                  {"label": "IDENTIFICATION_NUMBER_LABEL", "attrname": "nie_number", "controltype": "text", "required": "false", "show": "false", "id": "nienumber"}
                                ]
                        }
                    },
                    "Passport" : {
                        "DemoApp" : {
                                "title": "PASSPORT_LABEL",
                                "doctype": "Passport",
                                "fields": []
                        }
                    },
                    "Paysheet":{
                        "DemoApp" : {
                                "title": "PAYSHEET_LABEL",
                                "doctype": "Paysheet",
                                "fields": [
                                    {"label": "AMOUNT_LABEL", "attrname": "paysheet_amount", "controltype": "text", "required": "true", "show": "true", "id": "paysheetamount"}
                                ]
                        }
                    },
                    "IRPF":{
                        "DemoApp" : {
                                "title": "IRPF_LABEL",
                                "doctype": "IRPF",
                                "fields": [
                                    {"label": "AMOUNT_LABEL", "attrname": "IRPF_amount", "controltype": "text", "required": "true", "show": "true", "id": "irpfamount"}
                                ]
                        }
                    },
                    "Bank_Receipt":{
                        "DemoApp" : {
                                "title": "BANK_RECEIPT_LABEL",
                                "doctype": "Bank_Receipt",
                                "fields": [
                                    {"label": "ACCOUNT_LABEL", "attrname": "bank_receipt_account_number", "controltype": "text", "required": "true", "show": "true", "id": "bankreceiptaccount"}
                                ]
                        }
                    },
                    "Receipt":{
                        "DemoApp" : {
                                "title": "RECEIPT_LABEL",
                                "doctype": "Receipt",
                                "fields": [
                                ]
                        }
                    }
                  },
                  "validationConfiguration" : {
                      "Dni" : {
                        "DemoApp": {
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
                        "DemoApp" : {
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
                        "DemoApp" : {
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
                        "DemoApp" : {
                          "status":"dis",
                          "validations":{ "EQUALS_NAME_INCOME_LABEL":"dis",
                                  "EQUALS_AMOUNT_LABEL":"dis"}
                        }
                      },
                      "IRPF" : {
                        "DemoApp" : {
                          "status":"dis",
                          "validations":{ "EQUALS_NAME_INCOME_LABEL":"dis",
                                  "EQUALS_AMOUNT_LABEL":"dis"}
                        }
                      },
                      "Bank_Receipt" : {
                        "DemoApp" : {
                          "status":"dis",
                          "validations":{ "EQUALS_NAME_RECEIPT_LABEL":"dis",
                                  "EQUALS_ACCOUNT_LABEL":"dis"}
                        }
                      },
                      "Receipt" : {
                        "DemoApp" : {
                          "status":"dis",
                          "validations":{ "EQUALS_IDENTIFICATION_NUMBER_LABEL":"dis",
                                  "EQUALS_DATE_LABEL":"dis"}
                        }
                      },
                      "Not_Recognized_Identity" : {
                        "DemoApp" : {
                          "status":"dis",
                          "validations":{},
                          "attribs" :{}
                        }
                      },
                      "Not_Recognized_Income" : {
                        "DemoApp" : {
                          "status":"dis",
                          "validations":{},
                          "attribs" :{}
                        }
                      },
                      "Not_Recognized_Receipt" : {
                        "DemoApp" : {
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

  describe('CloudIDoc DisplayDemo.controller', function() {

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
    var displayDemo;
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
        $httpBackend.whenDELETE(baseUrl+'/validationDemo').respond(200);
        operationManager = $injector.get('OperationManager');
        fieldsManager = $injector.get('FieldsManager');
        displayDemo = $injector.get('$controller')('ValidationDemoCtrl',{$scope: $scope, OperationManager:fakeOperationManager, FieldsManager:fakeFieldsManager});
        displayDemo.resetAll();
      });
    });

    it('Should call OperationManager.finishOp() when terminated', function() {
      displayDemo.terminate();
      expect(fakePromiseValue).toBe('finishMock');
    });

    it('Should show an error when terminated is called and finishOp fails', function() {
      fakeOperationManager.finishOp =  function(){
        return fakePromise(false,'finishMock on error');
      },
      displayDemo.terminate();
      expect(displayDemo.modal).toBe(true);
      expect(displayDemo.error).toBe('finishMock on error');
    });

    it('Should reset all public values when resetAll is called', function() {

      displayDemo.clearIdentityImage = false;
      displayDemo.clearIncomeImage = false;
      displayDemo.clearReceiptImage = false;
      displayDemo.clearIdentityDocEntry = false;
      displayDemo.clearIncomeDocEntry = false;
      displayDemo.clearReceiptDocEntry = false;

      displayDemo.disableIdentityImage = false;
      displayDemo.disableIncomeImage = false;
      displayDemo.disableReceiptImage = false;
      displayDemo.disableIdentityDocEntry = false;
      displayDemo.disableIncomeDocEntry = false;
      displayDemo.disableReceiptDocEntry = false;
      displayDemo.mustClearIdentity = true;

      displayDemo.ocr.Identity = 'en';
      displayDemo.ocr.Income ='en';
      displayDemo.ocr.Receipt = 'en';
      displayDemo.imageUpdated.Identity = true;
      displayDemo.imageUpdated.Income =true;
      displayDemo.imageUpdated.Receipt = true;
      //displayDemo.attribs.paysheet_amount = 'things';
      //displayDemo.attribs.bank_receipt_account_number = 'things';

      displayDemo.resetAll();

      expect(displayDemo.clearIdentityImage).toBe(true);
      expect(displayDemo.clearIncomeImage).toBe(true);
      expect(displayDemo.clearReceiptImage).toBe(true);
      expect(displayDemo.clearIdentityDocEntry).toBe(true);
      expect(displayDemo.clearIncomeDocEntry).toBe(true);
      expect(displayDemo.clearReceiptDocEntry).toBe(true);

      expect(displayDemo.disableIdentityImage).toBe(false);
      expect(displayDemo.disableIncomeImage).toBe(true);
      expect(displayDemo.disableReceiptImage).toBe(true);
      expect(displayDemo.disableIdentityDocEntry).toBe(false);
      expect(displayDemo.disableIncomeDocEntry).toBe(true);
      expect(displayDemo.disableReceiptDocEntry).toBe(true);

      expect(displayDemo.ocr.Identity).toBe('dis');
      expect(displayDemo.ocr.Income ='dis');
      expect(displayDemo.ocr.Receipt).toBe('dis');
      expect(displayDemo.imageUpdated.Identity).toBe(false);
      expect(displayDemo.imageUpdated.Income =false);
      expect(displayDemo.imageUpdated.Receipt).toBe(false);
      //expect(displayDemo.attribs.paysheet_amount).toBe('');
      //expect(displayDemo.attribs.bank_receipt_account_number).toBe('');

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

      displayDemo.cancel();
      expect(cleaned && deleted).toBe(true);
    });

    it('Should call clean when newOp is called', function() {
      var cleaned = false;
      fakeOperationManager.clean =  function(){
        cleaned = true;
        return fakePromise(true,'cleaned');
      };
      displayDemo.newOperation();
      expect(cleaned).toBe(true);
    });

    it('Should call sendViewFile when uploadIdentityImage is called', function() {
      var send = false;
      fakeOperationManager.sendViewFile =  function(){
        send = true;
        return fakePromise(true,'send');
      };
      displayDemo.uploadIdentityImage();
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

      displayDemo.uploadIncomeImage();
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

      displayDemo.uploadReceiptImage();
      expect(attrUp).toBe(true);
      expect(sentView).toBe(true);
      expect(attrUp && sentView).toBe(true);
    });

    it('Should isIncomeImageDisabled', function() {
      displayDemo.disableIncomeImage = false;
      //displayDemo.attribs.paysheet_amount = '';
      expect(displayDemo.isIncomeImageDisabled()).toBe(false);
      displayDemo.disableIncomeImage = true;
      //displayDemo.attribs.paysheet_amount = 'asda';
      expect(displayDemo.isIncomeImageDisabled()).toBe(true);
      displayDemo.disableIncomeImage = true;
      //displayDemo.attribs.paysheet_amount = '';
      expect(displayDemo.isIncomeImageDisabled()).toBe(true);
      displayDemo.disableIncomeImage = false;
      //displayDemo.attribs.paysheet_amount = 'asd';
      expect(displayDemo.isIncomeImageDisabled()).toBe(false);
    });

    it('Should isReceiptImageDisabled', function() {
      displayDemo.disableReceiptImage = false;
      //displayDemo.attribs.bank_receipt_account_number = '';
      expect(displayDemo.isReceiptImageDisabled()).toBe(false);
      displayDemo.disableReceiptImage = true;
      //displayDemo.attribs.bank_receipt_account_number = 'asda';
      expect(displayDemo.isReceiptImageDisabled()).toBe(true);
      displayDemo.disableReceiptImage = true;
      //displayDemo.attribs.bank_receipt_account_number = '';
      expect(displayDemo.isReceiptImageDisabled()).toBe(true);
      displayDemo.disableReceiptImage = false;
      //displayDemo.attribs.bank_receipt_account_number = 'asd';
      expect(displayDemo.isReceiptImageDisabled()).toBe(false);
    });

    it('Should isTerminateButtonDisabled', function() {
      displayDemo.terminated = false;
      fakeOperationManager.isStarted = function(){return false;};
      expect(displayDemo.isTerminateButtonDisabled()).toBe(true);
      displayDemo.terminated = false;
      fakeOperationManager.isStarted = function(){return true;};
      expect(displayDemo.isTerminateButtonDisabled()).toBe(false);
      displayDemo.terminated = true;
      fakeOperationManager.isStarted = function(){return true;};
      expect(displayDemo.isTerminateButtonDisabled()).toBe(true);
      displayDemo.terminated = true;
      fakeOperationManager.isStarted = function(){return false;};
      expect(displayDemo.isTerminateButtonDisabled()).toBe(true);
    });

    it('Should isCancelButtonDisabled', function() {
      fakeOperationManager.isStarted = function(){return true;};
      expect(displayDemo.isCancelButtonDisabled()).toBe(false);
      fakeOperationManager.isStarted = function(){return false;};
      expect(displayDemo.isCancelButtonDisabled()).toBe(true);
    });

  });

});

