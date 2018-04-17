var validation_page = function () {
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

	self.setPaysheetAmount = function (value) {
    	element(by.id('paysheetamount')).sendKeys(value);
  	};

	self.getPaysheetAmount = function() {
		return element(by.id('paysheetamount')).getAttribute('value');		
	};

	self.setBankReceiptAccount = function (value) {
    	element(by.id('bankreceiptaccount')).sendKeys(value);
  	};

	self.getBankReceiptAccount = function() {
		return element(by.id('bankreceiptaccount')).getAttribute('value');		
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
		var idPanelIdentity = 'panel-IDENTITY_LEGEND';
		return element(by.id(idPanelIdentity));		
	};

	self.getPanelTitleIdentity = function() {
		var idPanelTitleIdentity = 'panel-title-IDENTITY_LEGEND';
		return element(by.id(idPanelTitleIdentity));		
	};

	self.getPanelReceipt = function() {
		var idPanelReceipt = 'panel-RECEIPT_LEGEND';
		return element(by.id(idPanelReceipt));		
	};

	self.getPanelTitleReceipt = function() {
		var idPanelTitleReceipt = 'panel-title-RECEIPT_LEGEND';
		return element(by.id(idPanelTitleReceipt));		
	};

	self.getPanelIncome = function() {
		var idPanelIncome = 'panel-INCOME_LEGEND';
		return element(by.id(idPanelIncome));		
	};

	self.getPanelTitleIncome = function() {
		var idPanelTitleIncome = 'panel-title-INCOME_LEGEND';
		return element(by.id(idPanelTitleIncome));		
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

	self.getDocEntryIdentity = function() {
		var idDocEntryIdentity = 'ipsa-docentry-IDENTITY_LEGEND';
		return element(by.id(idDocEntryIdentity));		
	};

	self.getDocEntryIncome = function() {
		var idDocEntryIncome = 'ipsa-docentry-INCOME_LEGEND';
		return element(by.id(idDocEntryIncome));		
	};

	self.getDocEntryReceipt = function() {
		var idDocEntryReceipt = 'ipsa-docentry-RECEIPT_LEGEND';
		return element(by.id(idDocEntryReceipt));		
	};

	self.setAutomaticAccount = function (value) {
    	element(by.id('account_number')).sendKeys(value);
  	};

	self.getAutomaticAccount = function() {
		return element(by.id('account_number')).getAttribute('value');		
	};

	self.setAutomaticAmount = function (value) {
    	element(by.id('amount')).sendKeys(value);
  	};

	self.getAutomaticAmount = function() {
		return element(by.id('amount')).getAttribute('value');		
	};


};
module.exports = new validation_page();
