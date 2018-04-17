(function () {
  'use strict';

  angular.module('app.FaceRecognitionDemoCtrl', ['app.service-core', 'app.service-user',
                  'app.service-operationmanager', 'app.service-patternmanager', 'app.service-fieldsmanager',
                  'app.service-operationstore', 'app.service-patternstore','ngResource', 'app.document-groups', 'app.doc-entry-configuration', 'app.validation-configuration', 'app.validation-manager', 'app.pattern-attribute-manager']);

  function FaceRecognitionDemoCtrl($scope, $filter, $location, $translate, $timeout, $interval,
                              NgTableParams,  PageStatus, OperationManager, PatternManager, FieldsManager,
                              OperationStore, PatternStore, DocumentGroups, DocEntryConfiguration, ValidationConfiguration,
                              ValidationManager) {

    /*jshint validthis:true */
    var self = this;

    PageStatus.setActualPage(self.name);
    if(PageStatus.isUserLogged() === false) {
      $location.path('/');
    }

    self.referencePatternConfiguration={
      Pattern : DocEntryConfiguration.getDocEntryConfiguration('Pattern', 'FaceRecognitionApp'),
    };

    self.identityMediaConfiguration={
      IdentityMedia : DocEntryConfiguration.getDocEntryConfiguration('IdentityMedia', 'FaceRecognitionApp')
    };

    self.mediaConfiguration={
      Media : DocEntryConfiguration.getDocEntryConfiguration('Media', 'FaceRecognitionApp')
    };

    self.referencePatternValidation = {
      Pattern : ValidationConfiguration.getValidationConfiguration('Pattern', 'FaceRecognitionApp')
    };

    self.identityMediaValidation = {
      IdentityMedia : ValidationConfiguration.getValidationConfiguration('IdentityMedia', 'FaceRecognitionApp')
    };

    DocumentGroups.setSelectedType('Pattern', self.referencePatternConfiguration.Pattern);
    DocumentGroups.setSelectedType('IdentityMedia', self.identityMediaConfiguration.IdentityMedia);

    PatternStore.setup([self.referencePatternConfiguration, self.identityMediaConfiguration], self.sentExceptionRules);

    self.selectedReferencePattern = DocumentGroups.getSelectedType('Pattern');
    self.selectedIdentityMedia = DocumentGroups.getSelectedType('IdentityMedia');

    self.validationReferencePattern ='';
    self.validationIdentityMedia = '';

    self.clearReferencePatternImage = false;
    self.clearIdentityMediaImage = false;
    self.disableReferencePatternImage = false;
    self.disableIdentityMediaImage = true;

    self.clearReferencePatternDocEntry = false;
    self.clearIdentityMediaDocEntry = false;
    self.disableReferencePatternDocEntry = false;
    self.disableIdentityMediaDocEntry = true;

    self.mustClearReferencePattern = true;

    self.file = {};

    self.name = 'facerecognitionvalidation';
    self.search = false;
    self.error = '';
    this.modal = false;

    self.terminated = false;

    self.ocr = {
      ReferencePattern:'dis',
      IdentityMedia:'dis'
    };

    self.imageUpdated={
      ReferencePattern:false,
      IdentityeMedia:false
    };

    self.lastKnownState={
      ReferencePattern:undefined,
      IdentityMedia:undefined
    };

    self.image = {
      ReferencePattern: null,
      IdentityMedia: null
    };

    self.setServerResponseError = function(){
      self.error = 'SERVER_RESPONSE_ERROR';
      self.modal = true;
    };

    self.onReferencePatternClick = function(document) {
      if(document.doctype !== undefined) {
        var group = DocumentGroups.getDocumentGroup(document.doctype);
        DocumentGroups.setSelectedType(group, document);

        self.selectedReferencePattern = DocumentGroups.getSelectedType(group);
        self.clearReferencePatternImage = true;
        self.ocr.ReferencePattern ='dis';
        self.validationReferencePattern ='';

        self.disableIdentityMediaImage = true;
        self.selectedIdentityMedia = DocumentGroups.getSelectedType('IdentityMedia');

      }
    };

    self.onIdentityMediaClick = function(document) {
      if(document !== undefined) {
        var group = DocumentGroups.getDocumentGroup(document.doctype);
        DocumentGroups.setSelectedType(group, document);

        self.selectedIdentityMedia = DocumentGroups.getSelectedType('IdentityMedia');
        self.clearIdentityMediaImage = true;
        self.disableIdentityMediaImage = false;
        self.clearIdentityMediaDocEntry = false;
        self.disableIdentityMediaDocEntry = false;
        self.ocr.IdentityMedia = 'dis';
        self.imageUpdated.IdentityMedia = false;
        self.lastKnownState.IdentityMedia = undefined;
        DocumentGroups.cleanSelectedType('IdentityMedia');
        self.validationIdentityMedia ='';
        ValidationManager.resetValidation(self.IdentityMediaValidation, group, 'dis');
      }
    };

    self.checkStatusChanges =  function(group, doc){
      if(self.lastKnownState[group]!==doc.status) {
        self.imageUpdated[group]=false;
      }
      self.lastKnownState[group]=doc.status;
    };

    self.updateStat = function(){
      PatternManager.getMediaStat().then(
        function(mediastat){
          var media = mediastat;
          if (media.status === 'OK') {
            self.ocr.ReferencePattern = 'ok';
            self.referencePatternValidation.Pattern.status = 'ok';
            self.disableIdentityMediaDocEntry = false;
            self.updateIdentityMediaAttributes('ok');
          } else if  (media.status === 'KO'){
            self.ocr.ReferencePattern = 'ko';
            self.referencePatternValidation.Pattern.status = 'ko';
            self.disableIdentityMediaDocEntry = true;
            self.updateIdentityMediaAttributes('ko');
          }
        },
        function(){
          self.setServerResponseError();
        }
      );
    };

    self.updatePattern = function(){
      var type = DocumentGroups.getSelectedType('Pattern').doctype;
      PatternManager.getPattern(type).then(
        function(doc){
          ValidationManager.fillPatternAttributes(doc, self.referencePatternValidation);
        }
      );
    };

    self.updateIdentityMediaAttributes = function(stat) {
      var value;
      if (stat === 'ok') {
        value = PatternStore.getPattern().patternId;
      } else {
        value = '';
      }
      FieldsManager.setAttributeValue(self.identityMediaConfiguration.IdentityMedia, 'identity_media_pattern_id', value);
    };

    self.updateIdentityMedia = function(){
      if(OperationManager.isStarted()) {
        OperationManager.getOpStat().then(
          function(opstat){
            self.terminated = (opstat.operationTerminated==='1');
            var docs = opstat.documents;
            var type = '';
            var compareAndFill = function(type, doc){
              if (self.identityMediaValidation[type]) {
                Object.keys(self.identityMediaValidation).forEach(function (key) {
                  if(type === key && type === DocumentGroups.getSelectedType('IdentityMedia').doctype) {
                      if (doc.documentStatus === 'pending') {
                        self.disableIdentityMediaDocEntry = true;
                      } else {
                        self.disableIdentityMediaDocEntry = false;
                      }
                      self.validationIdentityMedia = self.identityMediaConfiguration[key];
                      self.checkStatusChanges('IdentityMedia',doc);
                      ValidationManager.fillIdentityMediaValidations(doc, self.identityMediaValidation);
                  }
                });
              }
            };

            var documentId = OperationStore.getDoc('IdentityMedia').documentId;
            for (var i = 0; i < docs.length; i++) {
              type = OperationStore.getTypeFromId(docs[i].idDocument);

              if (type !== undefined && documentId === docs[i].idDocument) {
                compareAndFill(type, docs[i]);
                self.ocr.IdentityMedia = docs[i].documentStatus.toLowerCase();
              }
            }

            if (self.ocr.IdentityMedia === 'ok') {
               self.disableIdentityMediaDocEntry = false;
            } else if (self.ocr.IdentityMedia === 'ko') {
               self.disableIdentityMediaDocEntry = true;
            }

            var doctype = DocumentGroups.getSelectedType('IdentityMedia').doctype;
            OperationManager.getDoc(doctype).then(
              function(doc){
                ValidationManager.fillIdentityMediaAttributes(doc, self.identityMediaValidation);
              }
            );
          },
          function(){
            self.setServerResponseError();
          }
        );
      }
    };

    $scope.startQuery = function() {
      if ( angular.isDefined(self.queryTicket) ){return;}
      self.queryTicket = $interval(function() {
          self.updateStat();
          self.updatePattern();
          self.updateIdentityMedia();
      }, 5000);
    };

    $scope.stopQuery = function() {
      if (angular.isDefined(self.queryTicket)) {
        $interval.cancel(self.queryTicket);
        self.queryTicket = undefined;
      }
    };

    $scope.$on('$destroy', function() {
      $scope.stopQuery();
    });

    self.terminate = function () {
      OperationManager.finishOp().then(
        function(){
          $scope.stopQuery();
          self.terminated = true;
          // Deshabilitar los ipsa-image.
          self.disableReferencePatternImage = true;
          self.disableIdentityMediaImage = true;

          self.disableReferencePatternDocEntry = true;
          self.disableIdentityMediaDocEntry = true;
        },
        function(error){
          self.error = error;
          self.modal = true;
        }
      );
    };

    self.resetAll= function(){
      // Limpieza del contenido de las directivas ipsa-image
      self.clearReferencePatternImage = true;
      self.clearIdentityMediaImage = true;

      // Deshabilitar los ipsa-image
      self.disableReferencePatternImage = false;
      self.disableIdentityMediaImage= true;

      // Limpiar input's de todos los documentos
      self.clearReferencePatternDocEntry = self.mustClearReferencePattern;
      self.clearIdentityMediaDocEntry = true;

      self.disableReferencePatternDocEntry = false;
      self.disableIdentityMediaDocEntry = true;

      // Limpiado de tipos reconocidos por ocr
      self.ocr.ReferencePattern = 'dis';
      self.ocr.IdentityMedia ='dis';

      // Limpiado de flags de actualizacion de imagen
      self.imageUpdated.ReferencePattern = false;
      self.imageUpdated.IdentityMedia =false;

      // Limpiado de flags de cambio de estado
      self.lastKnownState.ReferencePattern = undefined;
      self.lastKnownState.IdentityMedia = undefined;

      // Vaciar validaciones
      ValidationConfiguration.clean();

      // Vaciar atributos
      DocumentGroups.cleanSelectedType('Pattern');

      // Limpiar operacion
      PatternManager.clean();
      DocEntryConfiguration.reLoad();
      PatternStore.setup([self.referencePatternConfiguration, self.mediaConfiguration]);
      OperationStore.setup([self.identityMediaConfiguration]);

      self.validationReferencePattern = '';
      self.validationIdentityMedia = '';
    };

    self.cancel = function () {
      $scope.stopQuery();
      self.terminated = false;
      OperationManager.deleteOp().then(
        function(){
        },
        function(){
          self.setServerResponseError();
        }
      );
      PatternManager.deletePat().then(
        function(){
        },
        function(){
          self.setServerResponseError();
        }
      );
      OperationManager.clean();
      PatternManager.clean();
      self.resetAll();
    };

    self.newOperation = function () {
      $scope.stopQuery();
      self.terminated = false;
      self.isCancelButtonDisabled();
      OperationManager.clean();
      PatternManager.clean();
      self.resetAll();
    };

    self.initOperation = function () {
      //$scope.stopQuery();
      self.terminated = false;
    };

    self.onResetReferencePatternImage = function(){
        self.imageUpdated.ReferencePattern = false;
    };

    self.onResetIdentityMediaImage = function(){
        self.imageUpdated.ReferencePattern = false;
    };

    self.uploadReferencePatternImage = function ($dataURI) {

      self.uploadImage($dataURI, 'Pattern', self.referencePatternValidation, self.referencePatternConfiguration, self.mediaConfiguration);

      self.disableReferencePatternImage = true;
      self.disableIdentityMediaImage = true;
      self.disableIdentityMediaDocEntry = true;
      self.disableReferencePatternDocEntry = true;
      self.ocr.ReferencePattern = 'pending';
      self.imageUpdated.ReferencePattern = false;
      self.lastKnownState.ReferencePattern = undefined;

      $scope.startQuery();
    };

    self.uploadIdentityMediaImage = function ($dataURI) {
      self.initOperation();
      self.uploadImage($dataURI, 'IdentityMedia', self.identityMediaValidation, self.identityMediaConfiguration);
      self.ocr.IdentityMedia = 'pending';
      self.imageUpdated.IdentityMedia = false;
      self.lastKnownState.IdentityMedia = undefined;

    };

    self.uploadImage = function ($dataURI, group, validation, configuration){
      var doctype = DocumentGroups.getSelectedType(group).doctype;
      self.file = $dataURI;
      FieldsManager.setAttributesValues(configuration, doctype);
      if(doctype === 'Pattern') {
        PatternManager.sendPatternFile(doctype, self.file);
      } else {
        OperationManager.sendViewFile(doctype, self.file);
      }
      ValidationManager.resetValidation(validation, group, 'pending');
    };

    self.isIdentityMediaImageDisabled = function() {
      return (self.disableIdentityMediaImage);
    };

    self.isTerminateButtonDisabled = function() {
      return self.terminated===true || (!OperationManager.isStarted());
    };

    self.isCancelButtonDisabled = function() {
      return (self.referencePatternValidation.Pattern.status === 'dis' ||
        self.referencePatternValidation.Pattern.status === 'pending');
    };

    self.resetAll();

  }
  FaceRecognitionDemoCtrl.$inject=['$scope', '$filter', '$location', '$translate','$timeout', '$interval',
                              'NgTableParams', 'PageStatus', 'OperationManager', 'PatternManager',
                               'FieldsManager', 'OperationStore','PatternStore', 'DocumentGroups', 'DocEntryConfiguration', 'ValidationConfiguration',
                              'ValidationManager'];
  angular
  .module('app.FaceRecognitionDemoCtrl')
  .controller('FaceRecognitionDemoCtrl', FaceRecognitionDemoCtrl);

})();
