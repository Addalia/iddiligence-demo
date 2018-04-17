'use strict';

describe('CloudIDoc DocumentGroups', function() {

  var $rootScope;
  var $scope;
  var envConfig;
  var EnvConfigProviderObj;

  beforeEach(function() {
    module('app');
    module('app.service-core');
    module('app.document-groups');

    module(function ($provide) {
      $provide.provider('EnvConfig', function(){
        var envConfig = { "restUrl": "http://localhost:8080/IDocValidationService/resources",
                          "documentGroups" : {
                              "Dni":"Identity",
                              "NIE":"Identity",
                              "Passport":"Identity",
                              "Paysheet":"Income",
                              "IRPF":"Income",
                              "Bank_Receipt":"Receipt",
                              "Receipt":"Receipt",
                              "SignatureCard": "SignatureCard",
                              "Pattern" : "Pattern",
                              "Media" : "Pattern",
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
  });

  describe('DocumentGroups', function() {
    var DocumentGroups;
    beforeEach(function() {
      inject(function($injector,_$location_) {
        DocumentGroups = $injector.get('DocumentGroups');
      });
    });

    it('Should return the group of each type', function() {
      expect(DocumentGroups.getDocumentGroup('Dni')).toBe('Identity');
      expect(DocumentGroups.getDocumentGroup('NIE')).toBe('Identity');
      expect(DocumentGroups.getDocumentGroup('Passport')).toBe('Identity');
      expect(DocumentGroups.getDocumentGroup('Paysheet')).toBe('Income');
      expect(DocumentGroups.getDocumentGroup('IRPF')).toBe('Income');
      expect(DocumentGroups.getDocumentGroup('Bank_Receipt')).toBe('Receipt');
      expect(DocumentGroups.getDocumentGroup('Receipt')).toBe('Receipt');
      expect(DocumentGroups.getDocumentGroup('SignatureCard')).toBe('SignatureCard');
      expect(DocumentGroups.getDocumentGroup('Pattern')).toBe('Pattern');
      expect(DocumentGroups.getDocumentGroup('Media')).toBe('Pattern');
      expect(DocumentGroups.getDocumentGroup('IdentityMedia')).toBe('IdentityMedia');
    });

    it('Should store and return the selected type', function() {
      DocumentGroups.setSelectedType('Identity','Dni');
      expect(DocumentGroups.getSelectedType('Identity')).toBe('Dni');
      DocumentGroups.setSelectedType('Identity','NIE');
      expect(DocumentGroups.getSelectedType('Identity')).toBe('NIE');
      DocumentGroups.setSelectedType('Income','Paysheet');
      expect(DocumentGroups.getSelectedType('Income')).toBe('Paysheet');
      DocumentGroups.setSelectedType('Pattern','Media');
      expect(DocumentGroups.getSelectedType('Pattern')).toBe('Media');
    });

    it('Should give an undefine if called with an erronous group', function() {
      expect(DocumentGroups.getSelectedType('Whatever')).toBe(undefined);
    });

    it('Should clean the selected type', function() {
      DocumentGroups.setSelectedType('Identity',{ "status":"notdis",
                                                  "validations":{"val":"val"},
                                                  "attribs" : {
                                                    "FIRST_NAME_LABEL" : {"value" : "7", "checks" : ['OK','ko']},
                                                    "LAST_NAME_LABEL" : {"value" : "", "checks" : []}
                                                  }});
      DocumentGroups.cleanSelectedType('Identity');
      var type = DocumentGroups.getSelectedType('Identity');
      expect(type.validations.val).toBe('dis');
      expect(type.status).toBe('dis');
      expect(type.attribs.FIRST_NAME_LABEL.value).toBe('');
      expect(type.attribs.FIRST_NAME_LABEL.checks.length).toBe(0);
      DocumentGroups.setSelectedType('Pattern',{ "status":"ok",
                                                  "validations":{"val":"val"},
                                                  "attribs" : {
                                                    "PATTERN_NAME_LABEL" : {"value" : "p", "checks" : ['OK','ko']},
                                                    "PATTERN_NUMBER_LABEL" : {"value" : "1", "checks" : []}
                                                  }});
      DocumentGroups.cleanSelectedType('Pattern');
      var type = DocumentGroups.getSelectedType('Pattern');
      expect(type.validations.val).toBe('dis');
      expect(type.status).toBe('dis');
      expect(type.attribs.PATTERN_NAME_LABEL.value).toBe('');
      expect(type.attribs.PATTERN_NUMBER_LABEL.checks.length).toBe(0);
    });

  });

});
