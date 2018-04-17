(function () {
  'use strict';

  angular.module('app.identity-attribute-manager', []);

  function IdentityAttributeManager () {
    var self = this;
    self.identityAttributeManager = {
      transferIdentityAttributes : transferIdentityAttributes
    };

    function transferIdentityAttributes(src,dest) {
      if((src.doctype === 'Dni' && dest.doctype === 'Dni_front') || 
         (src.doctype === 'NIE' && dest.doctype === 'Nie_front')) {
        var scrFields = src.fields;
        dest.fields = [];
        var destFields = dest.fields;
        transfer(scrFields, destFields, dest.doctype);
      }
    }

    function transfer(scr, dest, prefix) {
      for (var i = 0; i <= scr.length - 1; i++) {
        var field = scr[i];
        dest.push({'attrname' : renameAtribute(field.attrname, prefix.toLowerCase()),
                   'value' : field.value,
                   'controltype' : field.controltype});
      }
    }

    function renameAtribute(dniAttribute, prefix) {
      return prefix + dniAttribute.substring(dniAttribute.indexOf('_'),dniAttribute.length);
    }

    return self.identityAttributeManager;
  }

  angular
    .module('app.identity-attribute-manager')
    .factory('IdentityAttributeManager', IdentityAttributeManager);

})();
