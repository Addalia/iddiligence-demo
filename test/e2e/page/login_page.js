var login_page = function () {
  'use strict';

  var self = this;

	self.setUser = function (value) {
		element(by.model('userlogin.user.user')).sendKeys(value);
	};

	self.getUser = function () {
		return element(by.model('userlogin.user.user')).getText();
	};

  self.setPassword = function (value) {
    element(by.model('userlogin.user.pass')).sendKeys(value);
  };

  self.getPassword = function () {
    return element(by.model('userlogin.user.pass')).getText();
  };

  self.getPanelTitle = function () {
     return element(by.css('legend')).getText();
  };

  self.getMessage = function () {
    return element(by.css('.alert-danger')).getText();
  };

  self.clickSubmitButton = function (app) {
    element(by.id('login_btn_submit')).click();
    if (app === 'DemoApp') {
      return require('./validation_page.js');
    }
    if (app === 'IdentityApp') {
      return require('./identity_page.js');
    }
    if (app === 'FaceRecognitionApp') {
      return require('./facerecognition_page.js');
    }
    if (app === 'PVIApp') {
      return require('./pvi_validation_page.js');
    }

  };

  self.loginAsAdmin = function (app) {
    self.setUser('admin');
    self.setPassword('admin');
    element(by.id('login_btn_submit')).click();
    if (app === 'DemoApp') {
      return require('./validation_page.js');
    }
    if (app === 'IdentityApp') {
      return require('./identity_page.js');
    }
    if (app === 'FaceRecognitionApp') {
      return require('./facerecognition_page.js');
    }
    if (app === 'PVIApp') {
      return require('./pvi_validation_page.js');
    }

  };


  self.loginAsUserTest = function (app) {
    self.setUser('usertest');
    self.setPassword('usertest');
    element(by.id('login_btn_submit')).click();
    if (app === 'DemoApp') {
      return require('./validation_page.js');
    }
    if (app === 'IdentityApp') {
      return require('./identity_page.js');
    }
    if (app === 'FaceRecognitionApp') {
      return require('./facerecognition_page.js');
    }
    if (app === 'PVIApp') {
      return require('./pvi_validation_page.js');
    }

  };


  self.selectLanguage = function (itemName) {
    element(by.css('.dropdown.locale')).click();
    $('.dropdown.open')
       .element(by.linkText(itemName))
       .click();
  };

  self.selectProduct = function (label) {
    element(by.model('userlogin.selected')).$('[label="'+label+'"]').click();
    //var drop = element(by.model('userlogin.selected'));
    //drop.click();
    //drop.$('[value="'+id+'"]').click();
    //drop.element(by.binding(productName)).click();
    //element(by.linkText(productName)).click();
  };

};
module.exports = new login_page();
