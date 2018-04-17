(function () {
	'use strict';

	angular.module('app.service-operationmanager', ['app.service-operation', 'app.service-core', 'app.service-document', 'app.service-view', 'app.service-pvi', 'app.service-operationstore', 'app.document-type-translator']);

	function OperationManager($q, Operation, Document, View, PVI, PageStatus, OperationStore, DoctypeTranslator){
		/*jshint validthis:true */
		var self = this;

		self.manager = {
				// Operations
				initOp:initOp,
				clean:clean,
				getOpStat:getOpStat,
        setOpStat:setOpStat,
        checkPVIReady:checkPVIReady,
        sendToPVI:sendToPVI,
        finishOp:finishOp,
        deleteOp:deleteOp,
        updateAuthorization:updateAuthorization,
        isTerminated:isTerminated,
        isStarted:isStarted,
        setTerminated:setTerminated,
				// Document
				getDoc:getDoc,
				setAttributte: setAttributte,
				// View
				getView:getView,
				sendViewFile:sendViewFile,
				getViewFile:getViewFile
			};

      function clean(){
       OperationStore.clean();
     }

     function updateAuthorization (fields){
      var deferred = $q.defer();
      var authorizationEmpty = false;
      if(OperationStore.getOp().attributes.operation_user_authorization === '') {
        authorizationEmpty = true;
      }
      for (var f = 0; f < fields.length; f++) {
        if (fields[f].id === 'authorization') {
          if (fields[f].value !== '') {
            OperationStore.setOpProps(PageStatus.getAppName() + '-' + PageStatus.getUserName(),
              getNow(), '1');
          } else {
            OperationStore.setOpProps(PageStatus.getAppName() + '-' + PageStatus.getUserName(),
              getNow(), '0');
          }
          break;
        }
      }
      if (authorizationEmpty && OperationStore.getOp().operationId !== '') {
        Operation.update({idop:OperationStore.getOp().operationId}, OperationStore.getOp())
        .$promise.then(
          function (operation) {
            OperationStore.setOp(operation);
            deferred.resolve();
          },
          function(error){
            deferred.reject(error);
          });
      }
      return deferred.promise;
    }

    function updateViewIdFromDocStatus(doc){
     if(doc.views.length>1){
      var v = doc.views[1];
      View.query({idop:OperationStore.getOp().operationId, iddoc:doc.idDocument, idview:v.idView})
      .$promise.then(
        function(view){
         if(view.attributes.page === '1'){
          OperationStore.setView(OperationStore.getTypeFromId(doc.idDocument),view);
        }
      },
      function(){
      });
    }
  }

  function processStatsFromBack(stats){
    OperationStore.getOpStat().documentStatus = stats.documentStatus;
    OperationStore.getOpStat().operationTerminated = stats.operationTerminated;
    var len = stats.documents.length;
    for (var i = 0; i < len; i++) {
      var doc = stats.documents[i];
      updateViewIdFromDocStatus(doc);
      OperationStore.getOpStat().documents[i] = doc;
    }
  }

  function getOpStat(){
    var deferred = $q.defer();
    if(!OperationStore.isStarted()){
      deferred.resolve(OperationStore.getOpStat());
    }
    Operation.status({idop:OperationStore.getOp().operationId})
    .$promise.then(
      function (stats) {
        processStatsFromBack(stats);
        deferred.resolve(OperationStore.getOpStat());
      },
      function (error) {
        deferred.reject(error);
      });
    return deferred.promise;
  }

  function setOpStat(){
    var deferred = $q.defer();
    if(!OperationStore.isStarted()){
      deferred.reject('OPERATION_NOT_STARTED');
    }
    Operation.updateStatus({idop:OperationStore.getOp().operationId}, OperationStore.getOpStat()/*buildStatsForBack()*/)
    .$promise.then(
      function (stats) {
        processStatsFromBack(stats);
        deferred.resolve(OperationStore.getOpStat());
      },
      function (error) {
        deferred.reject(error);
      });
    return deferred.promise;
  }

  function checkPVIReady() {
    var opStat = OperationStore.getOpStat();
    var pviReady = true;
    var thereIsValidations = false;
    Object.keys(opStat.documents).forEach(function(dockey){
      Object.keys(opStat.documents[dockey].validations).forEach(function(valkey){
        thereIsValidations = true;
        pviReady =  pviReady && (opStat.documents[dockey].validations[valkey].status === 'OK');
      });
    });
    return pviReady && thereIsValidations;
  }

  function sendToPVI() {
    var deferred = $q.defer();
    if(!checkPVIReady()) {
      deferred.reject('NO_PVI_READY');
    }
    PVI.send({idop:OperationStore.getOp().operationId}, '')
    .$promise.then(function(){
      deferred.resolve();
    },function(error){
      deferred.reject(error);
      //deferred.reject('PVI_FAILED');
    });
    return deferred.promise;
  }

  function finishOp(){
   var deferred = $q.defer();
   if(!OperationStore.isStarted()){
    deferred.reject('OPERATION_NOT_STARTED');
  } else if(!OperationStore.allDocsSent()){
    deferred.reject('MISSING_DOCUMENTS');
  } else {
    Operation.terminate({idop: OperationStore.getOp().operationId}, {})
    .$promise.then(
     function () {
      setTerminated(true);
      deferred.resolve(isTerminated());
    },
    function () {
      setTerminated(false);
      deferred.reject('SERVER_RESPONSE_ERROR');
    });
  }
  return deferred.promise;
}

function isTerminated(){
 return OperationStore.isTerminated();
}

function isStarted(){
 return OperationStore.isStarted();
}

function setTerminated(terminated){
 OperationStore.setTerminated(terminated);
}

function deleteOp(){
 var deferred = $q.defer();
 if(OperationStore.isStarted()){
  Operation.remove({idop:OperationStore.getOp().operationId})
  .$promise.then(
   function(){
    deferred.resolve();
  },
  function(error){
    deferred.reject('OPERATION_DELETE_FAIL :' + error);
  }
  );
} else {
  deferred.resolve();
}
return deferred.promise;
}

function sendDoc(doctype, callback){
 var doc;
 var deferred = $q.defer();
 ensureOpExists(function(){
  if(OperationStore.hasDoc(doctype)) {
   doc = OperationStore.getDoc(doctype);
   if(doc.documentId===''){
    Document.create({idop:OperationStore.getOp().operationId}, preprocessDoc(doc))
    .$promise.then(
     function (doc) {
      OperationStore.setDoc(doctype,doc);
      OperationStore.setTypeForId(doc.documentId, doctype);
      if(callback !== undefined){callback();}
      deferred.resolve(OperationStore.getDoc(doctype));
    },
    function (error) {
      deferred.reject(error);
    });
  } else {
						//TODO : Mal. aqui faltan cosas. Esto no puede funcionar y parece que no se esta usando.
            Document.update({idop:OperationStore.getOp().operationId},doc)
            .$promise.then(
             function (doc) {
              OperationStore.setDoc(doctype,doc);
              OperationStore.setTypeForId(doc.documentId, doctype);
              if(callback !== undefined){callback();}
              deferred.resolve(OperationStore.getDoc(doctype));
            },
            function (error) {
              PageStatus.goLoginIfUnauthorized(error.status);
              deferred.reject(error);
            });
          }
        } else {
         deferred.reject('UNRECOGNIZED_DOCUMENT_TYPE');
       }});
 return deferred.promise;
}

function getDoc(doctype){
 var deferred = $q.defer();
 var doc;
 if(OperationStore.hasDoc(doctype)) {
  doc = OperationStore.getDoc(doctype);
  Document.query({idop:OperationStore.getOp().operationId, iddoc:doc.documentId})
  .$promise.then(
   function (doc) {
    OperationStore.setDoc(doctype,doc);
    OperationStore.setTypeForId(doc.documentId, doctype);
    deferred.resolve(OperationStore.getDoc(doctype));
  },
  function (error) {
    deferred.reject(error);
  });
} else {
  deferred.reject('UNRECOGNIZED_DOCUMENT_TYPE');
}
return deferred.promise;
}

function sendView(doctype, callback){
 if(OperationStore.hasDoc(doctype)) {
  ensureDocExists(doctype, function(){
   var v = OperationStore.getView(doctype);
   var doc = OperationStore.getDoc(doctype);
   if(v.viewId ==='' || v.viewId === undefined){
    View.create({idop:OperationStore.getOp().operationId, iddoc:doc.documentId},v)
    .$promise.then(
     function(view){
      OperationStore.setView(doctype,view);
      callback();
    },
    function(error){
      PageStatus.goLoginIfUnauthorized(error.status);
    });
  } else {
    View.update({idop:OperationStore.getOp().operationId, iddoc:doc.documentId},v)
    .$promise.then(
     function(view){
      OperationStore.setView(doctype,view);
      callback();
    },
    function(error){
								//console.log('view update error');
								PageStatus.goLoginIfUnauthorized(error.status);
							});

  }});
} else {
				//deferred.reject('unrecognized document type');
			}
			return OperationStore.getView(doctype);
		}

		function getView(doctype){
			var deferred = $q.defer();
			if(OperationStore.hasDoc(doctype)) {
				var v = OperationStore.getView(doctype);
				var doc = OperationStore.getDoc(doctype);
				if(v.viewId !=='' && v.viewId !== undefined){
					View.query({idop:OperationStore.getOp().operationId, iddoc:doc.documentId, idview:v.viewId})
					.$promise.then(
						function(view){
							OperationStore.setView(doctype,view);
							deferred.resolve(OperationStore.getView(doctype));
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

		function sendViewFile(doctype, file){
			var deferred = $q.defer();
			if(OperationStore.hasDoc(doctype)) {
				ensureViewExists(doctype, function(){
					var v = OperationStore.getView(doctype);
					var doc = OperationStore.getDoc(doctype);
					View.upload({idop:OperationStore.getOp().operationId, iddoc:doc.documentId, idview:v.viewId}, file)
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

		function getViewFile(doctype) {
			var deferred = $q.defer();
			if(OperationStore.hasDoc(doctype)) {
				var v = OperationStore.getView(doctype);
				var doc = OperationStore.getDoc(doctype);
				if(v.viewId !=='' && v.viewId !== undefined){
					View.download({idop:OperationStore.getOp().operationId, iddoc:doc.documentId, idview:v.viewId})
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
			if(OperationStore.hasDoc(doctype)) {
				OperationStore.getDoc(doctype).attributes[attr] = value;
        if(attr === 'operation_user_authorization' && OperationStore.getOp().operationId !== '') {
          OperationStore.setOpProps(PageStatus.getAppName() + '-' + PageStatus.getUserName(), getNow(),
            OperationStore.getDoc(doctype).attributes.operation_user_authorization);
          Operation.update({idop:OperationStore.getOp().operationId}, OperationStore.getOp())
          .$promise.then(
            function (operation) {
              OperationStore.setOp(operation);
              deferred.resolve();
            },
            function(error){
              deferred.reject(error);
            });
        }
        deferred.resolve();
      } else {
        deferred.reject('doctype does not exists');
      }
      return deferred.promise;
    }

    function getNow(){
     Number.prototype.padLeft = function(base,chr){
      var  len = (String(base || 10).length - String(this).length)+1;
      return len > 0? new Array(len).join(chr || '0')+this : this;
    };

    var d = new Date();
    var dformat = [ d.getFullYear().padLeft(),
    (d.getMonth()+1).padLeft(),
    d.getDate().padLeft(),
    d.getHours().padLeft(),
    d.getMinutes().padLeft(),
    d.getSeconds().padLeft()].join('');
    return dformat;
  }

  function ensureViewExists(doctype, callback){
   var v = OperationStore.getView(doctype);
   if(v.viewId === '' || v.viewId === undefined){
    sendView(doctype, callback);
  } else {
				//if(callback !== undefined){callback();}
				OperationStore.resetDoc(doctype);
				sendView(doctype, callback);
			}
		}

		function ensureDocExists(doctype, callback){
			var doc = OperationStore.getDoc(doctype);
			if(doc.documentId === ''){
				sendDoc(doctype,callback);
			} else {
				if(callback !== undefined){callback();}
			}
		}

		function ensureOpExists(callback){
			if(OperationStore.getOp().operationId === ''){
				initOp(callback);
			} else {
				if(callback !== undefined){callback();}
			}
		}

		function preprocessDoc(doc){
			if(DoctypeTranslator.hasTranslation(doc.type)){
       var outDoc = angular.copy(doc);
       outDoc.type = DoctypeTranslator.getRealDoctype(doc.type);
       outDoc.attributes = preprocessAttributes(doc.attributes);
       return outDoc;
     }
     return doc;
   }

   function preprocessAttributes(attributes){
     var jsonString = JSON.stringify(attributes);
     attributes = {};
     attributes.not_recognized_attributes_values = jsonString;
     return attributes;
   }

   function initOp(callback){
     OperationStore.setOpProps(PageStatus.getAppName() + '-' + PageStatus.getUserName(), getNow(), '');
     Operation.create(OperationStore.getOp())
     .$promise.then(
      function (operation) {
       OperationStore.setOp(operation);
       if(callback !== undefined){callback();}
     },
     function (error) {
       PageStatus.goLoginIfUnauthorized(error.status);
     });
   }

   return self.manager;
 }

 OperationManager.$inject=['$q', 'Operation', 'Document', 'View', 'PVI', 'PageStatus', 'OperationStore', 'DoctypeTranslator'];

 angular
 .module('app.service-operationmanager')
 .factory('OperationManager', OperationManager);

})();
