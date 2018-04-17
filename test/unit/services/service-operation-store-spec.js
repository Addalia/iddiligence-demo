(function () {
  'use strict';
  describe('CloudIDocValidationDemo service-operation-store', function() {
    var OperationStore;

    var initOpInfo = function(){
      OperationStore.setOp({
      operationId:'100',
      attributes:{
        'operation_name': 'testOp',
        'operation_number': '1',
        'operation_user_authorization': 'SI'
      }});
    }


    var initOpInfoWithData = function(){
      OperationStore.setOpStat({
      'documentStatus' : 'irrelevant',
      'operationTerminated' : '1',
      'documents' : [
                      { 'doctype' : 'Dni',
                      'idDocument' : '101',
                      'validations' : []
                      },
                      { 'doctype' : 'NIE',
                      'idDocument' : '102',
                      'validations' : []
                      },
                      { 'doctype' : 'Passport',
                      'idDocument' : '103',
                      'validations' : []
                      },
                      { 'doctype' : 'Paysheet',
                      'idDocument' : '104',
                      'validations' : []
                      },
                      { 'doctype' : 'IRPF',
                      'idDocument' : '105',
                      'validations' : []
                      },
                      { 'doctype' : 'Bank_Receipt',
                      'idDocument' : '106',
                      'validations' : []
                      },
                      { 'doctype' : 'Receipt',
                      'idDocument' : '107',
                      'validations' : []
                      },
                      { 'doctype' : 'IdentityMedia',
                      'idDocument' : '108',
                      'validations' : []
                      }
                  ]
      });

      OperationStore.setOp({
        operationId:'100',
        attributes:{
          'operation_name': 'blah',
          'operation_number': '100',
          'operation_user_authorization': 'SI'
        }});
    }

    beforeEach(function(){
      module('app');
      module('app.service-operationstore');
      module('app.document-groups');
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
                                "SignatureCard": "SignatureCard",
                                "IdentityMedia": "IdentityMedia"
                            }
                          };

          this.$get = function() {
            return envConfig;
          };
        });
      });
      inject(function($injector){
          OperationStore = $injector.get('OperationStore');
      });
      OperationStore.clean();
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
        OperationStore.setup(configuration);
    });

    it('Should be not started at first', function() {
      expect(OperationStore.isStarted()).toBe(false);
    });

    it('Should be started when there is op info', function() {
      initOpInfoWithData();
      expect(OperationStore.isStarted()).toBe(true);
    });

    it('Documents should be not sent at first', function() {
      expect(OperationStore.allDocsSent()).toBe(false);
    });

    it('Documents should be marked as sent when all was sent', function() {
      OperationStore.setDoc('Dni', {documentId:'101',type:'Dni',attributes:{}});
      OperationStore.setDoc('Paysheet', {documentId:'102',type:'Paysheet',attributes:{}});
      OperationStore.setDoc('Bank_Receipt', {documentId:'103',type:'Bank_Receipt',attributes:{}});
      expect(OperationStore.allDocsSent()).toBe(true);
    });

    it('Documents(2) should be marked as sent when all was sent', function() {
      OperationStore.setDoc('NIE', {documentId:'102',type:'NIE',attributes:{}});
      OperationStore.setDoc('IRPF', {documentId:'105',type:'IRPF',attributes:{}});
      OperationStore.setDoc('Receipt', {documentId:'107',type:'Receipt',attributes:{}});
      expect(OperationStore.allDocsSent()).toBe(true);
    });

    it('New Documents should be marked as sent when all was sent', function() {
      OperationStore.setDoc('NIE', {documentId:'104',type:'NIE',attributes:{}});
      OperationStore.setDoc('IRPF', {documentId:'106',type:'IRPF',attributes:{}});
      OperationStore.setDoc('Receipt', {documentId:'107',type:'Receipt',attributes:{}});
      expect(OperationStore.allDocsSent()).toBe(true);
    });

    it('Should be not termintade at first', function() {
      expect(OperationStore.isTerminated()).toBe(false);
    });

    it('isTermintade should return the terminted status', function() {
      OperationStore.setTerminated(true);
      expect(OperationStore.isTerminated()).toBe(true);
      OperationStore.setTerminated(false);
      expect(OperationStore.isTerminated()).toBe(false);
    });

    it('getTypeFromId should be undefined at first', function() {
      expect(OperationStore.getTypeFromId('whatever')).toBe(undefined);
    });

    it('Setter and getter for docIds should match', function() {
      OperationStore.setTypeForId('1','Dni');
      OperationStore.setTypeForId('2','Paysheet');
      OperationStore.setTypeForId('3','Bank_Receipt');
      OperationStore.setTypeForId('4','Passport');
      OperationStore.setTypeForId('5','NIE');
      OperationStore.setTypeForId('6','IRPF');
      OperationStore.setTypeForId('7','Receipt');
      OperationStore.setTypeForId('8','IdentityMedia');
      expect(OperationStore.getTypeFromId('1')).toBe('Dni');
      expect(OperationStore.getTypeFromId('2')).toBe('Paysheet');
      expect(OperationStore.getTypeFromId('3')).toBe('Bank_Receipt');
      expect(OperationStore.getTypeFromId('4')).toBe('Passport');
      expect(OperationStore.getTypeFromId('5')).toBe('NIE');
      expect(OperationStore.getTypeFromId('6')).toBe('IRPF');
      expect(OperationStore.getTypeFromId('7')).toBe('Receipt');
      expect(OperationStore.getTypeFromId('8')).toBe('IdentityMedia');
    });

    it('getTypeFromId should return all Op info. Empty at the beginning', function() {
      var op = OperationStore.getOp();
      expect(op.operationId).toBe('');
      expect(op.attributes.operation_name).toBe('');
      expect(op.attributes.operation_number).toBe('');
      expect(op.attributes.operation_user_authorization).toBe('');
    });

    it('getTypeFromId should return all Op info. With data', function() {
      OperationStore.setOp({
        operationId:'100',
        attributes:{
          'operation_name': 'blah',
          'operation_number': '100',
          'operation_user_authorization': 'SI'
        }});

      OperationStore.getOp();
      var op = OperationStore.getOp();
      expect(op.operationId).toBe('100');
      expect(op.attributes.operation_name).toBe('blah');
      expect(op.attributes.operation_number).toBe('100');
      expect(op.attributes.operation_user_authorization).toBe('SI');
    });

    it('getTypeFromId should return all Op info. With data', function() {
      initOpInfoWithData();
      OperationStore.setOpProps('blah', '100', 'SI');

      OperationStore.getOp();
      var op = OperationStore.getOp();
      expect(op.operationId).toBe('100');
      expect(op.attributes.operation_name).toBe('blah');
      expect(op.attributes.operation_number).toBe('100');
      expect(op.attributes.operation_user_authorization).toBe('SI');
    });


    it('opStatus should have an initial value', function() {
      expect(OperationStore.getOpStat().documentStatus).toBe('');
      expect(OperationStore.getOpStat().operationTerminated).toBe('0');

      expect(OperationStore.getOpStat().documents[0].idDocument).toBe('');
      expect(OperationStore.getOpStat().documents[1].idDocument).toBe('');
      expect(OperationStore.getOpStat().documents[2].idDocument).toBe('');
      expect(OperationStore.getOpStat().documents[3].idDocument).toBe('');
      expect(OperationStore.getOpStat().documents[4].idDocument).toBe('');
      expect(OperationStore.getOpStat().documents[5].idDocument).toBe('');
      expect(OperationStore.getOpStat().documents[6].idDocument).toBe('');
    });


    it('opStatus getters and setters should match', function() {
      initOpInfoWithData();
      expect(OperationStore.getOpStat().documentStatus).toBe('irrelevant');
      expect(OperationStore.getOpStat().operationTerminated).toBe('1');
      expect(OperationStore.getOpStat().documents[0].idDocument).toBe('101');
      expect(OperationStore.getOpStat().documents[1].idDocument).toBe('102');
      expect(OperationStore.getOpStat().documents[2].idDocument).toBe('103');
      expect(OperationStore.getOpStat().documents[3].idDocument).toBe('104');
      expect(OperationStore.getOpStat().documents[4].idDocument).toBe('105');
      expect(OperationStore.getOpStat().documents[5].idDocument).toBe('106');
      expect(OperationStore.getOpStat().documents[6].idDocument).toBe('107');
      expect(OperationStore.getOpStat().documents[7].idDocument).toBe('108');
    });

    it('hasDoc should say correclty if a document type is supported', function() {
      expect(OperationStore.hasDoc('Dni')).toBe(true);
      expect(OperationStore.hasDoc('Paysheet')).toBe(true);
      expect(OperationStore.hasDoc('Bank_Receipt')).toBe(true);
      expect(OperationStore.hasDoc('Passport')).toBe(true);
      expect(OperationStore.hasDoc('NIE')).toBe(true);
      expect(OperationStore.hasDoc('IRPF')).toBe(true);
      expect(OperationStore.hasDoc('Receipt')).toBe(true);
      expect(OperationStore.hasDoc(undefined)).toBe(false);
      expect(OperationStore.hasDoc('notype')).toBe(false);
      expect(OperationStore.hasDoc('IdentityMedia')).toBe(false);

    });

    it('setDoc and getDoc should set and return the data of the expected document', function() {
      initOpInfoWithData();
      OperationStore.setDoc('Dni',{documentId:'101',type: 'Dni',attributes:{}});
      OperationStore.setDoc('Paysheet',{documentId:'102',type: 'Paysheet',attributes:{}});
      OperationStore.setDoc('Bank_Receipt',{documentId:'103',type: 'Bank_Receipt',attributes:{}});
      OperationStore.setDoc('NIE',{documentId:'104',type: 'NIE',attributes:{}});
      OperationStore.setDoc('Passport',{documentId:'105',type: 'Passport',attributes:{}});
      OperationStore.setDoc('IRPF',{documentId:'106',type: 'IRPF',attributes:{}});
      OperationStore.setDoc('Receipt',{documentId:'107',type: 'Receipt',attributes:{}});
      OperationStore.setDoc('IdentityMedia',{documentId:'108',type: 'IdentityMedia',attributes:{}});
      expect(OperationStore.getDoc('Dni').documentId).toBe('101');
      expect(OperationStore.getDoc('Paysheet').documentId).toBe('102');
      expect(OperationStore.getDoc('Bank_Receipt').documentId).toBe('103');
      expect(OperationStore.getDoc('NIE').documentId).toBe('104');
      expect(OperationStore.getDoc('Passport').documentId).toBe('105');
      expect(OperationStore.getDoc('IRPF').documentId).toBe('106');
      expect(OperationStore.getDoc('Receipt').documentId).toBe('107');
      expect(OperationStore.getDoc('IdentityMedia').documentId).toBe('108');
    });


    it('set/get/clean view should be coherent', function() {
      expect(Object.keys(OperationStore.getView('Dni').attributes).length).toBe(0);
      expect(Object.keys(OperationStore.getView('Paysheet').attributes).length).toBe(0);
      expect(Object.keys(OperationStore.getView('Bank_Receipt').attributes).length).toBe(0);
      OperationStore.setView('Dni',{'attributes': {a:1,b:2}});
      OperationStore.setView('Paysheet',{'attributes': {a:1,b:2}});
      OperationStore.setView('Bank_Receipt',{'attributes': {a:1,b:2}});
      expect(Object.keys(OperationStore.getView('Dni').attributes).length).toBe(2);
      expect(Object.keys(OperationStore.getView('Paysheet').attributes).length).toBe(2);
      expect(Object.keys(OperationStore.getView('Bank_Receipt').attributes).length).toBe(2);
      OperationStore.clean();
      expect(Object.keys(OperationStore.getView('Dni').attributes).length).toBe(0);
      expect(Object.keys(OperationStore.getView('Paysheet').attributes).length).toBe(0);
      expect(Object.keys(OperationStore.getView('Bank_Receipt').attributes).length).toBe(0);
    });

  });
})();
