(function () {
  'use strict';
  describe('CloudIDocValidationDemo service-operation-manager', function() {
    var som;
    var opStore;
    var fakeOp;
    var fakeDoc;
    var fakeView;
    var EnvConfigProviderObj;
    var configurationDni = {
                            Dni : {
                              doctype:"Dni",
                              fields:[
                                    {"label": "IDENTIFICATION_NUMBER_LABEL", "attrname": "dni_number", "controltype": "text", "required": "false", "show": "false", "id": "dninumber", "value" : "123456789K"},
                                    {"label": "FIRST_NAME_LABEL", "attrname": "dni_first_name", "controltype": "text", "required": "false", "show": "false", "id": "dnifirstname", "value" : "Pepe"},
                                    {"label": "LAST_NAME_LABEL", "attrname": "dni_last_name", "controltype": "text", "required": "false", "show": "false", "id": "dnilastname", "value" : "Perez"},
                                    {"label": "BIRTHDATE_LABEL", "attrname": "dni_birthdate", "controltype": "date", "required": "false", "show": "false", "id": "dnibirthdate", "value" : "19871215"},
                                    {"label": "EXPIRATION_DATE_LABEL", "attrname": "dni_expiration_date", "controltype": "date", "required": "false", "show": "false", "id": "dniexpirationdate", "value" : "20200609"},
                                    {"label": "TELEPHONE_NUMBER_LABEL", "attrname": "dni_telephone", "controltype": "text", "required": "true", "show": "true", "id": "dnitelephonenumber", "value" : "900121215"},
                                    {"label": "AUTHORIZATION_LABEL", "attrname": "operation_user_authorization", "controltype": "text", "required": "true", "show": "true", "id": "authorization", "value" : "1"}
                                    ]
                            }
                          };

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

    var documentMock = {"documentId" : "207"};
    var viewMock = {"viewId" : "208"};

    var resetFakeOperation = function() {
      fakeOp = {
        create : function(){return fakePromise(true,"getOpStatmock");},
        status : function(){return fakePromise(true,"getOpStatmock");},
        terminate : function(){return fakePromise(true,"getOpStatmock");},
        update : function(){return fakePromise(true,"getOpmock");},
        remove : function(){return fakePromise(true,"getOpStatmock");}
      };
    };

    var resetFakeDocument = function() {
      fakeDoc = {
        query : function(){return fakePromise(true,"getOpStatmock");},
        create : function(){return fakePromise(true,documentMock);},
        update : function(){return fakePromise(true,"getOpStatmock");},
        views : function(){return fakePromise(true,"getOpStatmock");}
      };
    };

    var resetFakeView = function() {
      fakeView = {
        query : function(){return fakePromise(true,"getOpStatmock");},
        upload : function(){return fakePromise(true,"getOpStatmock");},
        download : function(){return fakePromise(true,"getOpStatmock");},
        create : function(){return fakePromise(true,viewMock);},
        update : function(){return fakePromise(true,"getOpStatmock");}
      };
    };

    var initOpInfoWithData = function(){
      opStore.setOpStat({
      'documentStatus' : 'irrelevant',
      'operationTerminated' : '1',
      'documents' : { 'Dni' : {
          'idDocument' : '101',
          'validations' : []
        }, 'Paysheet' : {
          'idDocument' : '102',
          'validations' : []
        }, 'Bank_Receipt' : {
          'idDocument' : '103',
          'validations' : []
        }}});;
      opStore.setOp({
        operationId:'100',
        attributes:{
          'operation_name': 'blah',
          'operation_number': '100',
          'operation_user_authorization': 'SI'
        }});
      opStore.setDoc('Dni', {documentId:'101',type:'Dni',attributes:{}});
      opStore.setDoc('Paysheet', {documentId:'102',type:'Paysheet',attributes:{}});
      opStore.setDoc('Bank_Receipt', {documentId:'103',type:'Bank_Receipt',attributes:{}});
    }

    beforeEach(function() {
      resetFakeOperation();
      resetFakeDocument();
      resetFakeView();
      module('app');
      module('app.service-operationmanager');
      module('app.service-view');
      module(function ($provide) {
        $provide.value('Operation', fakeOp);
        $provide.value('Document', fakeDoc);
        $provide.value('View', fakeView);
      });

      module(function ($provide) {
        $provide.provider('EnvConfig', function(){
          var envConfig = {"restUrl": "http://localhost:8080/IDocValidationService/resources",
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
                                "SignatureCard": "SignatureCard"
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

      inject(function($injector){
        opStore = $injector.get('OperationStore');
        som = $injector.get('OperationManager');
      });
      som.clean();

      opStore.clean();
      var configuration = [{
                            Dni : {
                              doctype:"Dni",
                              fields:[]
                            },
                            NIE : {
                              doctype:"NIE",
                              fields:[]},
                            Passport : {
                              doctype:"Passport",
                              fields:[]}
                           },
                           {
                            IRPF : {
                              doctype:"IRPF",
                              fields:[]},
                            Paysheet : {
                              doctype:"Paysheet",
                              fields:[]}
                           },
                           {
                            Bank_Receipt : {
                              doctype:"Bank_Receipt",
                              fields:[]},
                            Receipt : {
                              doctype:"Receipt",
                              fields:[]}
                           }];
      opStore.setup(configuration);
    });

    it('Should create an operation and save it into store on initOp', function() {
      var createCalled = false;
      spyOn(opStore, 'setOpProps');
      fakeOp.create = function(){
        createCalled = true;
        return fakePromise(true,"getOpStatmock");
      };
      som.initOp();
      expect(createCalled).toBe(true);
      expect(opStore.setOpProps).toHaveBeenCalled();
    });

    it('Should update an operation and save authorization', function() {
      var updateCalled = false;
      opStore.setOp({
        operationId:'100',
        attributes:{
          'operation_name': 'blah',
          'operation_number': '100',
          'operation_user_authorization': ''
        }});
      var op = opStore.getOp();
      spyOn(opStore, 'setOp');
      opStore.setOp(op);
      spyOn(opStore, 'setOpProps');
      opStore.setOpProps('blah', '100', '1');
      fakeOp.update =  function(){
        updateCalled = true;
        return fakePromise(true,'getOpmock');
      };

      som.updateAuthorization(configurationDni.Dni.fields);
      expect(updateCalled).toBe(true);

    });

    it('Should empty store when clean', function() {
      spyOn(opStore, 'clean');
      som.clean();
      expect(opStore.clean).toHaveBeenCalled();
    });

    it('Should get operation status and modify store operation status when getOpStat', function() {
      var statusCalled = false;
      spyOn(opStore, 'setOpProps');
      fakeOp.status = function(){
        statusCalled = true;
        return fakePromise(true,{documentStatus:'blop',operationTerminated:'blip',documents:{}});
      };
      som.getOpStat();
      expect(statusCalled).toBe(true);
    });

    it('finishOp should faild at the beginning', function() {
      som.finishOp().then(function(){
          expect(true).toBe(true);
        },
        function(){
          expect(false).toBe(true);
        }
      );
      setTimeout(function(){}, 100);
    });

    it('finishOp should terminate operation when there is data to terminate', function() {
      var terminateCalled = false;
      initOpInfoWithData();
      fakeOp.terminate = function(){
        terminateCalled = true;
        return fakePromise(true,{documentStatus:'blop',operationTerminated:'blip',documents:{}});
      };
      som.finishOp().then(function(){
          expect(false).toBe(true);
        },
        function(){
          expect(true).toBe(true);
        }
      );
      setTimeout(function(){}, 100);
      expect(terminateCalled).toBe(true);
    });

    it('deleteOp should fail without data.', function() {
      som.deleteOp().then(function(){
          expect(false).toBe(true);
        },
        function(){
          expect(true).toBe(true);
        }
      );
      setTimeout(function(){}, 100);
    });

    it('deleteOp should call remove when there is data', function() {
      var removed = false;
      initOpInfoWithData();
      fakeOp.remove = function(){
        removed = true;
        return fakePromise(false,'irrelevant');
      };
      som.deleteOp();
      expect(removed).toBe(true);
    });

    it('Should consult OperationStore on isTerminated', function() {
      expect(som.isTerminated()).toBe(false);
      initOpInfoWithData();
      opStore.setTerminated(true);
      expect(som.isTerminated()).toBe(true);
    });

    it('Should consult OperationStore on isStarted', function() {
      expect(som.isStarted()).toBe(false);
      initOpInfoWithData();
      expect(som.isStarted()).toBe(true);
    });

    it('Should modify OperationStore on setTerminated', function() {
      som.setTerminated(true);
      expect(opStore.isTerminated()).toBe(true);
      som.setTerminated(false);
      expect(opStore.isTerminated()).toBe(false);
    });

    it('Should return an error if getDoc is called with a wrong doc', function() {
      som.getDoc('wrong').then(function(){
          expect(false).toBe(true);
        },
        function(){
          expect(true).toBe(true);
        }
      );
      setTimeout(function(){}, 100);
    });

    it('Should access Documente if getDoc is called with a valid doc', function() {
      var queryCalled = false;
      fakeDoc.query = function(){
        queryCalled = true;
        return fakePromise(false,'irrelevant');
      };
      som.getDoc('Dni')
      expect(queryCalled).toBe(true);
    });

    it('Should setAttributte must fail if called with wrong doc', function() {
      som.setAttributte('wrong','nothing',0).then(function(){
          expect(false).toBe(true);
        },
        function(){
          expect(true).toBe(true);
        }
      );
      setTimeout(function(){}, 100);
    });

    it('Should setAttributte must fail if called with wrong doc', function() {
      expect(opStore.getDoc('Dni').attributes['nothing']).toBe(undefined);
      som.setAttributte('Dni','nothing',0)
      expect(opStore.getDoc('Dni').attributes['nothing']).toBe(0);
    });

    it('getView should fail if called with wrong doc', function() {
      som.getView('wrong').then(function(){
          expect(false).toBe(true);
        },
        function(){
          expect(true).toBe(true);
        }
      );
      setTimeout(function(){}, 100);
    });

    it('Should getView', function() {
      initOpInfoWithData();
      opStore.setView('Dni',{'attributes': {a:1,b:2}});
      opStore.getView('Dni').viewId = '104';
      var queryCalled = false;
      fakeView.query =  function(){
        queryCalled = true;
        return fakePromise(false,'irrelevant');
      };
      som.getView('Dni');
      expect(queryCalled).toBe(true);
    });

    it('sendViewFile should fail if called with wrong doc', function() {
      som.sendViewFile('wrong').then(function(){
          expect(false).toBe(true);
        },
        function(){
          expect(true).toBe(true);
        }
      );
      setTimeout(function(){}, 100);
    });

    it('sendViewFile should upload the file', function() {
      initOpInfoWithData();
      opStore.setView('Dni',{'attributes': {a:1,b:2}});
      opStore.getView('Dni').viewId = '104';
      var uploadCalled = false;
      fakeView.upload =  function(){
        uploadCalled = true;
        return fakePromise(false,'irrelevant');
      };
      som.sendViewFile('Dni', 'somefile');
      expect(uploadCalled).toBe(true);
    });

    it('getViewFile should fail if called with wrong doc', function() {
      som.getViewFile('wrong').then(function(){
          expect(false).toBe(true);
        },
        function(){
          expect(true).toBe(true);
        }
      );
      setTimeout(function(){}, 100);
    });

    it('getViewFile should download the file', function() {
      initOpInfoWithData();
      opStore.setView('Dni',{'attributes': {a:1,b:2}});
      opStore.getView('Dni').viewId = '104';
      var downloadCalled = false;
      fakeView.download =  function(){
        downloadCalled = true;
        return fakePromise(false,'irrelevant');
      };
      som.getViewFile('Dni', 'somefile');
      expect(downloadCalled).toBe(true);
    });

    it('Should change view id when getOpStat found multiple views and there is a page 1', function() {
      var statusCalled = false;
      fakeOp.status = function(){
        statusCalled = true;
        return fakePromise(true,{documentStatus:'blop',operationTerminated:'blip',documents:[ {idDocument:'0', views:[
            {idView:'7'},
            {idView:'42'}
          ]}]
        });
      };

      fakeView.query = function(){return fakePromise(true,{
        idView:'42',
        attributes:{page:'1'}
      })};
      opStore.setTypeForId(0,'fake');
      som.getOpStat();
      expect(opStore.getView('fake').idView).toBe('42');
    });

  });
})();
