(function () {
  'use strict';

  angular.module('app.document-groups', []);

  function DocumentGroups (EnvConfig) {
    this.documentGroups = EnvConfig.documentGroups;
    this.autoTypes = EnvConfig.autoTypes;
    var self = this;
    self.selectedTypes = {};

    Object.keys(self.documentGroups).forEach(function (key) {   
          self.selectedTypes[self.documentGroups[key]] = {};    
    });

    var DocumentGroups = {
      getDocumentGroup : getDocumentGroup,
      getSelectedType : getSelectedType,
      setSelectedType : setSelectedType,
      cleanSelectedType : cleanSelectedType,
      cleanAllSelected : cleanAllSelected,
      getSupportedTypes : getSupportedTypes,
      itsAutoType : itsAutoType,
      isValidType : isValidType
    };

    function isValidType(oldType, newType) {
      return itsAutoType(oldType) && (getDocumentGroup(oldType) === getDocumentGroup(newType));
    }

    function itsAutoType(doctype) {
      for (var i in self.autoTypes) {
        if (self.autoTypes[i] === doctype) {
          return true;
        }
      }
      return false;
    }

    function getSupportedTypes() {
      return Object.keys(self.documentGroups);
    }

    function getDocumentGroup(doctype) {
      return self.documentGroups[doctype];       
    }

    function getSelectedType(group) {
      return self.selectedTypes[group];       
    }

    function setSelectedType(group, type) {
      if (self.selectedTypes[group] !== 'undefined') {      
        self.selectedTypes[group] = type;       
      }
    }

    function cleanAllSelected(){
      Object.keys(self.selectedTypes).forEach(function (key) {
        cleanSelectedType(key);
      });
    }

    function cleanSelectedType(group){
      var selectedType = getSelectedType(group);
      cleanType(selectedType) ;
    }

    function cleanType(selectedType) {
      selectedType.status = 'dis';
      var validations = selectedType.validations;
      if(typeof validations !== 'undefined') {
        Object.keys(validations).forEach(function(key){
          validations[key]='dis';
        });
      }
      var attribs =  selectedType.attribs;
      if(typeof attribs !== 'undefined') {
        Object.keys(attribs).forEach(function(key){
          attribs[key].value = '';
          attribs[key].checks = [];
        });
      }
    }

    return DocumentGroups;
  }

  DocumentGroups.$inject=['EnvConfig'];

  angular
    .module('app.document-groups')
    .factory('DocumentGroups', DocumentGroups);

})();
