(function () {
  'use strict';

  angular.module('app.validation-manager', []);

  function ValidationManager (DocumentGroups, OperationStore) {
    var self = this;

    var ValidationManager = {
      fillIdentityValidations : fillIdentityValidations,
      completeIdentityValidationsWithFront : completeIdentityValidationsWithFront,
      fillIncomeValidations : fillIncomeValidations,
      fillReceiptValidations : fillReceiptValidations,
      fillIdentityAttributes : fillIdentityAttributes,
      fillSignatureCardValidations : fillSignatureCardValidations,
      fillIdentityMediaValidations : fillIdentityMediaValidations,
      fillPatternAttributes : fillPatternAttributes,
      fillIdentityMediaAttributes : fillIdentityMediaAttributes,
      resetValidation : resetValidation,
      dateFormat : dateFormat
    };

    function resetValidation(validation, group, status) {
      var type = DocumentGroups.getSelectedType(group).doctype;

      if(typeof (validation[type].validations) !=='undefined'){
        Object.keys(validation[type].validations).forEach(function(key){
          validation[type].validations[key] = status;
        });
      }

      if(typeof (validation[type].attribs) !=='undefined'){
        Object.keys(validation[type].attribs).forEach(function(key){
          validation[type].attribs[key].value = '';
          validation[type].attribs[key].checks = [];
        });
      }

      validation[type].status = status;
    }

    function completeIdentityValidationsWithFront(doc, validationGroup){

      var typeFromId = OperationStore.getTypeFromId(doc.idDocument);
      var type = DocumentGroups.getSelectedType('IdentityFront').doctype;
      var outputType = DocumentGroups.getSelectedType('Identity').doctype;

      var value = '';

      if(typeFromId === type) {
        // Document
        var col = 0;
        value = doc.validations.find(self.searchValByDesc('VALIDATION_DOCUMENT_IDENTIFICATION_NUMBER_VS_BACK'));
        fillCheck(validationGroup[outputType].attribs.IDENTIFICATION_NUMBER_LABEL, col, value );

        value = doc.validations.find(self.searchValByDesc('VALIDATION_DOCUMENT_FIRST_NAME_VS_BACK'));
        fillCheck(validationGroup[outputType].attribs.FIRST_NAME_LABEL, col, value );

        value = doc.validations.find(self.searchValByDesc('VALIDATION_DOCUMENT_LAST_NAME_VS_BACK'));
        fillCheck(validationGroup[outputType].attribs.LAST_NAME_LABEL, col, value );

        value = doc.validations.find(self.searchValByDesc('VALIDATION_DOCUMENT_BIRTHDATE_VS_BACK'));
        fillCheck(validationGroup[outputType].attribs.BIRTHDATE_LABEL, col, value );

        value = doc.validations.find(self.searchValByDesc('VALIDATION_DOCUMENT_EXPIRATION_DATE_VS_BACK'));
        fillCheck(validationGroup[outputType].attribs.EXPIRATION_DATE_LABEL, col, value );
      }

    }

    function fillIdentityValidations(doc, validationGroup, ocrGroup) {

      var typeFromId = OperationStore.getTypeFromId(doc.idDocument);
      var type = DocumentGroups.getSelectedType('Identity').doctype;

      if (doc.documentStatus === 'OK') {
         validationGroup[type].status = 'ok';
      } else if  (doc.documentStatus === 'KO'){
          validationGroup[type].status = 'ko';
      }

      if (typeof doc.views !== 'undefined'){
        if (typeof doc.views[0] !== 'undefined'){
          if (doc.views[0].documentStatus !== undefined && doc.views[0].documentStatus === 'KO') {
              ocrGroup.Identity = 'ko';
          }
        }
      }

      if (ocrGroup.Identity === 'ko' && typeFromId !== undefined){
          validationGroup[type].status = 'ko';
      }

      var value = '';

      if(typeFromId === type && validationGroup[type].headers!==undefined && validationGroup[type].headers.length > 0) {
        // System
        var col = 1;

        value = doc.validations.find(self.searchValByDesc('VALIDATION_SYSTEM_IDENTIFICATION_NUMBER_VS_BACK'));
        fillCheck(validationGroup[type].attribs.IDENTIFICATION_NUMBER_LABEL, col, value );

        value = doc.validations.find(self.searchValByDesc('VALIDATION_SYSTEM_FIRST_NAME_VS_BACK'));
        fillCheck(validationGroup[type].attribs.FIRST_NAME_LABEL, col, value );

        value = doc.validations.find(self.searchValByDesc('VALIDATION_SYSTEM_LAST_NAME_VS_BACK'));
        fillCheck(validationGroup[type].attribs.LAST_NAME_LABEL, col, value );

        value = doc.validations.find(self.searchValByDesc('VALIDATION_SYSTEM_BIRTHDATE_VS_BACK'));
        fillCheck(validationGroup[type].attribs.BIRTHDATE_LABEL, col, value );

        value = doc.validations.find(self.searchValByDesc('VALIDATION_SYSTEM_EXPIRATION_DATE_VS_BACK'));
        fillCheck(validationGroup[type].attribs.EXPIRATION_DATE_LABEL, col, value );

        var number = doc.validations.find(self.searchValByDesc('VALIDATION_IDENTIFICATION_NUMBER'));
        var date = doc.validations.find(self.searchValByDesc('VALIDATION_EXPIRATION_DATE'));

        fillValidation(validationGroup[type],'VALIDATION_IDENTIFICATION_NUMBER_LABEL',number);
        fillValidation(validationGroup[type],'VALIDATION_EXPIRATION_DATE_LABEL',date);
      }

    }

    function fillCheck(attrib, col, value) {
      if(attrib === undefined){
        return;
      }

      if(value !== undefined) {
        if (value.status === 'OK') {
          attrib.checks[col] = 'ok';
        } else {
          attrib.checks[col] = 'ko';
        }
      }
    }

    function fillValidation(validationConf, validationName, value) {
      if(value !== undefined && validationConf.validations[validationName] !== undefined) {
        if (value.status === 'OK') {
          validationConf.validations[validationName] = 'ok';
        } else {
          validationConf.validations[validationName] = 'ko';
        }
      }
    }

    function fillIdentityAttributes(doc, validationGroup){
      var type = DocumentGroups.getSelectedType('Identity').doctype;
      fillAttribute(validationGroup[type].attribs, 'FIRST_NAME_LABEL', doc.attributes[type.toLowerCase() + '_first_name']);
      fillAttribute(validationGroup[type].attribs, 'LAST_NAME_LABEL', doc.attributes[type.toLowerCase() + '_last_name']);
      fillAttribute(validationGroup[type].attribs, 'IDENTIFICATION_NUMBER_LABEL', doc.attributes[type.toLowerCase() + '_number']);

      var date = doc.attributes[type.toLowerCase() + '_expiration_date'];
      fillDateAttribute(validationGroup[type].attribs, 'EXPIRATION_DATE_LABEL', date);
      date = doc.attributes[type.toLowerCase() + '_birthdate'];
      fillDateAttribute(validationGroup[type].attribs, 'BIRTHDATE_LABEL', date);
    }

    function fillIdentityMediaAttributes(doc, validationGroup){
      var type = DocumentGroups.getSelectedType('IdentityMedia').doctype;
      fillAttribute(validationGroup[type].attribs, 'PERCENTAGE_OF_COINCIDENCE_LABEL', doc.attributes.identity_media_confidence_recognition);
    }

    function fillPatternAttributes(doc, validationGroup){
      var type = DocumentGroups.getSelectedType('Pattern').doctype;
      fillAttribute(validationGroup[type].attribs, 'PATTERN_NAME_LABEL', doc.attributes[type.toLowerCase() + '_name']);
      fillAttribute(validationGroup[type].attribs, 'PATTERN_NUMBER_LABEL', doc.attributes[type.toLowerCase() + '_number']);
    }

    function fillAttribute(attributeArray, attributeName, value){
      if(value !== undefined && attributeArray[attributeName] !== undefined){
        attributeArray[attributeName].value = value;
      }
    }

    function fillDateAttribute(attributeArray, attributeName, date){
      fillAttribute(attributeArray, attributeName, dateFormat(date));
    }

    function fillIncomeValidations(doc, validationGroup, ocrGroup) {
      var typeFromId = OperationStore.getTypeFromId(doc.idDocument);
      var type = DocumentGroups.getSelectedType('Income').doctype;
      var fname = '';
      var lname = '';
      var value = '';

      if(typeFromId === type) {
          fname = doc.validations.find(self.searchValByDesc('VALIDATION_FIRST_NAME'));
          lname = doc.validations.find(self.searchValByDesc('VALIDATION_LAST_NAME'));
          value = doc.validations.find(self.searchValByDesc('VALIDATION_AMOUNT'));
      }

      var allgood = true;

      if(fname !== undefined && lname !== undefined) {
        if(fname.status === 'OK' && lname.status === 'OK') {
          validationGroup[type].validations.EQUALS_NAME_INCOME_LABEL = 'ok';
        } else {
          validationGroup[type].validations.EQUALS_NAME_INCOME_LABEL = 'ko';
          allgood = false;
        }
      }

      if(value !== undefined) {
        if (value.status === 'OK') {
          validationGroup[type].validations.EQUALS_AMOUNT_LABEL = 'ok';
        } else {
          validationGroup[type].validations.EQUALS_AMOUNT_LABEL = 'ko';
          allgood = false;
        }
      }

      if(doc.documentStatus !== undefined && typeFromId !== undefined) {
        if (doc.documentStatus === 'OK') {
            if (allgood){
                validationGroup[type].status = 'ok';
            } else {
              validationGroup[type].status = 'ko';
            }
        } else if (doc.documentStatus === 'KO') {
          validationGroup[type].status = 'ko';
          validationGroup[type].validations.EQUALS_AMOUNT_LABEL = 'ko';
          validationGroup[type].validations.EQUALS_NAME_INCOME_LABEL = 'ko';
        }
      }

      if (typeof doc.views !== 'undefined' && typeFromId !== undefined) {
        if (typeof doc.views[0] !== 'undefined') {
          if (doc.views[0].documentStatus !== undefined && doc.views[0].documentStatus === 'KO') {
              ocrGroup.Income = 'ko';
          }
        }
      }

      if((fname === undefined || lname === undefined || value === undefined) && typeFromId !== undefined) {
        if (ocrGroup.Income === 'ko') {
          validationGroup[type].validations.EQUALS_AMOUNT_LABEL = 'ko';
          validationGroup[type].validations.EQUALS_NAME_INCOME_LABEL = 'ko';
          validationGroup[type].status = 'ko';
        }
      }
    }

    function fillReceiptValidations(doc, validationGroup, ocrGroup) {
      var typeFromId = OperationStore.getTypeFromId(doc.idDocument);
      var type = DocumentGroups.getSelectedType('Receipt').doctype;
      var fname = '';
      var lname = '';
      var account = '';
      var number = '';
      var date = '';

      if(typeFromId === type) {

        if(type === 'Receipt') {
          number = doc.validations.find(self.searchValByDesc('VALIDATION_IDENTITY'));
          date = doc.validations.find(self.searchValByDesc('VALIDATION_DATE'));
        }

        if (type === 'Bank_Receipt'){
          fname = doc.validations.find(self.searchValByDesc('VALIDATION_FIRST_NAME'));
          lname = doc.validations.find(self.searchValByDesc('VALIDATION_LAST_NAME'));
          account = doc.validations.find(self.searchValByDesc('VALIDATION_ACCOUNT_NUMBER'));
        }
      }

      var allgood = true;

      if(type === 'Receipt' && number !== undefined){
        if(number.status === 'OK') {
            validationGroup[type].validations.EQUALS_IDENTIFICATION_NUMBER_LABEL = 'ok';
        } else if(number.status === 'KO') {
            validationGroup[type].validations.EQUALS_IDENTIFICATION_NUMBER_LABEL = 'ko';
            allgood = false;
        }
      }

      if(type === 'Bank_Receipt' && fname !== undefined && lname !== undefined) {
        if(fname.status === 'OK' && lname.status === 'OK') {
            validationGroup[type].validations.EQUALS_NAME_RECEIPT_LABEL = 'ok';
        } else if(fname.status === 'KO' || lname.status === 'KO') {
            validationGroup[type].validations.EQUALS_NAME_RECEIPT_LABEL = 'ko';
            allgood = false;
        }
      }

      if(type === 'Bank_Receipt' && account !== undefined){
        if(account.status === 'OK') {
          validationGroup[type].validations.EQUALS_ACCOUNT_LABEL = 'ok';
        } else {
          validationGroup[type].validations.EQUALS_ACCOUNT_LABEL = 'ko';
          allgood = false;
        }
      } else if (type === 'Receipt' && date !== undefined) {
        if(date.status==='OK') {
          validationGroup[type].validations.EQUALS_DATE_LABEL = 'ok';
        } else {
          validationGroup[type].validations.EQUALS_DATE_LABEL = 'ko';
          allgood = false;
        }
      }

      if(doc.documentStatus !== undefined && typeFromId !== undefined) {
        if(doc.documentStatus === 'OK') {
          if (allgood){
            validationGroup[type].status = 'ok';
          }else {
            validationGroup[type].status = 'ko';
          }
        } else if (doc.documentStatus === 'KO' || ocrGroup.Receipt === 'ko') {
          validationGroup[type].status = 'ko';

          if(type === 'Receipt') {
            validationGroup[type].validations.EQUALS_IDENTIFICATION_NUMBER_LABEL = 'ko';
            validationGroup[type].validations.EQUALS_DATE_LABEL = 'ko';
          }

          if (type === 'Bank_Receipt') {
            validationGroup[type].validations.EQUALS_NAME_RECEIPT_LABEL = 'ko';
            validationGroup[type].validations.EQUALS_ACCOUNT_LABEL = 'ko';
          }
        }
      }

      if (typeof doc.views !== 'undefined' && typeFromId !== undefined) {
        if (typeof doc.views[0] !== 'undefined') {
          if (doc.views[0].documentStatus !== undefined && doc.views[0].documentStatus === 'KO') {
            ocrGroup.Receipt = 'ko';
          }
        }
      }

      if((fname === undefined || lname === undefined || account===undefined) && typeFromId !== undefined) {
        if (ocrGroup.Receipt === 'ko') {

          if(type === 'Receipt') {
            validationGroup[type].validations.EQUALS_IDENTIFICATION_NUMBER_LABEL = 'ko';
            validationGroup[type].validations.EQUALS_ACCOUNT_LABEL = 'ko';
          }

          if (type === 'Bank_Receipt') {
            validationGroup[type].validations.EQUALS_IDENTIFICATION_NUMBER_LABEL = 'ko';
            validationGroup[type].validations.EQUALS_ACCOUNT_LABEL = 'ko';
            validationGroup[type].status = 'ko';
          }
        }
      }
    }

    function fillSignatureCardValidations(doc, validationGroup, ocrGroup){
      var typeFromId = OperationStore.getTypeFromId(doc.idDocument);
      var type = DocumentGroups.getSelectedType('SignatureCard').doctype;

      if (typeFromId === type) {
        var sender_signature = doc.validations.find(self.searchValByDesc('VALIDATION_SENDER_SIGN'));
        var agent_signature = doc.validations.find(self.searchValByDesc('VALIDATION_AGENT_SIGN'));

        if (typeof doc.views !== 'undefined' && typeFromId !== undefined) {
          if (typeof doc.views[0] !== 'undefined') {
            if (doc.views[0].documentStatus !== undefined && doc.views[0].documentStatus === 'KO') {
              ocrGroup.SignatureCard = 'ko';
              validationGroup[type].validations.EQUALS_SENDER_SIGN_LABEL = 'ko';
              validationGroup[type].validations.EQUALS_AGENT_SIGN_LABEL = 'ko';
              validationGroup[type].status = 'ko';
              return;
            }
          }
        }

        var allgood = true;

        if(sender_signature!== undefined) {
          if(sender_signature.status === 'OK') {
            validationGroup[type].validations.EQUALS_SENDER_SIGN_LABEL = 'ok';
          } else if(sender_signature.status === 'KO') {
            validationGroup[type].validations.EQUALS_SENDER_SIGN_LABEL = 'ko';
            allgood = false;
          }
        }

        if(agent_signature!== undefined) {
          if(agent_signature.status === 'OK') {
            validationGroup[type].validations.EQUALS_AGENT_SIGN_LABEL = 'ok';
          } else if(agent_signature.status === 'KO') {
            validationGroup[type].validations.EQUALS_AGENT_SIGN_LABEL = 'ko';
            allgood = false;
          }
        }

        if(doc.documentStatus !== undefined && typeFromId !== undefined) {
          if(doc.documentStatus === 'OK') {
            if (allgood){
              validationGroup[type].status = 'ok';
            }else {
              validationGroup[type].status = 'ko';
            }
          }
        }
      }

    }

    function fillIdentityMediaValidations(doc, validationGroup){
      var typeFromId = OperationStore.getTypeFromId(doc.idDocument);
      var type = DocumentGroups.getSelectedType('IdentityMedia').doctype;

      if (typeFromId === type) {
        var confidence_recognition = doc.validations.find(self.searchValByDesc('VALIDATION_FACE_RECOGNITION'));

        if (typeof doc.validations !== 'undefined') {
            for (var i = 0; i <= doc.validations.length - 1; i++) {
                if (doc.validations[i].description !== undefined && doc.validations[i].description === confidence_recognition.description) {
                    if (doc.validations[i].status !== undefined && doc.validations[i].status === 'KO') {
                      validationGroup[type].status = 'ko';
                      return;
                    } else if (doc.validations[i].status !== undefined && doc.validations[i].status === 'OK') {
                      validationGroup[type].status = 'ok';
                      return;
                    }
                }
            }
        }
      }

    }

    function dateFormat(strDate) {
      if(strDate!==undefined && strDate!=='' ){
        return strDate.substring(6,8) + '/' + strDate.substring(4,6) + '/' + strDate.substring(0,4);
      } else {
        return strDate;
      }
    }

    self.searchValByDesc = function(desc){
      return function(val){
        return val.description === desc;
      };
    };

    return ValidationManager;
  }

  ValidationManager.$inject=['DocumentGroups', 'OperationStore'];

  angular
    .module('app.validation-manager')
    .factory('ValidationManager', ValidationManager);

})();
