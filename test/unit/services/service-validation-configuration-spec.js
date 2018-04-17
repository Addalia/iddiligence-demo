'use strict';

describe('CloudIDoc service ValidationConfiguration', function() {

  var $rootScope;
  var $scope;
  var envConfig;
  var EnvConfigProviderObj;

  beforeEach(function() {
    module('app');
    module('app.service-core');
    module('app.validation-configuration');

    module(function ($provide) {
      $provide.provider('EnvConfig', function(){
        var envConfig = { "restUrl": "http://localhost:8080/IDocValidationService/resources",
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
                                "attribs" : { "FIRST_NAME_LABEL" : {"value" : "", "checks" : ["",""]},
                                      "LAST_NAME_LABEL" : {"value" : "", "checks" : ["",""]},
                                      "IDENTIFICATION_NUMBER_LABEL" : {"value" : "", "checks" : ["",""]},
                                      "EXPIRATION_DATE_LABEL" : {"value" : "", "checks" : ["",""]}
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

  describe('ValidationConfiguration', function() {
    var ValidationConfiguration;
    beforeEach(function() {
      inject(function($injector,_$location_) {
        ValidationConfiguration = $injector.get('ValidationConfiguration');
      });
    });

    it('Should read configuration', function() {
      var config = ValidationConfiguration.getValidationConfiguration('Dni','DemoApp');
      expect(Object.keys(config.attribs).length).toBe(4);
      expect(config.attribs['FIRST_NAME_LABEL'].value).toBe('');
      expect(config.attribs['FIRST_NAME_LABEL'].checks.length).toBe(0);
      expect(Object.keys(config.validations).length).toBe(0);
      expect(config.headers.length).toBe(0);

      config = ValidationConfiguration.getValidationConfiguration('Dni','IdentityApp');
      expect(Object.keys(config.attribs).length).toBe(4);
      expect(config.attribs['FIRST_NAME_LABEL'].value).toBe('');
      expect(config.attribs['FIRST_NAME_LABEL'].checks.length).toBe(2);
      expect(Object.keys(config.validations).length).toBe(0);
      expect(config.headers.length).toBe(4);
      expect(config.headers[2]).toBe('HEADER_DOCUMENT_LABEL');
      expect(config.headers[3]).toBe('HEADER_SYSTEM_LABEL');
    });

    it('Should clean configuration', function() {

      var config = ValidationConfiguration.getValidationConfiguration('Dni','DemoApp');
      config.attribs['FIRST_NAME_LABEL'].value = '25';
      config.attribs['FIRST_NAME_LABEL'].checks[0] = 'ok';
      config.attribs['FIRST_NAME_LABEL'].checks[1] = 'ko';      

      ValidationConfiguration.clean();
      config = ValidationConfiguration.getValidationConfiguration('Dni','DemoApp');
      expect(Object.keys(config.attribs).length).toBe(4);
      expect(config.attribs['FIRST_NAME_LABEL'].value).toBe('');
      expect(config.attribs['FIRST_NAME_LABEL'].checks.length).toBe(2);
    });

  });

});
