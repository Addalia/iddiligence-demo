(function () {
  'use strict';

  angular.module('app.controllers', ['app.service-core', 'app.service-user', 'app.service-operationmanager', 'app.service-fieldsmanager', 'app.service-operationstore', 'app.document-groups', 'app.doc-entry-configuration', 'app.validation-configuration', 'app.validation-manager']);

  function validationDemoCtrl($scope, $filter, $location, $translate, $timeout, $interval,
                              NgTableParams,  PageStatus, OperationManager, FieldsManager, OperationStore, DocumentGroups, DocEntryConfiguration, ValidationConfiguration, ValidationManager) {

    /*jshint validthis:true */
    var self = this;

    PageStatus.setActualPage(self.name);
    if(PageStatus.isUserLogged() === false) {
      $location.path('/');
    }

    self.identityConfiguration = {
      Dni : DocEntryConfiguration.getDocEntryConfiguration('Dni', 'DemoApp'),
      NIE : DocEntryConfiguration.getDocEntryConfiguration('NIE', 'DemoApp'),
      Passport : DocEntryConfiguration.getDocEntryConfiguration('Passport', 'DemoApp'),
      Not_Recognized_Identity : DocEntryConfiguration.getDocEntryConfiguration('Not_Recognized_Identity', 'DemoApp')
    };

    self.incomeConfiguration = {
      Paysheet : DocEntryConfiguration.getDocEntryConfiguration('Paysheet', 'DemoApp'),
      IRPF : DocEntryConfiguration.getDocEntryConfiguration('IRPF', 'DemoApp'),
      Not_Recognized_Income : DocEntryConfiguration.getDocEntryConfiguration('Not_Recognized_Income', 'DemoApp')
    };

    self.receiptConfiguration = {
      Bank_Receipt : DocEntryConfiguration.getDocEntryConfiguration('Bank_Receipt', 'DemoApp'),
      Receipt : DocEntryConfiguration.getDocEntryConfiguration('Receipt', 'DemoApp'),
      Not_Recognized_Receipt : DocEntryConfiguration.getDocEntryConfiguration('Not_Recognized_Receipt', 'DemoApp')
    };

    self.identityValidation = {
      Dni : ValidationConfiguration.getValidationConfiguration('Dni','DemoApp'),
      NIE : ValidationConfiguration.getValidationConfiguration('NIE','DemoApp'),
      Passport : ValidationConfiguration.getValidationConfiguration('Passport','DemoApp'),
      Not_Recognized_Identity : ValidationConfiguration.getValidationConfiguration('Not_Recognized_Identity','DemoApp')
    };

    self.incomeValidation = {
      Paysheet : ValidationConfiguration.getValidationConfiguration('Paysheet','DemoApp'),
      IRPF : ValidationConfiguration.getValidationConfiguration('IRPF','DemoApp'),
      Not_Recognized_Income : ValidationConfiguration.getValidationConfiguration('Not_Recognized_Income','DemoApp')
    };

    self.receiptValidation = {
      Bank_Receipt : ValidationConfiguration.getValidationConfiguration('Bank_Receipt','DemoApp'),
      Receipt : ValidationConfiguration.getValidationConfiguration('Receipt','DemoApp'),
      Not_Recognized_Receipt : ValidationConfiguration.getValidationConfiguration('Not_Recognized_Receipt','DemoApp')
    };

    // Initial value for selected document by group
    DocumentGroups.setSelectedType('Identity', self.identityConfiguration.Dni);
    DocumentGroups.setSelectedType('Receipt', self.receiptConfiguration.Bank_Receipt);
    DocumentGroups.setSelectedType('Income', self.incomeConfiguration.Paysheet);

    // Setup OperationStore with current configuration.
    OperationStore.setup([self.identityConfiguration, self.incomeConfiguration, self.receiptConfiguration]);

    self.selectedIdentity = DocumentGroups.getSelectedType('Identity');
    self.selectedIncome = DocumentGroups.getSelectedType('Income');
    self.selectedReceipt = DocumentGroups.getSelectedType('Receipt');

    self.validationIdentity ='';
    self.validationIncome = '';
    self.validationReceipt = '';

    self.clearIdentityImage = false;
    self.clearIncomeImage = false;
    self.clearReceiptImage = false;
    self.disableIdentityImage = false;
    self.disableIncomeImage = true;
    self.disableReceiptImage = true;

    self.clearIdentityDocEntry = false;
    self.clearIncomeDocEntry = false;
    self.clearReceiptDocEntry = false;
    self.disableIdentityDocEntry = false;
    self.disableIncomeDocEntry = true;
    self.disableReceiptDocEntry = true;

    self.mustClearIdentity = true;

    self.file = {};

    self.name = 'validation';
    self.search = false;
    self.error = '';
    this.modal = false;

    self.terminated = false;

    self.ocr = {
      Identity:'dis',
      Income:'dis',
      Receipt:'dis'
    };

    self.imageUpdated={
      Identity:false,
      Income:false,
      Receipt:false
    };

    self.lastKnownState={
      Identity:undefined,
      Income:undefined,
      Receipt:undefined
    };

    // Show images in ipsa-image directives
    self.image = {
      Identity: null,   //'img/PlaceHolderDni-es.jpg',
      Income: null,     //'img/PlaceHolderPaysheet-es.jpg',
      Receipt: null     //'img/PlaceHolderBankReceipt-es.jpg',
    };

    self.setServerResponseError = function(){
      self.error = 'SERVER_RESPONSE_ERROR';
      self.modal = true;
    };

    self.onIdentityClick = function(doc) {
      if(doc.doctype !== undefined) {

        var group = DocumentGroups.getDocumentGroup(doc.doctype);
        DocumentGroups.setSelectedType(group, doc);

        self.selectedIdentity = DocumentGroups.getSelectedType('Identity');
        self.clearIdentityImage = true;
        self.lastKnownState.Identity = undefined;
        self.ocr.Identity ='dis';
        self.validationIdentity ='';
        self.imageUpdated.Identity = false;
      }

    };

    self.onReceiptClick = function(doc) {
      if (doc !== undefined) {

        var group = DocumentGroups.getDocumentGroup(doc.doctype);
        DocumentGroups.setSelectedType(group, doc);

        self.selectedReceipt = DocumentGroups.getSelectedType('Receipt');
        self.clearReceiptImage = true;
        self.disableReceiptImage = false;
        self.clearReceiptDocEntry = false;
        self.disableReceiptDocEntry = false;
        self.ocr.Receipt = 'dis';
        self.imageUpdated.Receipt = false;
        self.lastKnownState.Receipt = undefined;
        DocumentGroups.cleanSelectedType('Receipt');
        self.validationReceipt ='';
        ValidationManager.resetValidation(self.receiptValidation, group, 'dis');
        self.imageUpdated.Receipt = false;
      }
    };

    self.onIncomeClick = function(doc) {
      if (doc !== undefined) {

        var group = DocumentGroups.getDocumentGroup(doc.doctype);
        DocumentGroups.setSelectedType(group, doc);

        self.selectedIncome = DocumentGroups.getSelectedType('Income');
        self.clearIncomeImage = true;
        self.disableIncomeImage = false;
        self.clearIncomeDocEntry = false;
        self.disableIncomeDocEntry = false;
        self.ocr.Income = 'dis';
        self.imageUpdated.Income = false;
        self.lastKnownState.Income = undefined;
        DocumentGroups.cleanSelectedType('Income');
        self.validationIncome ='';
        ValidationManager.resetValidation(self.incomeValidation, group, 'dis');
        self.imageUpdated.Income = false;
      }
    };

    self.checkStatusChanges =  function(group, doc){
      if(self.lastKnownState[group]!==doc.documentStatus) {
        self.imageUpdated[group]=false;
      }
      self.lastKnownState[group]=doc.documentStatus;
    };

    self.compareAndFill = function(type, doc){
      if (self.identityValidation[type] && type === DocumentGroups.getSelectedType('Identity').doctype) {
        self.validationIdentity = self.identityConfiguration[type];
        self.checkStatusChanges('Identity',doc);
        ValidationManager.fillIdentityValidations(doc, self.identityValidation, self.ocr);
      }

      if (self.incomeValidation[type] && type === DocumentGroups.getSelectedType('Income').doctype) {
        self.validationIncome = self.incomeConfiguration[type];
        self.checkStatusChanges('Income',doc);
        ValidationManager.fillIncomeValidations(doc, self.incomeValidation, self.ocr);
      }

      if (self.receiptValidation[type] && type === DocumentGroups.getSelectedType('Receipt').doctype) {
        self.validationReceipt = self.receiptConfiguration[type];
        self.checkStatusChanges('Receipt',doc);
        ValidationManager.fillReceiptValidations(doc, self.receiptValidation, self.ocr);
      }
    };

    self.updateStat = function(callback){
      OperationManager.getOpStat().then(
        function(opstat){
          self.terminated = (opstat.operationTerminated==='1');
          var docs = opstat.documents;
          var type = '';

          for (var i = 0; i < docs.length; i++) {
            type = OperationStore.getTypeFromId(docs[i].idDocument);
            if (type !== undefined) {
              self.compareAndFill(type, docs[i]);
            }
          }
          callback();
        },
        function(){
          self.setServerResponseError();
          callback();
        }
      );
    };

    self.updateSelected = function(oldtype, doc){
      ValidationConfiguration.clean();
      var group = DocumentGroups.getDocumentGroup(doc.type);
      OperationStore.setTypeForId(doc.documentId, doc.type);
      doc = OperationStore.moveToNewType(oldtype, doc.type);
      if(group === 'Identity'){
        DocumentGroups.setSelectedType(group,  self.identityConfiguration[doc.type]);
        self.selectedIdentity = DocumentGroups.getSelectedType('Identity');
        self.updateAttributesValues(doc, self.selectedIdentity);
        self.clearAttributesValues(self.identityConfiguration[oldtype]);
      }
      if(group === 'Income'){
        DocumentGroups.setSelectedType(group,  self.incomeConfiguration[doc.type]);
        self.selectedIncome = DocumentGroups.getSelectedType('Income');
        self.updateAttributesValues(doc, self.selectedIncome);
        self.clearAttributesValues(self.incomeConfiguration[oldtype]);
      }
      if(group === 'Receipt'){
        DocumentGroups.setSelectedType(group,  self.receiptConfiguration[doc.type]);
        self.selectedReceipt = DocumentGroups.getSelectedType('Receipt');
        self.updateAttributesValues(doc, self.selectedReceipt);
        self.clearAttributesValues(self.receiptConfiguration[oldtype]);
      }
    };

    self.updateAttributesValues = function(doc, selected){
      Object.keys(doc.attributes).forEach(function(key) {
        for (var i = 0; i < selected.fields.length; i++) {
          if (selected.fields[i].attrname === key) {
            self.updateAttributeValue(key, selected.fields[i], doc);
          }
        }
      });
    };

    self.updateAttributeValue = function(key, field, doc){
      if (field.show !== 'true') {
        return;
      }
      if (field.controltype !== 'date'){
        field.value = doc.attributes[key];
      } else {
        var strDate = doc.attributes[key];
        var dateString = ValidationManager.dateFormat(strDate);
        if(dateString !== undefined) {
          var dateParts = dateString.split('/');
          var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // month is 0-based
          field.value = dateObject;
        }
      }
    };

    self.clearAttributesValues = function(configuration){
      for (var i = 0; i < configuration.fields.length; i++) {
        if (typeof configuration.fields[i].defaultvalue === 'undefined') {
          configuration.fields[i].value = '';
        } else {
          configuration.fields[i].value = configuration.fields[i].defaultvalue;
        }
      }
    };

    self.updateDocs = function(callback){
      self.updateDoc('Identity', ValidationManager.fillIdentityAttributes, function(){
        self.updateDoc('Income', function(){}, function(){
          self.updateDoc('Receipt', function(){}, function(){
            callback();
          });
        });
      });
    };

    self.updateDoc = function(group, fillFunction, callback){
      var type = DocumentGroups.getSelectedType(group).doctype;
      OperationManager.getDoc(type).then(
        function(doc){
          if((type !== doc.type) && (DocumentGroups.isValidType(type, doc.type))){
            self.imageUpdated[group]=false;
            self.updateSelected(type, doc);
          }
          fillFunction(doc, self.identityValidation);
          callback();
        }, function(error){
          self.error = error;
          self.modal = true;
        }
      );
    };

    self.updateView = function(group){
      OperationManager.getView(DocumentGroups.getSelectedType(group).doctype).then(
        function(view){
          self.updateViewImage(DocumentGroups.getSelectedType(group).doctype);
          if( view.attributes.ocr_document_type !== undefined && view.attributes.ocr_document_type !== '') {

            var doctype = DocumentGroups.getSelectedType(group).doctype;
            if ( ((view.attributes.ocr_document_type !== doctype) && !DocumentGroups.isValidType(doctype, view.attributes.ocr_document_type)) ||
                 (DocumentGroups.getDocumentGroup(view.attributes.ocr_document_type) !== DocumentGroups.getDocumentGroup(doctype)) ){
              self.ocr[group] = 'ko';
            } else {
                if (doctype === DocumentGroups.getSelectedType(group).doctype){
                  self.ocr[group] = 'ok';
                } else {
                  self.ocr[group] = 'pending';
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
      self.updateView('Identity');
      self.updateView('Income');
      self.updateView('Receipt');
    };

    self.refresh = function(){
      self.updateDocs(function(){
        self.updateStat(function(){
          self.updateViews();
        });
      });
    };


    $scope.startQuery = function() {
      if ( angular.isDefined(self.queryTicket) ){return;}
      self.queryTicket = $interval(self.refresh, 5000);
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
          // Deshabilitar los ipsa-image de Identity, Income y Receipt.
          self.disableIdentityImage = true;
          self.disableIncomeImage = true;
          self.disableReceiptImage = true;

          self.disableIdentityDocEntry = true;
          self.disableIncomeDocEntry = true;
          self.disableReceiptDocEntry = true;
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
      self.clearIncomeImage = true;
      self.clearReceiptImage = true;

      // Deshabilitar los ipsa-image de Income y Receipt. Habilitar el del Identity
      self.disableIdentityImage = false;
      self.disableIncomeImage = true;
      self.disableReceiptImage = true;

      // Limpiar input's de todos los documentos
      self.clearIdentityDocEntry = self.mustClearIdentity;
      self.clearIncomeDocEntry = true;
      self.clearReceiptDocEntry = true;

      self.disableIdentityDocEntry = false;
      self.disableIncomeDocEntry = true;
      self.disableReceiptDocEntry = true;

      // Limpiado de tipos reconocidos por ocr
      self.ocr.Identity = 'dis';
      self.ocr.Income ='dis';
      self.ocr.Receipt = 'dis';

      // Limpiado de flags de actualizacion de imagen
      self.imageUpdated.Identity = false;
      self.imageUpdated.Income =false;
      self.imageUpdated.Receipt = false;

      // Limpiado de flags de cambio de estado
      self.lastKnownState.Identity = undefined;
      self.lastKnownState.Income = undefined;
      self.lastKnownState.Receipt = undefined;

      // Vaciar validaciones
      ValidationConfiguration.clean();

      // Vaciar atributos
      DocumentGroups.cleanSelectedType('Identity');

      // Limpiar operacion
      OperationManager.clean();
	  DocEntryConfiguration.reLoad();
      OperationStore.setup([self.identityConfiguration, self.incomeConfiguration, self.receiptConfiguration]);

      self.validationIdentity ='';
      self.validationIncome = '';
      self.validationReceipt = '';
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

    self.onResetIncomeImage = function(){
        self.imageUpdated.Income = false;
    };

    self.onResetReceiptImage = function(){
        self.imageUpdated.Receipt = false;
    };

    // Eventos notificando la carga de cada imagen por la directiva ipsa-image
    self.uploadIdentityImage = function ($dataURI) {
        self.mustClearIdentity = false;
        self.initOperation();
        self.mustClearIdentity = true;

        self.uploadImage($dataURI, 'Identity', self.identityValidation, self.identityConfiguration);

        self.disableIncomeImage = false;
        self.disableReceiptImage = false;
        self.disableIncomeDocEntry = false;
        self.disableReceiptDocEntry = false;
        self.disableIdentityDocEntry = true;
        self.ocr.Identity = 'pending';
        self.imageUpdated.Identity = false;
        self.lastKnownState.Identity = undefined;

        $scope.startQuery();
    };

    self.uploadIncomeImage = function ($dataURI) {
      self.uploadImage($dataURI, 'Income', self.incomeValidation, self.incomeConfiguration);
      self.ocr.Income ='pending';
      self.imageUpdated.Income = false;
      self.lastKnownState.Income = undefined;
    };

    self.uploadReceiptImage = function ($dataURI) {
      self.uploadImage($dataURI, 'Receipt', self.receiptValidation, self.receiptConfiguration);
      self.ocr.Receipt = 'pending';
      self.imageUpdated.Receipt = false;
      self.lastKnownState.Receipt = undefined;
    };

    self.uploadImage = function ($dataURI, group, validation, configuration){
      var doctype = DocumentGroups.getSelectedType(group).doctype;
      ValidationManager.resetValidation(validation, group, 'pending');
      self.file = $dataURI;

      FieldsManager.setAttributesValues(configuration, doctype);
      OperationManager.sendViewFile(doctype, self.file);
    };

    self.isIncomeImageDisabled = function() {
      return (self.disableIncomeImage);
    };

    self.isReceiptImageDisabled = function() {
      return (self.disableReceiptImage);
    };

    self.isTerminateButtonDisabled = function() {
      return self.terminated===true || (!OperationManager.isStarted());
    };

    self.isCancelButtonDisabled = function() {
      return (!OperationManager.isStarted());
    };

    self.resetAll();

  }
  validationDemoCtrl.$inject=['$scope', '$filter', '$location', '$translate','$timeout', '$interval',
                              'NgTableParams', 'PageStatus', 'OperationManager','FieldsManager', 'OperationStore', 'DocumentGroups', 'DocEntryConfiguration', 'ValidationConfiguration', 'ValidationManager'];
  angular
  .module('app.controllers')
  .controller('ValidationDemoCtrl', validationDemoCtrl);

})();
