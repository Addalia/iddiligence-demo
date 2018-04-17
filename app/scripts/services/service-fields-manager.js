(function () {
	'use strict';

	angular.module('app.service-fieldsmanager', ['app.service-operationmanager', 'app.service-patternmanager']);

	function FieldsManager(OperationManager, PatternManager){

		var self = this;

		self.fields = {
			setAttributesValues : setAttributesValues,
      setAttributeValue : setAttributeValue
		};

		function setAttributesValues(documentsconfiguration, selectedtype) {
            setValues(documentsconfiguration[selectedtype], selectedtype);
    }

    function setValues(documentsconfiguration, selectedtype) {
      for (var x = 0; x < documentsconfiguration.fields.length; x++) {
            var attrname = documentsconfiguration.fields[x].attrname;
            var value = documentsconfiguration.fields[x].value;

            if(documentsconfiguration.fields[x].controltype === 'date'){
            	value= parseDate(value);
            }
            if(selectedtype === 'Pattern') {
               PatternManager.setAttributte(selectedtype, attrname, value);
            } else {
               OperationManager.setAttributte(selectedtype, attrname, value);
            }
        }
    }

    function setAttributeValue(documentsconfiguration, attribute, value) {
      for (var x = 0; x < documentsconfiguration.fields.length; x++) {
            var attrname = documentsconfiguration.fields[x].attrname;
            if (attrname === attribute) {
              documentsconfiguration.fields[x].value = value;
              break;
            }
      }
    }

    function parseDate(objDate) {
		if(objDate === undefined || objDate === ''){
			return '';
		}
		if(typeof objDate === 'string'){
			return objDate.substring(6,10) + objDate.substring(3,5) + objDate.substring(0,2);
		}
		return pad(objDate.getFullYear(),4) + pad((objDate.getMonth() + 1),2) + pad(objDate.getDate(),2);
    }

		function pad(num, size) {
			var s = num + '';
			while (s.length < size){
				s = '0' + s;
			}
			return s;
		}

	    return self.fields;
	}

	FieldsManager.$inject=['OperationManager', 'PatternManager'];

	angular
	.module('app.service-fieldsmanager')
	.factory('FieldsManager', FieldsManager);

})();
