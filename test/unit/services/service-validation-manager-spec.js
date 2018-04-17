'use strict';

describe('CloudIDoc service ValidationManager', function() {

  var $rootScope;
  var $scope;
  var envConfig;
  var EnvConfigProviderObj;

  beforeEach(function() {
    module('app');
    module('app.service-core');
    module('app.validation-manager');
    module('app.service-operationstore');
    module('app.service-patternstore');
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
                              "Pattern": "Pattern",
                              "Media": "Pattern",
                              "IdentityMedia": "IdentityMedia"
                          },
                          "validationConfiguration" : {
                            "Dni" : {
                              "DemoApp": {
                                "status" :"dis",
                                "headers" : [],
                                "validations":{},
                                "attribs" : { "FIRST_NAME_LABEL" : {"value" : "", "checks" : []},
                                      "LAST_NAME_LABEL" : {"value" : "", "checks" : []},
                                      "IDENTIFICATION_NUMBER_LABEL" : {"value" : "", "checks" : []},
                                      "EXPIRATION_DATE_LABEL" : {"value" : "", "checks" : []}
                                }
                              },
                              "IdentityApp": {
                                "status" :"dis",
                                "headers" : ["", "", "HEADER_DOCUMENT_LABEL", "HEADER_SYSTEM_LABEL"],
                                "validations":{},
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
                                "validations":{},
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
                                "validations":{},
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
                                        "EQUALS_AMOUNT_LABEL":"dis"},
                                "attribs" :{}
                              }
                            },
                            "IRPF" : {
                              "DemoApp" : {
                                "status":"dis",
                                "validations":{ "EQUALS_NAME_INCOME_LABEL":"dis",
                                        "EQUALS_AMOUNT_LABEL":"dis"},
                                "attribs" :{}
                              }
                            },
                            "Bank_Receipt" : {
                              "DemoApp" : {
                                "status":"dis",
                                "validations":{ "EQUALS_NAME_RECEIPT_LABEL":"dis",
                                        "EQUALS_ACCOUNT_LABEL":"dis"},
                                "attribs" :{}
                              }
                            },
                            "Receipt" : {
                              "DemoApp" : {
                                "status":"dis",
                                "validations":{ "EQUALS_IDENTIFICATION_NUMBER_LABEL":"dis",
                                        "EQUALS_DATE_LABEL":"dis"},
                                "attribs" :{}
                              }
                            },
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
  });


  describe('ValidationManager', function() {
    var ValidationConfiguration;
    var ValidationManager;
    var DocumentGroups;
    var OperationStore;
    var PatternStore;
    var ocr;
    var doc;
    beforeEach(function() {
      inject(function($injector,_$location_) {
        ValidationConfiguration = $injector.get('ValidationConfiguration');
        ValidationManager = $injector.get('ValidationManager');
        DocumentGroups = $injector.get('DocumentGroups');
        OperationStore = $injector.get('OperationStore');
        PatternStore = $injector.get('PatternStore');
      });

      ocr = { Identity:'dis',
                Income:'dis',
                Receipt:'dis'
              };
      doc = {
          "documentStatus": "OK",
          "idDocument": "498216206338",
          "views": [
            {
              "documentStatus": "KO",
              "idView": "498216206339"
            }
          ],
          "validations": []
        };

    });

    it('Should fill Identity validations', function() {
      DocumentGroups.setSelectedType('Identity', {'doctype':'Dni'});
      OperationStore.setDoc('Dni', {documentId:'498216206338',type:'Dni',attributes:{}});
      OperationStore.setTypeForId('498216206338', 'Dni');
      var config = {"Dni":{}};
      config.Dni = ValidationConfiguration.getValidationConfiguration('Dni','DemoApp');

      ValidationManager.fillIdentityValidations(doc, config, ocr);

      expect(config['Dni'].status).toBe('ko');
      expect(ocr['Identity']).toBe('ko');
    });

    it('Should fill Receipt validations', function() {
      doc.validations =[
        {
          "name": "BankReceiptValidation",
          "description": "VALIDATION_ACCOUNT_NUMBER",
          "status": "KO"
        },
        {
          "name": "BankReceiptValidation",
          "description": "VALIDATION_FIRST_NAME",
          "status": "KO"
        },
        {
          "name": "BankReceiptValidation",
          "description": "VALIDATION_LAST_NAME",
          "status": "KO"
        },
        {
          "name": "BankReceiptValidation",
          "description": "VALIDATION_DNI_NUMBER",
          "status": "OK"
        }
      ];

      DocumentGroups.setSelectedType('Receipt', {'doctype':'Bank_Receipt'});
      OperationStore.setDoc('Bank_Receipt', {documentId:'498216206338',type:'Bank_Receipt',attributes:{}});
      OperationStore.setTypeForId('498216206338', 'Bank_Receipt');
      var config = {"Bank_Receipt":{}};
      config.Bank_Receipt = ValidationConfiguration.getValidationConfiguration('Bank_Receipt','DemoApp');

      ValidationManager.fillReceiptValidations(doc, config, ocr);

      expect(config['Bank_Receipt'].status).toBe('ko');
      expect(ocr['Receipt']).toBe('ko');
      expect(config['Bank_Receipt'].validations.EQUALS_ACCOUNT_LABEL).toBe('ko');
      expect(Object.keys(config['Bank_Receipt'].validations).length).toBe(2);
    });

    it('Should fill Income validations', function() {
      doc.validations = [
        {
          "name": "PaysheetValidation",
          "description": "VALIDATION_DNI_NUMBER",
          "status": "OK"
        },
        {
          "name": "PaysheetValidation",
          "description": "VALIDATION_FIRST_NAME",
          "status": "KO"
        },
        {
          "name": "PaysheetValidation",
          "description": "VALIDATION_LAST_NAME",
          "status": "KO"
        },
        {
          "name": "PaysheetValidation",
          "description": "VALIDATION_INGRESOS",
          "status": "KO"
        },
        {
          "name": "PaysheetValidation",
          "description": "VALIDATION_DATE_PERIOD",
          "status": "KO"
        },
        {
          "name": "PaysheetValidation",
          "description": "VALIDATION_PERCENT_QUOTATION",
          "status": "KO"
        },
        {
          "name": "PaysheetValidation",
          "description": "VALIDATION_SEIZURES",
          "status": "OK"
        },
        {
          "name": "PaysheetValidation",
          "description": "VALIDATION_PASSIVE_RIGHTS",
          "status": "KO"
        },
        {
          "name": "PaysheetValidation",
          "description": "VALIDATION_SENIORITY_DATE",
          "status": "KO"
        },
        {
          "name": "PaysheetValidation",
          "description": "VALIDATION_BUSINESS_NAME",
          "status": "KO"
        },
        {
          "name": "PaysheetValidation",
          "description": "VALIDATION_CIF_BUSINESS",
          "status": "KO"
        }
      ];

      DocumentGroups.setSelectedType('Income', {'doctype':'Paysheet'});
      OperationStore.setDoc('Paysheet', {documentId:'498216206338',type:'Paysheet',attributes:{}});
      OperationStore.setTypeForId('498216206338', 'Paysheet');
      var config = {"Paysheet":{}};
      config.Paysheet = ValidationConfiguration.getValidationConfiguration('Paysheet','DemoApp');

      ValidationManager.fillIncomeValidations(doc, config, ocr);

      expect(config['Paysheet'].status).toBe('ko');
      expect(ocr['Income']).toBe('ko');
      expect(config['Paysheet'].validations.EQUALS_NAME_INCOME_LABEL).toBe('ko');
      expect(Object.keys(config['Paysheet'].validations).length).toBe(2);
    });

    it('Should fill IdentityMedia validations', function() {
      doc.validations =[
        {
          "name": "FaceRecognitionValidation",
          "description": "VALIDATION_FACE_RECOGNITION",
          "status": "KO"
        }
      ];

      DocumentGroups.setSelectedType('IdentityMedia', {'doctype':'IdentityMedia'});
      OperationStore.setDoc('IdentityMedia', {documentId:'498216206338',type:'IdentityMedia',attributes:{}});
      OperationStore.setTypeForId('498216206338', 'IdentityMedia');
      var config = {"IdentityMedia":{}};
      config.IdentityMedia = ValidationConfiguration.getValidationConfiguration('IdentityMedia','FaceRecognitionApp');

      ValidationManager.fillIdentityMediaValidations(doc, config, ocr);

      expect(config['IdentityMedia'].status).toBe('ko');
      expect(Object.keys(config['IdentityMedia'].validations).length).toBe(0);
    });

    it('Should fill Identity attributes', function() {
      doc.attributes = { "dni_birthdate": "19840627",
                         "dni_expiration_date": "20190117",
                         "dni_number": "47871577K",
                         "dni_last_name": "CASANOAS TARAFA",
                         "dni_sex": "V",
                         "dni_first_name": "IGNASI",
                         "dni_number_id": "IDESP35"
                        };

      DocumentGroups.setSelectedType('Identity', {'doctype':'Dni'});
      OperationStore.setDoc('Dni', {documentId:'498216206338',type:'Dni',attributes:{}});
      OperationStore.setTypeForId('498216206338', 'Dni');
      var config = {"Dni":{}};
      config.Dni = ValidationConfiguration.getValidationConfiguration('Dni','DemoApp');

      ValidationManager.fillIdentityAttributes(doc, config);

      expect(config['Dni'].attribs.FIRST_NAME_LABEL.value).toBe('IGNASI');
      expect(config['Dni'].attribs.LAST_NAME_LABEL.value).toBe('CASANOAS TARAFA');
      expect(config['Dni'].attribs.IDENTIFICATION_NUMBER_LABEL.value).toBe('47871577K');
      expect(config['Dni'].attribs.EXPIRATION_DATE_LABEL.value).toBe('17/01/2019');
    });

    it('Should fill Pattern attributes', function() {
      doc.attributes = { "pattern_name": "Patrón Pruebas",
                         "pattern_number": "1234"
                        };

      DocumentGroups.setSelectedType('Pattern', {'doctype':'Pattern'});
      PatternStore.setPattern('Pattern', {documentId:'498216206338',type:'Pattern',attributes:{}});
     // PatternStore.setTypeForId('498216206338', 'Pattern');
      var config = {"Pattern":{}};
      config.Pattern = ValidationConfiguration.getValidationConfiguration('Pattern','FaceRecognitionApp');

      ValidationManager.fillPatternAttributes(doc, config);

      expect(config['Pattern'].attribs.PATTERN_NAME_LABEL.value).toBe('Patrón Pruebas');
      expect(config['Pattern'].attribs.PATTERN_NUMBER_LABEL.value).toBe('1234');
    });

    it('Should fill IdentityMedia attributes', function() {
      doc.attributes = { "identity_media_confidence_recognition": "0.89"
                        };

      DocumentGroups.setSelectedType('IdentityMedia', {'doctype':'IdentityMedia'});
      OperationStore.setDoc('IdentityMedia', {documentId:'498216206338',type:'IdentityMedia',attributes:{}});
      OperationStore.setTypeForId('498216206338', 'IdentityMedia');
      var config = {"IdentityMedia":{}};
      config.IdentityMedia = ValidationConfiguration.getValidationConfiguration('IdentityMedia','FaceRecognitionApp');

      ValidationManager.fillIdentityMediaAttributes(doc, config);

      expect(config['IdentityMedia'].attribs.PERCENTAGE_OF_COINCIDENCE_LABEL.value).toBe('0.89');
    });

  });

});

