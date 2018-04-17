(function () {
  'use strict';
  describe('CloudIDocValidationDemo service-pattern-manager', function() {
    var som;
    var patStore;
    var fakePat;
    var fakeView;
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

    var patternMock = {"patternId" : "207", "attributes" : { "pattern_name" : "blah", "patten_number" : "1"}};
    var mediaMock = {"viewId" : "208"};

    var resetFakePattern = function() {
      fakePat = {
        create : function(){return fakePromise(true, patternMock);},
        status : function(){return fakePromise(true,"getMediaStatmock");},
        query : function(){return fakePromise(true,"getDocmock");},
        remove : function(){return fakePromise(true,"getDocmock");}
      };
    };

    var resetFakeView = function() {
      fakeView = {
        query : function(){return fakePromise(true,"getDocmock");},
        upload : function(){return fakePromise(true);},
        create : function(){return fakePromise(true, mediaMock);}
      };
    };

    var initPatInfoWithData = function(){
      patStore.setMediaStat({
      'documentStatus' : 'irrelevant',
      'documents' : { 'Media' : {
          'idDocument' : '101',
          'validations' : []}
        }
      });
      patStore.setPattern({
        patternId:'100',
        attributes:{
          'pattern_name': 'blah',
          'pattern_number': '100'
        }
      });
      patStore.setMedia('Media', {idMedia:'101',status:'ok'});
      patStore.setPattern('Pattern', { patternId:'100',
                                       attributes:{
                                          'pattern_name' : 'blah',
                                          'pattern_number' : '100'
                                                  }
                        });
    }

    var initMedia = function(){
      patStore.setMedia({
            'status' : 'irrelevant',
            'idMedia': '101'
          });
    };

    beforeEach(function() {
      resetFakePattern();
      resetFakeView();
      module('app');
      module('app.service-patternmanager');
      module('app.service-media');
      module(function ($provide) {
        $provide.value('Patterns', fakePat);
        $provide.value('Media', fakeView);
      });

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
      module(function (EnvConfigProvider) {
        EnvConfigProviderObj=EnvConfigProvider;
      });

      inject(function($injector){
        patStore = $injector.get('PatternStore');
        som = $injector.get('PatternManager');
      });
      som.clean();

      patStore.clean();
      var configuration = [{
                            Media : {
                              doctype:"Media",
                              fields:[]
                            },
                            Pattern : {
                              doctype:"Pattern",
                              fields:[]
                            }
                          }];
      patStore.setup(configuration);
    });

    it('Should empty store when clean', function() {
      spyOn(patStore, 'clean');
      som.clean();
      expect(patStore.clean).toHaveBeenCalled();
    });

    it('Should get pattern status and modify store pattern status when getMediaStat', function() {
      var statusCalled = false;
      initPatInfoWithData();
      spyOn(patStore, 'setPatProps');
      fakePat.status = function(){
        statusCalled = true;
        return fakePromise(true,{status:'blop',idMedia:{}});
      };
      som.getMediaStat();
      expect(statusCalled).toBe(true);
    });

    it('deletePat should fail without data.', function() {
      som.deletePat().then(function(){
          expect(false).toBe(true);
        },
        function(){
          expect(true).toBe(true);
        }
      );
      setTimeout(function(){}, 100);
    });

    it('deletePat should call remove when there is data', function() {
      var removed = false;
      initPatInfoWithData();
      fakePat.remove = function(){
        removed = true;
        return fakePromise(false,'irrelevant');
      };
      som.deletePat();
      expect(removed).toBe(true);
    });

    it('Should return an error if getPattern is called with a wrong doc', function() {
      som.getPattern('wrong').then(function(){
          expect(false).toBe(true);
        },
        function(){
          expect(true).toBe(true);
        }
      );
      setTimeout(function(){}, 100);
    });

    it('Should access Document if getPattern is called with a valid doc', function() {
      var queryCalled = false;
      fakePat.query = function(){
        queryCalled = true;
        return fakePromise(false,'irrelevant');
      };
      som.getPattern('Pattern')
      expect(queryCalled).toBe(true);
    });

    it('Should setAttributte must fail if called with wrong doc', function() {
      som.setAttributte('wrong','nothing',0).then(function(){
          expect(false).toBe(true);
        },
        function(){
          expect(true).toBe(true);
        }
      );
      setTimeout(function(){}, 100);
    });

    it('Should setAttributte must fail if called with wrong doc', function() {
      expect(patStore.getPattern('Pattern').attributes.patternId).toBe(undefined);
      som.setAttributte('Pattern','nothing',0);
      var pattern_name = patStore.getPattern('Pattern').attributes.pattern_name;
      expect(pattern_name).toBe('');
    });

    it('getMedia should fail if called with wrong doc', function() {
      som.getMedia('wrong').then(function(){
          expect(false).toBe(true);
        },
        function(){
          expect(true).toBe(true);
        }
      );
      setTimeout(function(){}, 100);
    });

    it('Should getMedia', function() {
      initPatInfoWithData();
      patStore.setView('Media',{'attributes': {a:1,b:2}});
      patStore.getView('Media').viewId = '104';
      var queryCalled = false;
      fakeView.query =  function(){
        queryCalled = true;
        return fakePromise(false,'irrelevant');
      };
      som.getMedia('Media');
      expect(queryCalled).toBe(true);
    });

    it('sendPatternFile should fail if called with wrong doc', function() {
      som.sendPatternFile('wrong').then(function(){
          expect(false).toBe(true);
        },
        function(){
          expect(true).toBe(true);
        }
      );
      setTimeout(function(){}, 100);
    });

    it('sendMediaFile should upload the file', function() {
      initPatInfoWithData();
      var uploadCalled = false;
      fakeView.upload =  function(){
        uploadCalled = true;
        return fakePromise(false,'irrelevant');
      };
      som.sendPatternFile('Media', 'somefile');
      expect(uploadCalled).toBe(true);
    });

    it('getViewFile should fail if called with wrong doc', function() {
      som.getViewFile('wrong').then(function(){
          expect(false).toBe(true);
        },
        function(){
          expect(true).toBe(true);
        }
      );
      setTimeout(function(){}, 100);
    });
  });
})();
