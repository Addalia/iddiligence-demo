(function() {
	'use strict';
	angular.module('app.service-operationstore', ['app.document-groups']);
	function OperationStore(DocumentGroups){
		/*jshint validthis:true */
    var self = this;
    self.store = {
      //General
      isStarted : isStarted,
      allDocsSent : allDocsSent,
      getTypeFromId : getTypeFromId,
      setTypeForId : setTypeForId,
      //Operation
      isTerminated : isTerminated,
      setTerminated : setTerminated,
      getOp : getOp,
      setOp : setOp,
      setOpProps : setOpProps,
      getOpStat : getOpStat,
      setOpStat : setOpStat,
      //Document
      hasDoc : hasDoc,
      setDoc : setDoc,
      getDoc : getDoc,
      resetDoc : resetDoc,
      moveToNewType : moveToNewType,
      //View
      setView : setView,
      getView : getView,
      //Setup & Clean
      clean : clean,
      setup : setup
    };

    self.docids = {};
    self.op = {};
    self.opStat = {};
    self.views = {};
    self.docs = {};
    self.terminated = false;
    self.sentExceptionRules = {};

    function setup(groupsConfigurations, sentExceptionRules) {
     initOp();
     initOpStat();
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
       self.opStat.documents.push({
        'idDocument' : '',
        'documentStatus' : '',
        'validations' : [],
        'views' : []
      });
       self.views[docEntryConfiguration.doctype] = {'attributes' : {}};
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

 function isTerminated(){
   return self.terminated;
 }

 function setTerminated(terminated){
   self.terminated = terminated;
 }

 function getOp(){
   return self.op;
 }

 function setOp(op){
   self.op = op;
 }

 function getOpStat(){
   return self.opStat;
 }

 function setOpStat(opStatus){
   self.opStat = opStatus;
 }

 function setOpProps(name, number, authorization){
   self.op.attributes.operation_name = name;
   self.op.attributes.operation_number = number;
   self.op.attributes.operation_user_authorization = authorization;
 }

 function setDoc(doctype, doc){
   if(doctype!==undefined && doc!== undefined && doc.documentId !== undefined){
    self.docs[doctype] = doc;
  }
}

function getDoc(doctype){
 return self.docs[doctype];
}

function resetDoc(doctype){
 if (doctype !== undefined) {
  self.docs[doctype].documentId = '';
  self.views[doctype].viewId = '';
}
}

function moveToNewType(oldtype, newtype){
 self.docs[newtype].documentId = self.docs[oldtype].documentId;
 self.docs[newtype].type = self.docs[oldtype].type;
 angular.copy(self.docs[oldtype].attributes, self.docs[newtype].attributes);
 moveViewToNewType(oldtype, newtype);

 self.docs[oldtype].documentId = '';
 self.docs[oldtype].type = oldtype;
 self.docs[oldtype].attributes = {};

 self.views[oldtype].viewId = '';
 self.views[oldtype].attributes = {};

 return self.docs[newtype];
}

function moveViewToNewType(oldtype, newtype){
 self.views[newtype].viewId = self.views[oldtype].viewId;
 angular.copy(self.views[oldtype].attributes, self.views[newtype].attributes);
}

function getView(doctype){
 return self.views[doctype];
}

function setView(doctype, view){
 self.views[doctype] = view;
}

function cleanDoc(doc)	{
 doc.documentId = '';
 doc.attributes = {};
 if (doc.operationId !== undefined) {
  delete(doc.operationId);
}
}

function cleanView(view)	{
 view.attributes = {};
 view.viewId = '';
}

function cleanDocument(doc)	{
 doc.idDocument = '';
 doc.documentStatus = '';
 doc.validations = [];
 doc.views = [];
}

function isStarted(){
 return self.op.operationId !== '';
}

function allDocsSent(){
 var sentGroups = {};
 Object.keys(self.docs).forEach(function(key) {
  var group = DocumentGroups.getDocumentGroup(key);
  if(sentGroups[group] === undefined){
   sentGroups[group] = (self.docs[key].documentId !== '');
 } else {
   sentGroups[group] =  sentGroups[group] || (self.docs[key].documentId !== '');
 }
});
 var out = true;
 Object.keys(sentGroups).forEach(function(group) {
  if(!sentGroups[group]){
   var rule = false;
   if(self.sentExceptionRules[group] !== undefined) {
    Object.keys(self.sentExceptionRules[group]).forEach(function(otherGroup) {
     var doctypelist = self.sentExceptionRules[group][otherGroup];
     doctypelist.forEach(function (type) {
      if(self.docs[type].documentId !== ''){
       rule = true;
     }
   });
   });
  }
  out = rule;
}
});
 return out;
}

function clean(){
 Object.keys(self.docs).forEach(function(key){
  cleanDoc(self.docs[key]);
});
 Object.keys(self.views).forEach(function(key){
  cleanView(self.views[key]);
});
 if (self.opStat !== undefined && self.opStat.documents !== undefined) {
  var len = self.opStat.documents.length;
  for (var i = 0; i < len; i++) {
   var doc = self.opStat.documents[i];
   cleanDocument(doc);
 }
}
self.terminated = false;
self.op.operationId = '';
self.op.operation_user_authorization = '';
}

function getTypeFromId(id){
 return self.docids[id];
}

function setTypeForId(id, doctype){
 if(id !== undefined && doctype !== undefined){
  self.docids[id] = doctype;
}
}

function initOp(){
 self.op={
  operationId:'',
  attributes:{
    'operation_name' : '',
    'operation_number' : '',
    'operation_user_authorization' : ''
  }
};
}

function initOpStat(){
 self.opStat =
 {
   'documentStatus' : '',
   'operationTerminated' : '0',
          //'validations' : [],
          'documents' : []
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

   OperationStore.$inject=['DocumentGroups'];

   angular
   .module('app.service-operationstore')
   .factory('OperationStore', OperationStore);

 })();
