(function () {
    'use strict';

    angular.module('app.service-patternmanager', ['app.service-core', 'app.service-view', 'app.service-patternstore', 'app.service-patterns', 'app.service-media']);

    function PatternManager($q, Patterns, Media, View, PageStatus, PatternStore){
        /*jshint validthis:true */
        var self = this;

        self.manager = {
                // Patterns
                initPattern:initPattern,
                clean:clean,
                getPattern:getPattern,
                setAttributte:setAttributte,
                deletePat : deletePat,
                // Media
                getMedia:getMedia,
                getMediaStat:getMediaStat,
                getViewFile:getViewFile,
                sendPatternFile:sendPatternFile
            };

        function clean(){
            PatternStore.clean();
        }

        function getMediaStat(){
          var deferred = $q.defer();
          if(!PatternStore.isStarted()){
            deferred.resolve(PatternStore.getMediaStat());
          }
          if(PatternStore.getPattern().patternId !== '') {
            Patterns.status({idpattern:PatternStore.getPattern().patternId})
            .$promise.then(
              function (stats) {
                PatternStore.setMediaStat(stats);
                deferred.resolve(PatternStore.getMediaStat());
              },
              function (error) {
                deferred.reject(error);
              });
          } else {
              deferred.reject('The pattern not been created yet');
          }
          return deferred.promise;
        }

        function sendPatternFile(doctype, file){
          var deferred = $q.defer();
          if(PatternStore.hasDoc(doctype)) {
            ensureMediaExists(doctype, function(){
              Media.upload({idpattern:PatternStore.getPattern().patternId, idmedia:PatternStore.getView('Media').viewId}, file)
              .$promise.then(
                function(){
                  deferred.resolve();
                },
                function(error){
                  deferred.reject(error);
                });
            });
          } else {
            deferred.reject('unrecognized document type');
          }
          return deferred.promise;
        }

        function deletePat(){
          var deferred = $q.defer();
          if(PatternStore.isStarted()){
            Patterns.remove({idpattern:PatternStore.getPattern().patternId})
            .$promise.then(
              function(){
                deferred.resolve();
              },
              function(error){
                deferred.reject('Pattern delete failed :' + error);
              }
              );
          } else {
            deferred.resolve();
          }
          return deferred.promise;
        }

        function sendMedia(doctype, callback){
          var deferred = $q.defer();
          if(PatternStore.hasDoc(doctype)) {
              ensurePatternExists(doctype, function(){
              var v = PatternStore.getView('Media');
              if(v.viewId==='' || v.viewId === undefined){
                Media.create({idpattern:PatternStore.getPattern().patternId}, v)
                .$promise.then(
                  function(view){
                    PatternStore.setView('Media',view);
//                    PatternStore.setMedia(PatternStore.getView('Media'));
                    if(callback !== undefined){callback();}
                    deferred.resolve(PatternStore.getView('Media'));
                  },
                  function(error){
                    PageStatus.goLoginIfUnauthorized(error.status);
                  });
              }});
          } else {
            deferred.reject('unrecognized document type');
          }

          return PatternStore.getView(doctype);
        }

        function getPattern(doctype){
          var deferred = $q.defer();
          var doc;
          if(PatternStore.hasDoc(doctype)) {
            doc = PatternStore.getDoc(doctype);
            Patterns.query({idpattern:PatternStore.getPattern().patternId})
            .$promise.then(
              function (doc) {
                PatternStore.setDoc(doctype,doc);
                PatternStore.setTypeForId(doc.documentId, doctype);
                deferred.resolve(PatternStore.getDoc(doctype));
              },
              function (error) {
                deferred.reject(error);
              });
          } else {
            deferred.reject('unrecognized document type');
          }
          return deferred.promise;
        }

        function getMedia(doctype){
          var deferred = $q.defer();
          var doc;
          if(PatternStore.hasDoc(doctype)) {
            doc = PatternStore.getDoc(doctype);
            Media.query({idpattern:PatternStore.getPattern().patternId, idmedia:doc.documentId})
            .$promise.then(
              function (doc) {
                PatternStore.setDoc(doctype,doc);
                PatternStore.setTypeForId(doc.documentId, doctype);
                deferred.resolve(PatternStore.getDoc(doctype));
              },
              function (error) {
                deferred.reject(error);
              });
          } else {
            deferred.reject('unrecognized document type');
          }
          return deferred.promise;
        }

        function ensureMediaExists(doctype, callback){
          var doc = PatternStore.getDoc(doctype);
          if(doc.documentId === ''){
            sendMedia(doctype,callback);
          } else {
            if(callback !== undefined){callback();}
          }
        }

        function ensurePatternExists(doctype, callback){
          if(PatternStore.getPattern().patternId === ''){
            initPattern(callback, doctype);
          } else {
            if(callback !== undefined){callback();}
          }
        }

        function getViewFile(doctype) {
          var deferred = $q.defer();
          if(PatternStore.hasDoc(doctype)) {
            var v = PatternStore.getView(doctype);
            if(v.viewId !=='' && v.viewId !== undefined){
              Media.download({idpattern:PatternStore.getPattern().patternId, idview:v.viewId})
              .$promise.then(
                function(view){
                  deferred.resolve(view);
                },
                function(error){
                  deferred.reject(error);
                });
            } else {
              deferred.reject('The view has not been created yet');
            }
          } else {
            deferred.reject('unrecognized document type');
          }
          return deferred.promise;
        }

        function setAttributte(doctype, attr, value) {
          var deferred = $q.defer();
          if(PatternStore.hasDoc(doctype)) {
            PatternStore.getDoc(doctype).attributes[attr] = value;
            deferred.resolve();
          } else {
            deferred.reject('doctype does not exists');
          }
          return deferred.promise;
        }

        function initPattern(callback, doctype){
          PatternStore.setPatProps(PatternStore.getDoc(doctype).attributes.pattern_name,PatternStore.getDoc(doctype).attributes.pattern_number);
          Patterns.create(PatternStore.getPattern())
          .$promise.then(
            function (pattern) {
              PatternStore.setPattern(pattern);
              if(callback !== undefined){callback();}
            },
            function (error) {
              PageStatus.goLoginIfUnauthorized(error.status);
            });
        }
        return self.manager;
    }

    PatternManager.$inject=['$q', 'Patterns', 'Media', 'View', 'PageStatus', 'PatternStore'];

    angular
    .module('app.service-patternmanager')
    .factory('PatternManager', PatternManager);

})();
