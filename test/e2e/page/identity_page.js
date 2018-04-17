var identity_page = function () {
	'use strict';	

	var self = this;

	self.get = function () {
    	browser.get('http://localhost:8083/');
	};

	self.getPanelTitle = function () {
		return element(by.id('MainTitle')).getText();		
	};
        
    self.getLeftLogo = function () {
		return element(by.id('LeftLogo'));		
	};
        
    self.getRightLogo = function () {
		return element(by.id('RightLogo'));		
	};        

	self.logOut = function () {
		element(by.css('.glyphicon-log-out')).click();    
	};

	self.getCurrentUrl = function() {
		return browser.getCurrentUrl();
	};

	self.getIpsaImgById = function(value) {
		return element(by.id(value));
	};

	self.getIpsaImgByIndex = function(value) {
		element.all(by.css('.drop-box')).then(function(items) {
			return items[value];		
		});
	};

	self.getAllIpsaImg = function() {
		return element.all(by.css('input[type="file"]'));
	};

	self.getPanelIdentity = function() {
		var idPanelIdentity = 'panel-IDENTITY_DOCUMENT';
		return element(by.id(idPanelIdentity));		
	};

	self.getPanelTitleIdentity = function() {
		var idPanelTitleIdentity = 'panel-title-IDENTITY_DOCUMENT';
		return element(by.id(idPanelTitleIdentity));		
	};

	self.getPanelSignature = function() {
		var idPanelSignature = 'panel-SIGNATURE_CARD';
		return element(by.id(idPanelSignature));		
	};

	self.getPanelTitleSignature = function() {
		var idPanelTitleSignature = 'panel-title-SIGNATURE_CARD';
		return element(by.id(idPanelTitleSignature));		
	};

  	self.clickNewOpButton = function () {
    	element(by.id('newOp_btn')).click();        
  	};

  	self.clickCancelButton = function () {
    	element(by.id('cancel_btn')).click();        
  	};

  	self.clickTerminateButton = function () {
    	element(by.id('terminate_btn')).click();        
  	};

  	self.getModalMessage = function () {
    	return element(by.css('.modal-body')).getText();
  	};

	self.clickModalOk = function () {
    	element(by.id('modal_ok')).click();
	};

	self.getDocEntryFrontIdentity = function() {
		var idDocEntryIdentity = 'ipsa-docentry-FRONT_LABEL';
		return element(by.id(idDocEntryIdentity));		
	};

	self.getDocEntryBackIdentity = function() {
		var idDocEntryIdentity = 'ipsa-docentry-BACK_LABEL';
		return element(by.id(idDocEntryIdentity));		
	};

	self.getDocEntrySignature = function() {
		var idDocEntrySignature = 'ipsa-docentry-SIGNATURE_CARD_LABEL';
		return element(by.id(idDocEntrySignature));		
	};

	// Dni document type attributes

	self.setDniNumber = function (value) {
    	element(by.id('dninumber')).sendKeys(value);
  	};

	self.getDniNumber = function() {
		return element(by.id('dninumber')).getAttribute('value');		
	};

	self.setDniFirstName = function (value) {
    	element(by.id('dnifirstname')).sendKeys(value);
  	};

	self.getDniFirstName = function() {
		return element(by.id('dnifirstname')).getAttribute('value');		
	};

	self.setDniLastName = function (value) {
    	element(by.id('dnilastname')).sendKeys(value);
  	};

	self.getDniLastName = function() {
		return element(by.id('dnilastname')).getAttribute('value');		
	};

	self.setDniBirthdate = function (value) {
    	element(by.id('dnibirthdate')).sendKeys(value);
  	};

	self.getDniBirthdate = function() {
		return element(by.id('dnibirthdate')).getAttribute('value');		
	};

	self.setDniExpirationDate = function (value) {
    	element(by.id('dniexpirationdate')).sendKeys(value);
  	};

	self.getDniExpirationDate = function() {
		return element(by.id('dniexpirationdate')).getAttribute('value');		
	};

	// Nie document type attributes

	self.setNieNumber = function (value) {
    	element(by.id('nienumber')).sendKeys(value);
  	};

	self.getNieNumber = function() {
		return element(by.id('nienumber')).getAttribute('value');		
	};

	self.setNieFirstName = function (value) {
    	element(by.id('niefirstname')).sendKeys(value);
  	};

	self.getNieFirstName = function() {
		return element(by.id('niefirstname')).getAttribute('value');		
	};

	self.setNieLastName = function (value) {
    	element(by.id('nielastname')).sendKeys(value);
  	};

	self.getNieLastName = function() {
		return element(by.id('nielastname')).getAttribute('value');		
	};

	self.setNieBirthdate = function (value) {
    	element(by.id('niebirthdate')).sendKeys(value);
  	};

	self.getNieBirthdate = function() {
		return element(by.id('niebirthdate')).getAttribute('value');		
	};

	self.setNieExpirationDate = function (value) {
    	element(by.id('nieexpirationdate')).sendKeys(value);
  	};

	self.getNieExpirationDate = function() {
		return element(by.id('nieexpirationdate')).getAttribute('value');		
	};



};
module.exports = new identity_page();
