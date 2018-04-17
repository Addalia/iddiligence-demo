(function () {
  'use strict';

  angular.module('app.IdentityDemoCtrl', ['app.service-core', 'app.service-user', 'app.service-operationmanager', 'app.service-fieldsmanager', 'app.service-operationstore', 'ngResource', 'app.document-groups', 'app.doc-entry-configuration', 'app.validation-configuration', 'app.validation-manager', 'app.identity-attribute-manager']);

  function IdentityDemoCtrl($scope, $filter, $location, $translate, $timeout, $interval,
                              NgTableParams,  PageStatus, OperationManager, FieldsManager,
                              OperationStore, DocumentGroups, DocEntryConfiguration, ValidationConfiguration,
                              ValidationManager, IdentityAttributeManager) {

    /*jshint validthis:true */
    var self = this;

    PageStatus.setActualPage(self.name);
    if(PageStatus.isUserLogged() === false) {
      $location.path('/');
    }

    self.identityConfiguration={
      Dni : DocEntryConfiguration.getDocEntryConfiguration('Dni', 'IdentityApp'),
      NIE : DocEntryConfiguration.getDocEntryConfiguration('NIE', 'IdentityApp'),
      Passport : DocEntryConfiguration.getDocEntryConfiguration('Passport', 'IdentityApp')/*,
      Not_Recognized_Identity : DocEntryConfiguration.getDocEntryConfiguration('Not_Recognized_Identity', 'IdentityApp')*/
    };

    self.identityFrontConfiguration={
      Dni_front : DocEntryConfiguration.getDocEntryConfiguration('Dni_front', 'IdentityApp'),
      Nie_front : DocEntryConfiguration.getDocEntryConfiguration('Nie_front', 'IdentityApp')/*,
      Not_Recognized_IdentityFront : DocEntryConfiguration.getDocEntryConfiguration('Not_Recognized_IdentityFront', 'IdentityApp')*/
    };

    self.signatureCardConfiguration={
      SignatureCard : DocEntryConfiguration.getDocEntryConfiguration('SignatureCard', 'IdentityApp')
    };

    self.identityValidation = {
      Dni : ValidationConfiguration.getValidationConfiguration('Dni', 'IdentityApp'),
      NIE : ValidationConfiguration.getValidationConfiguration('NIE', 'IdentityApp'),
      Passport : ValidationConfiguration.getValidationConfiguration('Passport', 'IdentityApp'),
      Not_Recognized_Identity : ValidationConfiguration.getValidationConfiguration('Not_Recognized_Identity', 'IdentityApp')
    };

    self.identityFrontValidation = {
      Dni_front : ValidationConfiguration.getValidationConfiguration('Dni_front', 'IdentityApp'),
      Nie_front : ValidationConfiguration.getValidationConfiguration('Nie_front', 'IdentityApp'),
      Not_Recognized_IdentityFront : ValidationConfiguration.getValidationConfiguration('Not_Recognized_IdentityFront', 'IdentityApp')
    };

    self.signatureCardValidation = {
      SignatureCard : ValidationConfiguration.getValidationConfiguration('SignatureCard', 'IdentityApp')
    };

    self.opposite = { 'Dni' : self.identityFrontConfiguration.Dni_front,
                      'Dni_front' : self.identityConfiguration.Dni,
                      'NIE' : self.identityFrontConfiguration.Nie_front,
                      'Nie_front' : self.identityConfiguration.NIE,
                      'Passport' : '',
                      'Not_Recognized_Identity' : self.identityFrontConfiguration.Not_Recognized_IdentityFront,
                      'Not_Recognized_IdentityFront' : self.identityConfiguration.Not_Recognized_Identity};

    // Initial value for selected document by group
    DocumentGroups.setSelectedType('Identity', self.identityConfiguration.Dni);
    DocumentGroups.setSelectedType('IdentityFront', self.identityFrontConfiguration.Dni_front);
    DocumentGroups.setSelectedType('SignatureCard', self.signatureCardConfiguration.SignatureCard);

    self.sentExceptionRules = { IdentityFront : { Identity : ['Passport'] } };

    // Setup OperationStore with current configuration.
    OperationStore.setup([self.identityConfiguration, self.identityFrontConfiguration, self.signatureCardConfiguration], self.sentExceptionRules);

    self.selectedIdentity = DocumentGroups.getSelectedType('Identity');
    self.selectedIdentityFront = DocumentGroups.getSelectedType('IdentityFront');
    self.selectedSignatureCard = DocumentGroups.getSelectedType('SignatureCard');

    self.validationIdentity ='';
    self.validationIdentityFront = '';
    self.validationSignatureCard = '';

    self.clearIdentityImage = false;
    self.clearIdentityFrontImage = true;
    self.clearSignatureCardImage = false;
    self.disableIdentityImage = false;
    self.disableIdentityFrontImage = true;
    self.disableSignatureCardImage = true;

    self.clearIdentityDocEntry = false;
    self.clearIdentityFrontDocEntry = true;
    self.clearSignatureCardDocEntry = false;
    self.disableIdentityDocEntry = false;
    self.disableIdentityFrontDocEntry = true;
    self.disableSignatureCardDocEntry = true;

    self.mustClearIdentity = true;

    self.file = {};

    self.name = 'identityvalidation';
    self.search = false;
    self.error = '';
    this.modal = false;

    self.terminated = false;

    self.ocr = {
      Identity:'dis',
      IdentityFront:'dis',
      SignatureCard:'dis'
    };

    self.imageUpdated={
      Identity:false,
      IdentityFront:false,
      SignatureCard:false
    };

    self.lastKnownState={
      Identity:undefined,
      IdentityFront:undefined,
      SignatureCard:undefined
    };

    self.image = {
      Identity: null, //'img/PlaceHolderDni-es.jpg',
      IdentityFront: null,
      SignatureCard: null
    };

    self.setServerResponseError = function(){
      self.error = 'SERVER_RESPONSE_ERROR';
      self.modal = true;
    };

    self.onIdentityClick = function(document) {
      if(document.doctype !== undefined) {
        var group = DocumentGroups.getDocumentGroup(document.doctype);
        DocumentGroups.setSelectedType(group, document);

        self.selectedIdentity = DocumentGroups.getSelectedType(group);
        self.clearIdentityImage = true;
        self.ocr.Identity ='dis';
        self.validationIdentity ='';

        var oppositeType = self.opposite[document.doctype];
        if(oppositeType !== ''){
          var oppositeGroup = DocumentGroups.getDocumentGroup(oppositeType.doctype);
          DocumentGroups.setSelectedType(oppositeGroup, oppositeType);
          self.selectedIdentityFront = DocumentGroups.getSelectedType(oppositeGroup);
        } else {
          self.disableIdentityFrontDocEntry = true;
          DocumentGroups.setSelectedType(self.oppositeGroup, {});
          self.selectedIdentityFront = {};
        }
      }
    };

    self.onIdentityFrontClick = function(document) {
      if (document !== undefined) {

          var group = DocumentGroups.getDocumentGroup(document.doctype);
          DocumentGroups.setSelectedType(group, document);

          self.selectedIdentityFront = DocumentGroups.getSelectedType('IdentityFront');
          self.clearIdentityFrontImage = true;
          self.disableIdentityFrontImage = false;
          self.clearIdentityFrontDocEntry = false;
          self.disableIdentityFrontDocEntry = false;
          self.ocr.IdentityFront = 'dis';
          self.imageUpdated.IdentityFront = false;
          self.lastKnownState.IdentityFront = undefined;
          DocumentGroups.cleanSelectedType('IdentityFront');
          self.validationIdentityFront ='';
          ValidationManager.resetValidation(self.identityFrontValidation, group, 'dis');
      }
    };

    self.onSignatureCardClick = function(document) {
      if (document !== undefined) {

          var group = DocumentGroups.getDocumentGroup(document.doctype);
          DocumentGroups.setSelectedType(group, document);

          self.selectedSignatureCard = DocumentGroups.getSelectedType('SignatureCard');
          self.clearSignatureCardImage = true;
          self.disableSignatureCardImage = false;
          self.clearSignatureCardDocEntry = false;
          self.disableSignatureCardDocEntry = false;
          self.ocr.SignatureCard = 'dis';
          self.imageUpdated.SignatureCard = false;
          self.lastKnownState.SignatureCard = undefined;
          DocumentGroups.cleanSelectedType('SignatureCard');
          self.validationSignatureCard ='';
          ValidationManager.resetValidation(self.SignatureCardValidation, group, 'dis');
      }
    };

    self.checkStatusChanges =  function(group, doc){
      if(self.lastKnownState[group]!==doc.documentStatus) {
        self.imageUpdated[group]=false;
      }
      self.lastKnownState[group]=doc.documentStatus;
    };

    self.updateStat = function(){
      OperationManager.getOpStat().then(
        function(opstat){
          self.terminated = (opstat.operationTerminated==='1');
          var docs = opstat.documents;
          var type = '';
          var compareAndFill = function(type, doc){
            if (self.identityValidation[type]) {
              Object.keys(self.identityValidation).forEach(function (key) {
                if(type === key && type === DocumentGroups.getSelectedType('Identity').doctype) {
                    self.validationIdentity = self.identityConfiguration[key];
                    self.checkStatusChanges('Identity',doc);
                    ValidationManager.fillIdentityValidations(doc, self.identityValidation, self.ocr);
                }
              });
            }

            if (self.identityFrontValidation[type]) {
              Object.keys(self.identityFrontValidation).forEach(function (key) {
                if(type === key && type === DocumentGroups.getSelectedType('IdentityFront').doctype) {
                    self.validationIdentityFront = self.identityFrontConfiguration[key];
                    self.checkStatusChanges('IdentityFront',doc);
                    ValidationManager.completeIdentityValidationsWithFront(doc, self.identityValidation);
                }
              });
            }

            if (self.signatureCardValidation[type]) {
              Object.keys(self.signatureCardValidation).forEach(function (key) {
                if(type === key && type === DocumentGroups.getSelectedType('SignatureCard').doctype) {
                    self.validationSignatureCard = self.signatureCardConfiguration[key];
                    self.checkStatusChanges('SignatureCard',doc);
                    ValidationManager.fillSignatureCardValidations(doc, self.signatureCardValidation, self.ocr);
                }
              });
            }
          };

          for (var i = 0; i < docs.length; i++) {
            type = OperationStore.getTypeFromId(docs[i].idDocument);
            if (type !== undefined) {
              compareAndFill(type, docs[i]);
            }
          }
        },
        function(){
          self.setServerResponseError();
        }
      );
    };

    self.updateDocs = function(){
      var type = DocumentGroups.getSelectedType('Identity').doctype;
      OperationManager.getDoc(type).then(
        function(doc){
          ValidationManager.fillIdentityAttributes(doc, self.identityValidation);
        }
      );
    };

    self.updateView = function(doctype){
      OperationManager.getView(doctype).then(
        function(view){
          if( view.attributes.ocr_document_type !== undefined && view.attributes.ocr_document_type !== '') {

            self.updateViewImage(doctype);
            var group =  DocumentGroups.getDocumentGroup(doctype);

            if (view.attributes.ocr_document_type !== doctype) {
              self.ocr[group] = 'ko';
            } else {
                if (doctype === DocumentGroups.getSelectedType(group).doctype){
                  self.ocr[group] = 'ok';
                } else {
                   self.ocr[group] = 'dis';
                }
            }
          }
        },
        function(){
          // view not ready yet
        }
      );
    };

    self.updateViewImage = function(doctype) {
      var group =  DocumentGroups.getDocumentGroup(doctype);

      if(!self.imageUpdated[group]) {
        OperationManager.getViewFile(doctype).then(
          function(view) {
            if (doctype === DocumentGroups.getSelectedType(group).doctype){
                self.image[group] = view;
                self.imageUpdated[group] = true;
            }
          },
          function(){
            self.setServerResponseError();
          }
        );
      }
    };

    self.updateViews = function(){
      self.updateView(DocumentGroups.getSelectedType('Identity').doctype);
      self.updateView(DocumentGroups.getSelectedType('IdentityFront').doctype);
      self.updateView(DocumentGroups.getSelectedType('SignatureCard').doctype);
    };

    $scope.startQuery = function() {
      if ( angular.isDefined(self.queryTicket) ){return;}
      self.queryTicket = $interval(function() {
          self.updateStat();
          self.updateDocs();
          self.updateViews();
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

    self.modalOk =  function(){
      //unnecessary callback
    };

    self.terminate = function () {
      OperationManager.finishOp().then(
        function(){
          $scope.stopQuery();
          self.terminated = true;
          // Deshabilitar los ipsa-image.
          self.disableIdentityImage = true;
          self.disableIdentityFrontImage = true;
          self.disableSignatureCardImage = true;

          self.disableIdentityDocEntry = true;
          self.disableIdentityFrontDocEntry = true;
          self.disableSignatureCardDocEntry = true;
        },
        function(error){
          self.error = error;
          self.modal = true;
        }
      );
    };

    self.resetAll= function(){
      // Limpieza del contenido de las directivas ipsa-image
      self.clearIdentityImage = true;
      self.clearIdentityFrontImage = true;
      self.clearSignatureCardImage = true;

      // Deshabilitar los ipsa-image
      self.disableIdentityImage = false;
      self.disableIdentityFrontImage= true;
      self.disableSignatureCardImage = true;

      // Limpiar input's de todos los documentos
      self.clearIdentityDocEntry = self.mustClearIdentity;
      self.clearIdentityFrontDocEntry = true;
      self.clearSignatureCardDocEntry = true;

      self.disableIdentityDocEntry = false;
      self.disableIdentityFrontDocEntry = true;
      self.disableSignatureCardDocEntry = true;

      // Limpiado de tipos reconocidos por ocr
      self.ocr.Identity = 'dis';
      self.ocr.IdentityFront ='dis';
      self.ocr.SignatureCard = 'dis';

      // Limpiado de flags de actualizacion de imagen
      self.imageUpdated.Identity = false;
      self.imageUpdated.IdentityFront =false;
      self.imageUpdated.SignatureCard = false;

      // Limpiado de flags de cambio de estado
      self.lastKnownState.Identity = undefined;
      self.lastKnownState.IdentityFront = undefined;
      self.lastKnownState.SignatureCard = undefined;

      // Vaciar validaciones
      ValidationConfiguration.clean();

      // Vaciar atributos
      DocumentGroups.cleanSelectedType('Identity');

      // Limpiar operacion
      OperationManager.clean();
	  DocEntryConfiguration.reLoad();
      OperationStore.setup([self.identityConfiguration, self.identityFrontConfiguration, self.signatureCardConfiguration]);

      self.validationIdentity = '';
      self.validationIdentityFront = '';
      self.validationSignatureCard = '';
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
      OperationManager.clean();
      self.resetAll();
    };

    self.newOperation = function () {
      $scope.stopQuery();
      self.terminated = false;
      OperationManager.clean();
      self.resetAll();
    };

    self.initOperation = function () {
      $scope.stopQuery();
      self.terminated = false;
    };

    self.onResetIdentityImage = function(){
        self.imageUpdated.Identity = false;
    };

    self.onResetIdentityFrontImage = function(){
        self.imageUpdated.IdentityFront = false;
    };

    self.onResetSignatureCardImage = function(){
        self.imageUpdated.SignatureCard = false;
    };

    // Eventos notificando la carga de cada imagen por la directiva ipsa-image
    self.uploadIdentityImage = function ($dataURI) {
        self.mustClearIdentity = false;
        self.initOperation();
        self.mustClearIdentity = true;

        self.uploadImage($dataURI, 'Identity', self.identityValidation, self.identityConfiguration);

        self.disableIdentityImage = true;
        self.disableIdentityFrontImage = self.opposite[self.selectedIdentity.doctype] === '';
        self.disableSignatureCardImage = false;
        self.disableIdentityFrontDocEntry = self.opposite[self.selectedIdentity.doctype] === '';
        self.disableSignatureCardDocEntry = false;
        self.disableIdentityDocEntry = true;
        self.ocr.Identity = 'pending';
        self.imageUpdated.Identity = false;
        self.lastKnownState.Identity = undefined;

        $scope.startQuery();
    };

    self.uploadIdentityFrontImage = function ($dataURI) {
      IdentityAttributeManager.transferIdentityAttributes(self.selectedIdentity, self.selectedIdentityFront);
      self.uploadImage($dataURI, 'IdentityFront', self.identityFrontValidation, self.identityFrontConfiguration);
      self.ocr.IdentityFront = 'pending';
      self.imageUpdated.IdentityFront = false;
      self.lastKnownState.IdentityFront = undefined;
    };

    self.uploadSignatureCardImage = function ($dataURI) {
      self.uploadImage($dataURI, 'SignatureCard', self.signatureCardValidation, self.signatureCardConfiguration);
      self.ocr.SignatureCard = 'pending';
      self.imageUpdated.SignatureCard = false;
      self.lastKnownState.SignatureCard = undefined;
    };

    self.uploadImage = function ($dataURI, group, validation, configuration){
      var doctype = DocumentGroups.getSelectedType(group).doctype;
      self.file = $dataURI;
      FieldsManager.setAttributesValues(configuration, doctype);
      OperationManager.sendViewFile(doctype, self.file);

      ValidationManager.resetValidation(validation, group, 'pending');
    };

    self.isIdentityFrontImageDisabled = function() {
      return (self.disableIdentityFrontImage);
    };

    self.isSignatureCardImageDisabled = function() {
      return (self.disableSignatureCardImage);
    };

    self.isTerminateButtonDisabled = function() {
      return self.terminated===true || (!OperationManager.isStarted());
    };

    self.isCancelButtonDisabled = function() {
      return (!OperationManager.isStarted());
    };

    self.resetAll();

  }
  IdentityDemoCtrl.$inject=['$scope', '$filter', '$location', '$translate','$timeout', '$interval',
                              'NgTableParams', 'PageStatus', 'OperationManager','FieldsManager',
                              'OperationStore', 'DocumentGroups', 'DocEntryConfiguration', 'ValidationConfiguration',
                              'ValidationManager', 'IdentityAttributeManager'];
  angular
  .module('app.IdentityDemoCtrl')
  .controller('IdentityDemoCtrl', IdentityDemoCtrl);

})();
