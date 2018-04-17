'use strict';

describe('CloudIDocValidationDemo FaceRecognitionDemo controller', function() {

  var $rootScope;
  var $scope;
  var $httpBackend;
  var requestI18n_es;
  var requestI18n_en;
  var baseUrl;
  var envConfig;
  var fakePromiseValue;
  var fakePatternManager;
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

  var resetFakePatternManager = function() {
    fakePatternManager = {
      initPattern:function(){return;},
      clean : function(){return;},
      getMediaStat : function(){return fakePromise(true,"getMediaStatmock");},
      finishOp : function(){return fakePromise(true,"finishMock");},
      deletePat : function(){return fakePromise(true,"deletePatMock");},
      deleteOp : function(){return fakePromise(true,"deleteOpMock");},
      isTerminated : function(){return false;},
      isStarted : function(){return false;},
      setTerminated : function(){return;},
      getPattern : function(){return fakePromise(true,"getPatternMock");},
      setAttributte : function(){return fakePromise(true,"setAttributteMock");},
      sendPatternFile : function(){return fakePromise(true,"sendPatternFileMock");},
      getViewFile : function(){return fakePromise(true,"getViewFileMock");}
    };
  };

  beforeEach(function() {
    module('app');
    module('app.service-core');
    module('app.service-user');
    module('app.service-operationmanager');
    module('app.service-patternmanager');
    module('app.service-fieldsmanager');
    module('app.service-operationstore');
    module('app.service-patternstore');
    module('app.document-groups');
    module('app.doc-entry-configuration');
    module('app.validation-configuration');
    module('app.validation-manager');
    module('app.pattern-attribute-manager');
    module('app.service-view');

    module(function ($provide) {
      $provide.provider('EnvConfig', function(){
        var envConfig = {
          "restUrl": "http://localhost:8080/IDocValidationService/resources",
          "documentGroups" : {
            "Pattern":"Pattern",
            "Media" : "Pattern",
            "IdentityMedia": "IdentityMedia"
          },
          "docEntryConfiguration" : {
            "Pattern" : {
                "FaceRecognitionApp": {
                  "title": "REFERENCE_PATTERN_LABEL",
                  "doctype": "Pattern",
                  "fields": [
                    {"label": "PATTERN_NAME_LABEL", "attrname": "pattern_name", "controltype": "text", "required": "false", "show": "true", "id": "patternname"},
                    {"label": "PATTERN_NUMBER_LABEL", "attrname": "pattern_number", "controltype": "text", "required": "true", "show": "true", "id": "patternnumber"}
                  ]
                }
            },
            "Media" : {
                "FaceRecognitionApp": {
                  "title": "REFERENCE_PATTERN_LABEL",
                  "doctype": "Media",
                  "fields": []
                }
            },
            "IdentityMedia" : {
                "FaceRecognitionApp": {
                  "title": "IDENTITY_MEDIA_LABEL",
                  "doctype": "IdentityMedia",
                  "fields": [
                    {"label": "PATTERN_ID", "attrname": "identity_media_pattern_id", "controltype": "text", "required": "true", "show": "false", "id": "identitymediapatternid"}
                  ]

                }
            }
          },
          "validationConfiguration" : {
            "Pattern": {
              "FaceRecognitionApp": {
                "status" : "dis",
                "validations" : {},
                "attribs" : { "PATTERN_NAME_LABEL" : {"value" : "", "checks" : []},
                      "PATTERN_NUMBER_LABEL" : {"value" : "", "checks" : []}}
              }
            },
            "IdentityMedia" : {
              "FaceRecognitionApp" : {
                "status" : "dis",
                "validations" : {},
                "attribs" : { "PERCENTAGE_OF_COINCIDENCE_LABEL" : {"value" : "", "checks" : []}}
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

  describe('CloudIDoc faceRecognitionDemo.controller', function() {

    var injector;
    var filter;
    var location;
    var translate;
    var timeout;
    var interval;
    var ngTableParams;
    var pageStatus;
    var operationManager;
    var patternManager;
    var fieldsManager;
    var faceRecognitionDemo;
    var faceRecognitionDemo1;
    var $httpBackend;
    var validUser ={"user":"admin","pass":"admin"};

    beforeEach(function() {
      resetFakePatternManager();
      resetFakeFieldsManager();
      inject(function($injector, _$filter_, _$location_, _$translate_, _$timeout_, _$interval_, _$httpBackend_, NgTableParams, PageStatus, OperationManager, PatternManager, FieldsManager, OperationStore, PatternStore, DocumentGroups, DocEntryConfiguration, ValidationConfiguration, ValidationManager) {
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
        $httpBackend.whenDELETE(baseUrl+'/faceRecognitionDemo').respond(200);
        operationManager = $injector.get('OperationManager');
        patternManager = $injector.get('PatternManager');
        fieldsManager = $injector.get('FieldsManager');
        faceRecognitionDemo = $injector.get('$controller')('FaceRecognitionDemoCtrl',{$scope: $scope, OperationManager:fakePatternManager, FieldsManager:fakeFieldsManager});
        faceRecognitionDemo1 = $injector.get('$controller')('FaceRecognitionDemoCtrl',{$scope: $scope, PatternManager:fakePatternManager, FieldsManager:fakeFieldsManager});
        faceRecognitionDemo.resetAll();
        faceRecognitionDemo1.resetAll();
      });
    });

    it('Should call OperationManager.finishOp() when terminated', function() {
      faceRecognitionDemo.terminate();
      expect(fakePromiseValue).toBe('finishMock');
    });

    it('Should show an error when terminated is called and finishOp fails', function() {
      fakePatternManager.finishOp =  function(){
        return fakePromise(false,'finishMock on error');
      },
      faceRecognitionDemo.terminate();
      expect(faceRecognitionDemo.modal).toBe(true);
      expect(faceRecognitionDemo.error).toBe('finishMock on error');
    });

    it('Should reset all public values when resetAll is called', function() {

      faceRecognitionDemo.clearReferencePatternImage = false;
      faceRecognitionDemo.clearIdentityMediaImage = false;
      faceRecognitionDemo.clearReferencePatternDocEntry = false;
      faceRecognitionDemo.clearIdentityMediaDocEntry = false;

      faceRecognitionDemo.disableReferencePatternImage = false;
      faceRecognitionDemo.disableIdentityMediaImage = false;
      faceRecognitionDemo.disableReferencePatternDocEntry = false;
      faceRecognitionDemo.disableIdentityMediaDocEntry = false;
      faceRecognitionDemo.mustClearReferencePattern = true;

      faceRecognitionDemo.ocr.ReferencePattern = 'en';
      faceRecognitionDemo.ocr.IdentityMedia ='en';
      faceRecognitionDemo.imageUpdated.ReferencePattern = true;
      faceRecognitionDemo.imageUpdated.IdentityMedia =true;

      faceRecognitionDemo.resetAll();

      expect(faceRecognitionDemo.clearReferencePatternImage).toBe(true);
      expect(faceRecognitionDemo.clearIdentityMediaImage).toBe(true);
      expect(faceRecognitionDemo.clearReferencePatternDocEntry).toBe(true);
      expect(faceRecognitionDemo.clearIdentityMediaDocEntry).toBe(true);

      expect(faceRecognitionDemo.disableReferencePatternImage).toBe(false);
      expect(faceRecognitionDemo.disableIdentityMediaImage).toBe(true);
      expect(faceRecognitionDemo.disableReferencePatternDocEntry).toBe(false);
      expect(faceRecognitionDemo.disableIdentityMediaDocEntry).toBe(true);

      expect(faceRecognitionDemo.ocr.ReferencePattern).toBe('dis');
      expect(faceRecognitionDemo.ocr.IdentityMedia ='dis');
      expect(faceRecognitionDemo.imageUpdated.ReferencePattern).toBe(false);
      expect(faceRecognitionDemo.imageUpdated.IdentityMedia =false);
      expect(faceRecognitionDemo.imageUpdated.IdentityMedia).toBe(false);

    });

    it('Should call deletePat and clean when cancel is called', function() {
      var cleaned = false;
      var deleted = false;
      fakePatternManager.clean =  function(){
        cleaned = true;
        return fakePromise(true,'cleaned');
      };
      fakePatternManager.deleteOp =  function(){
        deleted = true;
        return fakePromise(true,'deleteOpMock');
      };
      fakePatternManager.deletePat =  function(){
        deleted = true;
        return fakePromise(true,'deletePatMock');
      };

      faceRecognitionDemo.cancel();
      expect(cleaned && deleted).toBe(true);
    });

    it('Should call clean when newOp is called', function() {
      var cleaned = false;
      fakePatternManager.clean =  function(){
        cleaned = true;
        return fakePromise(true,'cleaned');
      };
      faceRecognitionDemo.newOperation();
      expect(cleaned).toBe(true);
    });

    it('Should call sendPatternFile when uploadReferencePatternImage is called', function() {
      var send = false;
      fakePatternManager.sendPatternFile =  function(){
        send = true;
        return fakePromise(true,'sendPatternFileMock');
      };
      faceRecognitionDemo1.uploadReferencePatternImage();
      expect(send).toBe(true);
    });

    it('Should uploadIdentityMediaImage', function() {
      var sentView = false;

      fakePatternManager.sendViewFile = function(){
        sentView = true;
        return fakePromise(true,"sendViewFileMock");
      };

      faceRecognitionDemo.uploadIdentityMediaImage();
      expect(sentView).toBe(true);
    });

    it('Should uploadReferencePatternImage', function() {
      var attrUp = false;
      var sentView = false;

      fakeFieldsManager.setAttributesValues = function(){
        attrUp = true;
        return fakePromise(true,"setAttributteMock");
      };

      fakePatternManager.sendPatternFile = function(){
        sentView = true;
        return fakePromise(true,"sendPatternFileMock");
      };

      faceRecognitionDemo1.uploadReferencePatternImage();
      expect(attrUp).toBe(true);
      expect(sentView).toBe(true);
      expect(attrUp && sentView).toBe(true);
    });

    it('Should isIdentityMediaImageDisabled', function() {
      faceRecognitionDemo.disableIdentityMediaImage = false;
      expect(faceRecognitionDemo.isIdentityMediaImageDisabled()).toBe(false);
      faceRecognitionDemo.disableIdentityMediaImage = true;
      expect(faceRecognitionDemo.isIdentityMediaImageDisabled()).toBe(true);
    });

    it('Should isTerminateButtonDisabled', function() {
      faceRecognitionDemo.terminated = false;
      fakePatternManager.isStarted = function(){return false;};
      expect(faceRecognitionDemo.isTerminateButtonDisabled()).toBe(true);
      faceRecognitionDemo.terminated = false;
      fakePatternManager.isStarted = function(){return true;};
      expect(faceRecognitionDemo.isTerminateButtonDisabled()).toBe(false);
      faceRecognitionDemo.terminated = true;
      fakePatternManager.isStarted = function(){return true;};
      expect(faceRecognitionDemo.isTerminateButtonDisabled()).toBe(true);
      faceRecognitionDemo.terminated = true;
      fakePatternManager.isStarted = function(){return false;};
      expect(faceRecognitionDemo.isTerminateButtonDisabled()).toBe(true);
    });

    it('Should isCancelButtonDisabled', function() {
      fakePatternManager.isStarted = function(){return true;};
      expect(faceRecognitionDemo.isCancelButtonDisabled()).toBe(true);
      fakePatternManager.isStarted = function(){return true;};
      expect(faceRecognitionDemo.isCancelButtonDisabled()).toBe(true);
    });

    it('Should load from configuration three documentTypes in pattern configuration', function() {
      var numkeys = Object.keys(faceRecognitionDemo.referencePatternConfiguration).length;
      expect(numkeys).toEqual(1);
    });

    it('Should load from configuration one documentType in identityMedia configuration', function() {
      var numkeys = Object.keys(faceRecognitionDemo.identityMediaConfiguration).length;
      expect(numkeys).toEqual(1);
    });

    it('Should load from configuration three documentTypes in pattern validation', function() {
      var numkeys = Object.keys(faceRecognitionDemo.referencePatternValidation).length;
      expect(numkeys).toEqual(1);
    });

    it('Should load from configuration one documentType in indentityMedia validation', function() {
      var numkeys = Object.keys(faceRecognitionDemo.identityMediaValidation).length;
      expect(numkeys).toEqual(1);
    });

  });

});

