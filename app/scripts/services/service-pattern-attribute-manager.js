(function () {
  'use strict';

  angular.module('app.pattern-attribute-manager', []);

  function PatternAttributeManager () {
    var self = this;
    self.patternAttributeManager = {
      transferPatternAttributes : transferPatternAttributes
    };

    function transferPatternAttributes(src,dest) {
      if(src.doctype === 'Pattern') {
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

    function renameAtribute(patternAttribute, prefix) {
      return prefix + patternAttribute.substring(patternAttribute.indexOf('_'),patternAttribute.length);
    }

    return self.patternAttributeManager;
  }

  angular
    .module('app.pattern-attribute-manager')
    .factory('PatternAttributeManager', PatternAttributeManager);

})();
