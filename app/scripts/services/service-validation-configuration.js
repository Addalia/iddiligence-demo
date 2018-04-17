(function () {
  'use strict';

  angular.module('app.validation-configuration', []);

  function ValidationConfiguration (EnvConfig) {
    var self = this;
    self.validationConfigurationOriginal = EnvConfig.validationConfiguration;
    self.validationConfiguration = {};
    angular.copy(self.validationConfigurationOriginal, self.validationConfiguration);

    var ValidationConfiguration = {
      getValidationConfiguration: getValidationConfiguration,
      clean : clean
    };

    function getValidationConfiguration(doctype, id) {
      return self.validationConfiguration[doctype][id];
    }

    function clean(){
      Object.keys(self.validationConfiguration).forEach(function(doctype){
        Object.keys(self.validationConfiguration[doctype]).forEach(function (app) {
          self.validationConfiguration[doctype][app].status = 'dis';
          if(typeof (self.validationConfiguration[doctype][app].attribs) !== 'undefined'){
            Object.keys(self.validationConfiguration[doctype][app].attribs).forEach(function (attr) {

              self.validationConfiguration[doctype][app].attribs[attr].value = '';

              for(var i = 0; i < self.validationConfigurationOriginal[doctype][app].attribs[attr].checks.length; i++){
                self.validationConfiguration[doctype][app].attribs[attr].checks[i] = '';
              }

            });
          }
          if(typeof (self.validationConfiguration[doctype][app].validations) !== 'undefined'){
            Object.keys(self.validationConfiguration[doctype][app].validations).forEach(function (key) {
              self.validationConfiguration[doctype][app].validations[key] = 'dis';
            });
          }
        });
      });
    }

    return ValidationConfiguration;
  }

  ValidationConfiguration.$inject=['EnvConfig'];

  angular
    .module('app.validation-configuration')
    .factory('ValidationConfiguration', ValidationConfiguration);

})();
