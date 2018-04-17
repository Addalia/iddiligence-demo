(function () {
  'use strict';
  describe('CloudIDocValidationDemo service-fields-manager', function() {

    var sfm;
    var didconf;
    var fakeOperationManager;
    var operationManager;
    var EnvConfigProviderObj;

    var fakePromise = function(isSuccess,value){
      return {
        $promise:{
          then: function(success,error){
            if(isSuccess){
              success(value);
            } else {
              error(value);
            }
          }
        }
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
      resetFakeOperationManager();
      module('app');
      module('app.service-fieldsmanager');
      module('app.service-operationmanager');

      module(function ($provide) {
        $provide.provider('EnvConfig', function(){
          var envConfig = { "restUrl": "http://localhost:8080/IDocValidationService/resources",
                            "documentGroups" : {
                                "Dni":"Identity",
                                "NIE":"Identity",
                                "Passport":"Identity",
                                "Dni_front":"IdentityFront",
                                "NIE_front":"IdentityFront",
                                "Paysheet":"Income",
                                "IRPF":"Income",
                                "Bank_Receipt":"Receipt",
                                "Receipt":"Receipt",
                                "SignatureCard": "SignatureCard",
                                "IdentityMedia": "IdentityMedia"
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

      didconf=[
        {
            title: 'DNI',
            doctype: 'Dni',
            fields: [
              {attrname: 'dni_number', value: '1235659Q'},
              {attrname: 'dni_first_name', value: 'Pepe'},
              {attrname: 'dni_last_name', value: 'Perez'},
              {attrname: 'dni_birthdate', value: '19800206'},
              {attrname: 'dni_expiration_date', value: '20170220'}
            ]
        },
        {
            title: 'NIE',
            doctype: 'NIE',
            fields: [
              {attrname: 'nie_number',value: '1235659Q'}
            ]
        },
        {
            title: 'Pasaporte',
            doctype: 'Passport',
            fields: []
        }
      ];

      inject(function($injector){
        sfm = $injector.get('FieldsManager');
        operationManager = $injector.get('OperationManager');

      });
    });

    it('should setAttributes from setAttributesValues', function() {
        /*var attrUp = false;

        fakeOperationManager.setAttribute = function(){
          attrUp = true;
          return fakePromise(true,'setAttributeMock');
        };
        sfm.setAttributesValues(didconf, 'NIE');
        expect(attrUp).toBe(true);*/
    });
  });
})();
