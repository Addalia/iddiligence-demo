(function () {
  'use strict';
  describe('CloudIDocValidationDemo service-pattern-store', function() {
    var PatternStore;

    var initpatInfo = function(){
      PatternStore.setPattern({
      patternId:'100',
      attributes:{
        'pattern_name': 'testPat',
        'pattern_number': '1'
      }});
    }


    var initPatInfoWithData = function(){
      PatternStore.setMediaStat({
      'status' : 'irrelevant',
      'idMedia' : '101'
      });

      PatternStore.setPattern({
        patternId:'100',
        attributes:{
          'pattern_name': 'blah',
          'pattern_number': '100'
        }});
    }

    beforeEach(function(){
      module('app');
      module('app.service-patternstore');
      module('app.document-groups');
      module(function ($provide) {
        $provide.provider('EnvConfig', function(){
          var envConfig = {"restUrl": "http://localhost:8080/IDocValidationService/resources",
                            "documentGroups" : {
                                "Pattern":"Pattern",
                                "Media":"Pattern"
                            }
                          };

          this.$get = function() {
            return envConfig;
          };
        });
      });
      inject(function($injector){
          PatternStore = $injector.get('PatternStore');
      });
      PatternStore.clean();
      var configuration = [{
                            Media : {
                              doctype:"Media",
                              fields:[]
                            }
                          }];
        PatternStore.setup(configuration);
    });

    it('Should be not started at first', function() {
      expect(PatternStore.isStarted()).toBe(false);
    });

    it('Should be started when there is op info', function() {
      initPatInfoWithData();
      expect(PatternStore.isStarted()).toBe(true);
    });

    it('getTypeFromId should be undefined at first', function() {
      expect(PatternStore.getTypeFromId('whatever')).toBe(undefined);
    });

    it('Setter and getter for docIds should match', function() {
      PatternStore.setTypeForId('1','Media');
      expect(PatternStore.getTypeFromId('1')).toBe('Media');
    });

    it('getTypeFromId should return all Pattern info. Empty at the beginning', function() {
      var pat = PatternStore.getPattern('Pattern');
      expect(pat.patternId).toBe('');
      expect(pat.attributes.pattern_name).toBe('');
      expect(pat.attributes.pattern_number).toBe('');
    });

    it('getTypeFromId should return all Op info. With data', function() {
      PatternStore.setPattern({
        patternId:'100',
        attributes:{
          'pattern_name': 'blah',
          'pattern_number': '100'
        }});

      PatternStore.getPattern('Pattern');
      var pat = PatternStore.getPattern('Pattern');
      expect(pat.patternId).toBe('100');
      expect(pat.attributes.pattern_name).toBe('blah');
      expect(pat.attributes.pattern_number).toBe('100');
    });

    it('getTypeFromId should return all Pattern info. With data', function() {
      initPatInfoWithData();
      PatternStore.setPatProps('blah', '100');

      PatternStore.getPattern('Pattern');
      var pat = PatternStore.getPattern('Pattern');
      expect(pat.patternId).toBe('100');
      expect(pat.attributes.pattern_name).toBe('blah');
      expect(pat.attributes.pattern_number).toBe('100');
    });

    it('hasDoc should say correclty if a document type is supported', function() {
      expect(PatternStore.hasDoc('Media')).toBe(true);
    });

    it('setDoc and getDoc should set and return the data of the expected document', function() {
      initPatInfoWithData();
      PatternStore.setDoc('Media',{documentId:'101',type: 'Media',attributes:{}});
      expect(PatternStore.getDoc('Media').documentId).toBe('101');
    });


    it('set/get/clean view should be coherent', function() {
      expect(Object.keys(PatternStore.getView('Media').attributes).length).toBe(0);
      PatternStore.setView('Media',{'attributes': {a:1,b:2}});
      PatternStore.clean();
      expect(Object.keys(PatternStore.getView('Media').attributes).length).toBe(0);
    });

  });
})();
