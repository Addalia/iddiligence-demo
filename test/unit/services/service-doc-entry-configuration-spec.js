'use strict';

describe('CloudIDoc service DocEntryConfiguration', function() {

  var $rootScope;
  var $scope;
  var envConfig;
  var EnvConfigProviderObj;

  beforeEach(function() {
    module('app');
    module('app.service-core');
    module('app.doc-entry-configuration');

    module(function ($provide) {
      $provide.provider('EnvConfig', function(){
        var envConfig = { "restUrl": "http://localhost:8080/IDocValidationService/resources",
                          "docEntryConfiguration" : { 
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
                                },  
                                "IdentityApp": {
                                      "title": "DNI_LABEL",
                                      "doctype": "Dni",
                                      "fields": [
                                        {"label": "IDENTIFICATION_NUMBER_LABEL", "attrname": "dni_number", "controltype": "text", "required": "true", "show": "true", "id": "dninumber"},
                                        {"label": "FIRST_NAME_LABEL", "attrname": "dni_first_name", "controltype": "text", "required": "true", "show": "true", "id": "dnifirstname"},
                                        {"label": "LAST_NAME_LABEL", "attrname": "dni_last_name", "controltype": "text", "required": "true", "show": "true", "id": "dnilastname"},
                                        {"label": "BIRTHDATE_LABEL", "attrname": "dni_birthdate", "controltype": "text", "required": "true", "show": "true", "id": "dnibirthdate"},
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

  describe('DocEntryConfiguration', function() {
    var DocEntryConfiguration;
    beforeEach(function() {
      inject(function($injector,_$location_) {
        DocEntryConfiguration = $injector.get('DocEntryConfiguration');
      });
    });

    it('Should read configuration', function() {
      var config = DocEntryConfiguration.getDocEntryConfiguration('Dni','DemoApp');
      expect(config.fields[0].show).toBe('false');
      expect(config.fields[0].attrname).toBe('dni_number');      

      config = DocEntryConfiguration.getDocEntryConfiguration('NIE','DemoApp');
      expect(config.fields[0].show).toBe('false');
      expect(config.fields[0].attrname).toBe('nie_number');            
    });

  });

});
