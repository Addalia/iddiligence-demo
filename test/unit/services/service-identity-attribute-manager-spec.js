(function () {
  'use strict';
  describe('CloudIDocValidationDemo service-identity-attribute-manager', function() {

    var iam;
    var selectedIdentity;
    var selectedIdentityFront;   
    var EnvConfigProviderObj;

    var fakePromise = function(isSuccess,value){
      return {
        $promise:{
          then: function(success,error){
            if(isSuccess){
              success(value);
            } else {
              error(value);
            }
          }
        }
      };
    };

    beforeEach(function() {
      module('app');
      module('app.identity-attribute-manager');

      module(function ($provide) {
        $provide.provider('EnvConfig', function(){
          var envConfig = { "restUrl": "http://localhost:8080/IDocValidationService/resources",
                          };

          this.$get = function() {
            return envConfig;
          };
        });
      });
      module(function (EnvConfigProvider) {
        EnvConfigProviderObj=EnvConfigProvider;
      });

      inject(function($injector){
        iam = $injector.get('IdentityAttributeManager');

      });
    });

    it('should set attributes in Dni_front from Dni attributes values', function() {
      selectedIdentity = {
            title: 'DNI',
            doctype: 'Dni',
            fields: [
              {attrname: 'dni_number', controltype: 'text', value: '1235659Q'},
              {attrname: 'dni_first_name', controltype: 'text', value: 'Pepe'},
              {attrname: 'dni_last_name', controltype: 'text', value: 'Perez'},
              {attrname: 'dni_birthdate', controltype: 'date', value: '19800206'},
              {attrname: 'dni_expiration_date', controltype: 'date', value: '20170220'}                        
            ]
      };

      selectedIdentityFront = {        
            title: 'DNI_Front',
            doctype: 'Dni_front',
            fields: []
      };

      iam.transferIdentityAttributes(selectedIdentity, selectedIdentityFront);
        
      for (var x = 0; x <= selectedIdentity.fields.length - 1; x++) {          
      
            var attrname_src = selectedIdentity.fields[x].attrname;
            var controltype_src = selectedIdentity.fields[x].controltype;              
            var value_src = selectedIdentity.fields[x].value;

            var attrname_dest = selectedIdentityFront.fields[x].attrname;
            var controltype_dest = selectedIdentityFront.fields[x].controltype;              
            var value_dest = selectedIdentityFront.fields[x].value;

            //console.log('attrname_dest=' + attrname_dest + '  attrname_src=' + attrname_src);
            expect(attrname_dest).toEqual(selectedIdentityFront.doctype.toLowerCase() + attrname_src.substring(attrname_src.indexOf('_'),attrname_src.length));

            expect(controltype_dest).toEqual(controltype_src);
            expect(value_dest).toEqual(value_src);
      }
    });

    it('should set attributes in Nie_front from NIE attributes values', function() {
      selectedIdentity = {
            title: 'NIE',
            doctype: 'NIE',
            fields: [
              {attrname: 'nie_number', controltype: 'text', value: '1235659Q'},
              {attrname: 'nie_first_name', controltype: 'text', value: 'Pepe'},
              {attrname: 'nie_last_name', controltype: 'text', value: 'Perez'},
              {attrname: 'nie_birthdate', controltype: 'date', value: '19800206'},
              {attrname: 'nie_expiration_date', controltype: 'date', value: '20170220'}                        
            ]
      };

      selectedIdentityFront = {        
            title: 'Nie_front',
            doctype: 'Nie_front',
            fields: []
      };
            
      iam.transferIdentityAttributes(selectedIdentity, selectedIdentityFront);
        
      for (var x = 0; x <= selectedIdentity.fields.length - 1; x++) {          
      
            var attrname_src = selectedIdentity.fields[x].attrname;
            var controltype_src = selectedIdentity.fields[x].controltype;              
            var value_src = selectedIdentity.fields[x].value;

            var attrname_dest = selectedIdentityFront.fields[x].attrname;
            var controltype_dest = selectedIdentityFront.fields[x].controltype;              
            var value_dest = selectedIdentityFront.fields[x].value;

            expect(attrname_dest).toEqual(selectedIdentityFront.doctype.toLowerCase() + attrname_src.substring(attrname_src.indexOf('_'),attrname_src.length));
            expect(controltype_dest).toEqual(controltype_src);
            expect(value_dest).toEqual(value_src);
      }
    });

    it('should NOT set attributes in Nie_front from Passport attributes values', function() {
      selectedIdentity = {
            title: 'Passport',
            doctype: 'Passport',
            fields: [
              {attrname: 'passport_number', controltype: 'text', value: '1235659Q'},
              {attrname: 'passport_first_name', controltype: 'text', value: 'Pepe'},
              {attrname: 'passport_last_name', controltype: 'text', value: 'Perez'},
              {attrname: 'passport_birthdate', controltype: 'date', value: '19800206'},
              {attrname: 'passport_expiration_date', controltype: 'date', value: '20170220'}                        
            ]
      };

      selectedIdentityFront = {        
            title: 'Dni_front',
            doctype: 'Dni_front',
            fields: []
      };
      
      iam.transferIdentityAttributes(selectedIdentity, selectedIdentityFront);
        
      expect(selectedIdentity.fields.length).toBe(5);
      expect(selectedIdentityFront.fields.length).toBe(0);              
    });

  });
})();
