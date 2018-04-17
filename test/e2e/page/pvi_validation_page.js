var pvi_validation_page = function () {
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

	// Dni document type attributes

	self.setDniPhone = function (value) {
    	element(by.id('dnitelephonenumber')).sendKeys(value);
  	};

	self.getDniPhone = function() {
		return element(by.id('dnitelephonenumber')).getAttribute('value');
	};

	self.setDniUserAuthorization = function () {
    	element(by.id('authorization')).click();
  	};

	self.getDniUserAuthorization = function() {
		return element(by.id('authorization')).getAttribute('checked');
	};

	// Nie document type attributes

	self.setNiePhone = function (value) {
    	element(by.id('nietelephonenumber')).sendKeys(value);
  	};

	self.getNiePhone = function() {
		return element(by.id('nietelephonenumber')).getAttribute('value');
	};

	self.setNieUserAuthorization = function (value) {
    	element(by.id('authorization')).sendKeys(value);
  	};

	self.getNieUserAuthorization = function() {
		return element(by.id('authorization')).getAttribute('value');
	};

	// Passport document type attributes

	self.setPassportPhone = function (value) {
    	element(by.id('passporttelephonenumber')).sendKeys(value);
  	};

	self.getPassportPhone = function() {
		return element(by.id('passporttelephonenumber')).getAttribute('value');
	};

	self.setPassportUserAuthorization = function (value) {
    	element(by.id('authorization')).sendKeys(value);
  	};

	self.getPassportUserAuthorization = function() {
		return element(by.id('authorization')).getAttribute('value');
	};

	// Automatic Identity document type attributes

	self.setAutomaticPhone = function (value) {
    	element(by.id('telephonenumber')).sendKeys(value);
  	};

	self.getAutomaticPhone = function() {
		return element(by.id('telephonenumber')).getAttribute('value');
	};

	self.setAutomaticUserAuthorization = function () {
    	element(by.id('authorization')).click();
  	};

	self.getAutomaticUserAuthorization = function() {
		return element(by.id('authorization')).getAttribute('checked');
	};

	// other documents

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

  	self.clickSendButton = function (app) {
    	element(by.id('sendPVI_btn')).click();
  	};

  	self.getModalTittle = function () {
      return element.all(by.css('.panel-heading')).first();
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

  self.clickPviModalOk = function () {
      element(by.id('pvi_modal_ok')).click();
  };

  self.clickPviModalCancel = function () {
      element(by.id('pvi_modal_cancel')).click();
  };

  self.getModalMessage = function () {
      return element(by.css('.modal-body')).getText();
    };

  self.putOKValidations = function () {
    // element.all(by.id('val-VALIDATION_FIRST_NAME')).then(function(items) {
    //   items[0].click();
    //   items[1].click();
    // });

    // element.all(by.id('val-VALIDATION_LAST_NAME')).then(function(items) {
    //   items[0].click();
    //   items[1].click();
    // });

    //  element(by.id('val-VALIDATION_DATE_PERIOD')).click();
    //  element(by.id('val-VALIDATION_PERCENT_QUOTATION')).click();
    //  element(by.id('val-VALIDATION_PASSIVE_RIGHTS')).click();
    //  element(by.id('val-VALIDATION_SENIORITY_DATE')).click();
    //  element(by.id('val-VALIDATION_BUSINESS_NAME')).click();
    //  element(by.id('val-VALIDATION_CIF_BUSINESS')).click();

    element.all(by.css('.panel-body.pre-scrollable')).each(function(item){
      item.all(by.css('.glyphicon-remove')).each(function(elem){
          elem.click().then(function(){
              browser.sleep(200);
          });
      });
    });


  };

};
module.exports = new pvi_validation_page();
