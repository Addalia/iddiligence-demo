var facerecognition_page = function () {
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

	self.setPatternName = function (value) {
    	element(by.id('patternname')).sendKeys(value);
  	};

	self.getPPatternName = function() {
		return element(by.id('patternname')).getAttribute('value');
	};

	self.setPatternNumber = function (value) {
    	element(by.id('patternnumber')).sendKeys(value);
  	};

	self.getPatternNumber = function() {
		return element(by.id('patternnumber')).getAttribute('value');
	};

	self.getIdentityMediaPatternId = function() {
    return element(by.id('identitymediapatternid')).getAttribute('value');
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

	self.getPanelPattern = function() {
		var idPanelPattern = 'panel-REFERENCE_PATTERN_DOCUMENT';
		return element(by.id(idPanelPattern));
	};

	self.getPanelTitlePattern = function() {
		var idPanelTitlePattern = 'panel-title-REFERENCE_PATTERN_DOCUMENT';
		return element(by.id(idPanelTitlePattern));
	};

	self.getPanelIdentityMedia = function() {
		var idPanelIdentityMedia = 'panel-IDENTITY_MEDIA_DOCUMENT';
		return element(by.id(idPanelIdentityMedia));
	};

	self.getPanelTitleIdentityMedia = function() {
		var idPanelTitleIdentityMedia = 'panel-title-IDENTITY_MEDIA_DOCUMENT';
		return element(by.id(idPanelTitleIdentityMedia));
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

	self.getDocEntryPattern = function() {
		var idDocEntryPattern = 'ipsa-docentry-REFERENCE_PATTERN_DOCUMENT';
		return element(by.id(idDocEntryPattern));
	};

	self.getDocEntryIdentityMedia = function() {
		var idDocEntryIdentityMedia = 'ipsa-docentry-IDENTITY_MEDIA_DOCUMENT';
		return element(by.id(idDocEntryIdentityMedia));
	};

};
module.exports = new facerecognition_page();
