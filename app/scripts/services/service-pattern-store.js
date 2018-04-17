(function() {
    'use strict';
    angular.module('app.service-patternstore', ['app.document-groups']);
    function PatternStore(){
        /*jshint validthis:true */
        var self = this;
        self.store = {
            //General
            isStarted : isStarted,
            getTypeFromId : getTypeFromId,
            setTypeForId : setTypeForId,
            //Pattern
            getPattern : getPattern,
            setPattern : setPattern,
            getPatternStat : getPatternStat,
            setPatternStat : setPatternStat,
            //Document
            getMediaStat : getMediaStat,
            setMediaStat : setMediaStat,
            getMedia : getMedia,
            setMedia : setMedia,
            setPatProps : setPatProps,
            hasDoc : hasDoc,
            setDoc : setDoc,
            getDoc:getDoc,
            //View
            setView : setView,
            getView : getView,
            //Setup & Clean
            setup:setup,
            clean : clean
        };

        self.docids = {};
        self.pat = {};
        self.pattern = {};
        self.media = {};
        self.mediaStat = {};
        self.views = {};
        self.docs = {};
        self.sentExceptionRules = {};

        function setup(groupsConfigurations, sentExceptionRules) {
            initPattern();
            initMediaStat();
            initViews();
            initDocs();

            if(groupsConfigurations === undefined){
              return;
            }

            if(sentExceptionRules !== undefined){
              self.sentExceptionRules = sentExceptionRules;
            }
            groupsConfigurations.forEach(function(group) {
                Object.keys(group).forEach(function(key) {
                var docEntryConfiguration = group[key];
                self.views[docEntryConfiguration.doctype] = {'viewId' : '',
                                                             'attributes' : {}};
                self.docs[docEntryConfiguration.doctype] = {'documentId' : '',
                                      'type': docEntryConfiguration.doctype,
                                      'attributes': {}
                                       };
                });
            });
        }

        function hasDoc(doctype){
            return self.docs.hasOwnProperty(doctype);
        }

        function getPattern(){
            return self.pat;
        }

        function setPattern(pattern){
            self.pat = pattern;
        }

        function getMedia(){
            return self.media;
        }

        function setMedia(media){
            self.media = media;
        }

        function getMediaStat(){
            return self.mediaStat;
        }

        function setMediaStat(stats){
            var len = stats.length;
            for (var i = 0; i < len; i++) {
              var id = stats[i].idMedia;
              if(id === getView('Media').viewId) {
                self.mediaStat = stats[i];
              }
            }
        }

        function setPatProps(name, number){
          self.pat.attributes.pattern_name = name;
          self.pat.attributes.pattern_number = number;
        }

        function getView(doctype){
            return self.views[doctype];
        }

        function setView(doctype, view){
          if(doctype!==undefined && view!== undefined && view.viewId !== undefined){
            self.views[doctype] = view;
          }
        }

        function cleanPattern(doc)  {
          doc.documentId = '';
          doc.attributes = {};
        if (doc.patternId !== undefined) {
            delete(doc.patternId);
          }
        }

        function cleanMedia(view)  {
          view.attributes = {};
          view.viewId = '';
          view.documentStatus = '';
        }

        function isStarted(){
          return self.pat.patternId !== '';
        }

        function clean(){
          Object.keys(self.docs).forEach(function(key){
          cleanPattern(self.docs[key]);
          });
          Object.keys(self.views).forEach(function(key){
          cleanMedia(self.views[key]);
          });
          self.pat.patternId = '';
        }

        function getPatternStat(){
          return self.patternStat;
        }

        function setPatternStat(patternStatus){
          self.patternStat = patternStatus;
        }

        function getTypeFromId(id){
          return self.docids[id];
        }

        function setTypeForId(id, doctype){
          if(id !== undefined && doctype !== undefined){
            self.docids[id] = doctype;
          }
        }

        function setDoc(doctype, doc){
          if(doctype!==undefined && doc!== undefined && doc.documentId !== undefined){
            self.docs[doctype] = doc;
          }
        }

        function getDoc(doctype){
          return self.docs[doctype];
        }

        function initPattern(){
          self.pat={
            patternId:'',
            attributes:{
              'pattern_name' : '',
              'pattern_number' : ''
            }
          };
        }

        function initMediaStat(){
          self.mediaStat =
            {
            'status' : '',
            'idMedia': ''
          };
        }

        function initViews(){
          self.views = {};
        }

        function initDocs(){
          self.docs = {};
        }

        return self.store;
    }

    PatternStore.$inject=[];

    angular
    .module('app.service-patternstore')
    .factory('PatternStore', PatternStore);

})();
