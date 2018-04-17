(function () {
  'use strict';

  angular.module('app.doc-entry-configuration', []);

  function DocEntryConfiguration (EnvConfig) {
    this.docEntryConfiguration = {};
    angular.copy(EnvConfig.docEntryConfiguration,this.docEntryConfiguration);
    var self = this;

    var DocEntryConfiguration = {
      getDocEntryConfiguration: getDocEntryConfiguration,
	  reLoad: reLoad
    };

    function getDocEntryConfiguration(doctype, id) {
      return self.docEntryConfiguration[doctype][id];
    }

	function reLoad() {
      angular.copy(EnvConfig.docEntryConfiguration,self.docEntryConfiguration);
    }

    return DocEntryConfiguration;
  }

  DocEntryConfiguration.$inject=['EnvConfig'];

  angular
    .module('app.doc-entry-configuration')
    .factory('DocEntryConfiguration', DocEntryConfiguration);

})();
