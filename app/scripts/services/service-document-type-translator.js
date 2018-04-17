(function () {
  'use strict';

  angular.module('app.document-type-translator', []);

  function DoctypeTranslator (EnvConfig) {
    var self = this;
    self.doctypeTranslation = EnvConfig.documentTypeTranslation;

    function hasTranslation(doctype){
      if (self.doctypeTranslation !== undefined){
        return self.doctypeTranslation.hasOwnProperty(doctype);
      }
      return false;
    }
    
    function getRealDoctype(doctype){
        if(hasTranslation(doctype)){
          return self.doctypeTranslation[doctype];
        }
        return doctype;
    }

    return {
      hasTranslation : hasTranslation,
      getRealDoctype : getRealDoctype
    };
  }
  DoctypeTranslator.$inject=['EnvConfig'];

  angular
    .module('app.document-type-translator')
    .factory('DoctypeTranslator', DoctypeTranslator);

})();
