'use strict';

describe('PVIDemoApp', function() {
  var login_page;
  var pvi_validation_page;
  var waitTimeOut = 18000;

  var dni_resource = './resources/Dni_reverso.jpg';
  var bankreceipt_resource = './resources/JustificanteBancario.jpg';
  var bankreceipt_account = '2100 2794 960100123491';
  var paysheet_resource = './resources/Nomina.jpg';
  var paysheet_amount = '1.423,86';
  var identity_phone = '123456789';

  login_page = require('./page/login_page.js');
  pvi_validation_page = require('./page/pvi_validation_page.js');

  beforeEach(function() {
    init_test();
  });


  describe('PVI Validation page', function() {

    /*****************************************************************************
      Note: all test results are based in the plugin OCR named 'OCRPluginTest'.
    ******************************************************************************/

    beforeEach(function() {
      login_page.selectLanguage('Inglés');
      login_page.selectProduct('PVI Operations');
      pvi_validation_page = login_page.loginAsAdmin('PVIApp');
    });

    afterEach(function() {
      login_page.selectLanguage('Spanish');
      pvi_validation_page.logOut();
    });

    it('should able on correct page', function() {
      expect(pvi_validation_page.getCurrentUrl()).toEqual("http://localhost:8083/pviOperationsDemo");
    });


    it('should get the entire empty page', function() {

      expect(pvi_validation_page.getPanelTitle()).toBe('PVI Operations');

      // docentry directive, 9 configured input attributes, 9 created but only 4 are visibles. Method 1
      element.all(by.css('.input.docentry')).all(by.css('.form-control')).then(function(items) {
        expect(items.length).toBe(9);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
        expect(items[3].getAttribute('value')).toBe('');
        expect(items[4].getAttribute('value')).toBe('');
        expect(items[5].getAttribute('value')).toBe('');
		expect(items[6].getAttribute('checked')).toBeFalsy();
		expect(items[7].getAttribute('value')).toBe('');
		expect(items[8].getAttribute('value')).toBe('');
      });

	  // docentry directive, 9 configured input attributes, 9 created but only 4 are visibles. Method 2
	  expect(element.all(by.repeater('field in selected.fields')).count()).toBe(9);

      // validation directive, 4 configured attributes. Method 1
      element.all(by.css('.input.validation')).all(by.css('.form-control')).then(function(items) {
        expect(items.length).toBe(4);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
        expect(items[3].getAttribute('value')).toBe('');
      });

      // validation directive, 4 configured attributes. Method 2
	  expect(element.all(by.repeater('(key, value) in docattribs')).count()).toBe(4);

      expect(element(by.buttonText('New')).isEnabled()).toBe(true);
      expect(element(by.buttonText('Cancel')).isEnabled()).toBe(false);
      expect(element(by.buttonText('Terminate')).isEnabled()).toBe(false);
      expect(element(by.buttonText('Send PVI')).isEnabled()).toBe(false);
      expect(pvi_validation_page.getPaysheetAmount()).toBe('');
      expect(pvi_validation_page.getBankReceiptAccount()).toBe('');

      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      expect(items.get(0).isDisplayed()).toBe(false);
      expect(items.get(1).isDisplayed()).toBe(false);
      expect(items.get(2).isDisplayed()).toBe(false);

      // Check if all image controls are disabled. Identity has a required field.
      //expect(ipsaImgList.get(0).isEnabled()).toBe(true);
      //expect(ipsaImgList.get(1).isEnabled()).toBe(false);       // don't work, always true
      //expect(ipsaImgList.get(2).isEnabled()).toBe(false);       // don't work, always true
      element.all(by.css('.drop-box-container')).then(function(items) {
        expect(items.length).toBe(3);
      });

      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(3);
      });

    });


    it('should obtain all three ipsa img elements in validation page', function() {
      element.all(by.css('.drop-box')).then(function(items) {
        expect(items.length).toBe(3);
      });
    });


    it('should obtain ipsa img element by index', function() {
      var item = pvi_validation_page.getIpsaImgByIndex(0);
      expect(item).not.toBe(null);
    });


    it('should obtain ipsa img element by Id', function() {
      var id = 'ipsa-image-IDENTITY_LEGEND';
      expect(element(by.id(id)).isPresent()).toBe(true);

      var item = pvi_validation_page.getIpsaImgById(id);
      expect(item).not.toBe(null);
      expect(item.isPresent()).toBe(true);
    });


    it('should set an image to Dni drop area and show ocr-test recognition', function() {

      var elementPanelIdentity = pvi_validation_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Awaiting document")});

      var ipsaImgList = pvi_validation_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);

      // all three image controls are disabled before entering required fields
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(3);
      });

      // set both Dni attributes
      pvi_validation_page.setDniPhone(identity_phone);
      pvi_validation_page.setDniUserAuthorization();

      // docentry directive, check if introduced attributes are present, text and checkbox
      element.all(by.css('.input.docentry')).all(by.css('.form-control')).then(function(items) {
        expect(items.length).toBe(9);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
        expect(items[3].getAttribute('value')).toBe('');
        expect(items[4].getAttribute('value')).toBe('');
        expect(items[5].getAttribute('value')).toBe(identity_phone);
		expect(items[6].getAttribute('checked')).toBeTruthy();
		expect(items[7].getAttribute('value')).toBe('');
		expect(items[8].getAttribute('value')).toBe('');
      });

      // and now only two docentry image controls are disabled after introduce required fields
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(2);
      });

      // set the Dni image.
      var path = require('path');
      var absolutePath = path.resolve(__dirname, dni_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);

      // Check if only first image element has content
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      expect(items.get(0).isDisplayed()).toBe(true);
      expect(items.get(1).isDisplayed()).toBe(false);
      expect(items.get(2).isDisplayed()).toBe(false);

      browser.sleep(300);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Document received and identified")});

      var inputList = elementPanelIdentity.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(4);

      // Note: The result of getText from an input element is always empty.
      expect(inputList.get(0).getAttribute('value')).toEqual('IGNASI');
      expect(inputList.get(1).getAttribute('value')).toEqual('CASANOAS TARAFA');
      expect(inputList.get(2).getAttribute('value')).toEqual('47871577K');
      expect(inputList.get(3).getAttribute('value')).toEqual('17/01/2019');

    });


    it('should clear the entire page when click on New Operation button', function() {
      var elementPanelIdentity = pvi_validation_page.getPanelIdentity();
      var ipsaImgList = pvi_validation_page.getAllIpsaImg();

      // set only required Dni attribute to activate image
      pvi_validation_page.setDniPhone(identity_phone);

      // set the Dni image.
      var path = require('path');
      var absolutePath = path.resolve(__dirname, dni_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);

      browser.sleep(waitTimeOut);

      var inputList = elementPanelIdentity.all(by.css('input[type="text"]'));
      expect(inputList.get(0).getAttribute('value')).toEqual('IGNASI');
      expect(inputList.get(1).getAttribute('value')).toEqual('CASANOAS TARAFA');
      expect(inputList.get(2).getAttribute('value')).toEqual('47871577K');
      expect(inputList.get(3).getAttribute('value')).toEqual('17/01/2019');

      pvi_validation_page.clickNewOpButton();
      element.all(by.css('.input.validation')).all(by.css('.form-control')).then(function(items) {
        expect(items.length).toBe(4);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
        expect(items[3].getAttribute('value')).toBe('');
      });

      expect(element(by.buttonText('New')).isEnabled()).toBe(true);
      expect(element(by.buttonText('Cancel')).isEnabled()).toBe(false);
      expect(element(by.buttonText('Terminate')).isEnabled()).toBe(false);
      expect(element(by.buttonText('Send PVI')).isEnabled()).toBe(false);
      expect(pvi_validation_page.getPaysheetAmount()).toBe('');
      expect(pvi_validation_page.getBankReceiptAccount()).toBe('');

      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      expect(items.get(0).isDisplayed()).toBe(false);
      expect(items.get(1).isDisplayed()).toBe(false);
      expect(items.get(2).isDisplayed()).toBe(false);

      // Check if all image controls are disabled. Identity has a required field.
      element.all(by.css('.drop-box-container')).then(function(items) {
        expect(items.length).toBe(3);
      });

      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(3);
      });

    });


    it('should clear the entire page when click on Cancel button', function() {
      var elementPanelIdentity = pvi_validation_page.getPanelIdentity();
      var ipsaImgList = pvi_validation_page.getAllIpsaImg();

      // set only required Dni attribute to activate image
      pvi_validation_page.setDniPhone(identity_phone);

      // set the Dni image.
      var path = require('path');
      var absolutePath = path.resolve(__dirname, dni_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);
      browser.sleep(waitTimeOut);
      var inputList = elementPanelIdentity.all(by.css('input[type="text"]'));
      expect(inputList.get(0).getAttribute('value')).toEqual('IGNASI');
      expect(inputList.get(1).getAttribute('value')).toEqual('CASANOAS TARAFA');
      expect(inputList.get(2).getAttribute('value')).toEqual('47871577K');
      expect(inputList.get(3).getAttribute('value')).toEqual('17/01/2019');

      pvi_validation_page.clickCancelButton();

      element.all(by.css('.input.validation')).all(by.css('.form-control')).then(function(items) {
        expect(items.length).toBe(4);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
        expect(items[3].getAttribute('value')).toBe('');
      });

      expect(element(by.buttonText('New')).isEnabled()).toBe(true);
      expect(element(by.buttonText('Cancel')).isEnabled()).toBe(false);
      expect(element(by.buttonText('Terminate')).isEnabled()).toBe(false);
      expect(element(by.buttonText('Send PVI')).isEnabled()).toBe(false);
      expect(pvi_validation_page.getPaysheetAmount()).toBe('');
      expect(pvi_validation_page.getBankReceiptAccount()).toBe('');

      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      expect(items.get(0).isDisplayed()).toBe(false);
      expect(items.get(2).isDisplayed()).toBe(false);
      expect(items.get(4).isDisplayed()).toBe(false);

      // Check if all image controls are disabled. Identity has a required field.
      element.all(by.css('.drop-box-container')).then(function(items) {
        expect(items.length).toBe(3);
      });

      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(3);
      });

    });


    it('should show modal message when only Dni document is loaded and click on Terminate button', function() {
      var ipsaImgList = pvi_validation_page.getAllIpsaImg();

      // set only required Dni attribute to activate image
      pvi_validation_page.setDniPhone(identity_phone);

      // set the Dni image.
      var path = require('path');
      var absolutePath = path.resolve(__dirname, dni_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);

      expect(element(by.buttonText('Terminate')).isEnabled()).toBe(true);
      pvi_validation_page.clickTerminateButton();
      expect(pvi_validation_page.getModalMessage()).toBe('There are missing documents');
      browser.sleep(3000);
      pvi_validation_page.clickModalOk();
    });


    it('should have been loaded the title and the different document types and fields in every docentry selector', function() {

      // ********************************
      // Identity
      // ********************************
      var elementDocEntryIdentity = pvi_validation_page.getDocEntryIdentity();
      elementDocEntryIdentity.getText().then(function(text){expect(text).toContain("Identification")});

      // selected item
      var selectedIdentity=elementDocEntryIdentity.all(by.css('.navbar-nav > li > a'));
      expect(selectedIdentity.count()).toBe(1);
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('DNI');

      // list item
      var listIdentity=elementDocEntryIdentity.all(by.css('.dropdown-menu > li > a'));
      expect(listIdentity.count()).toBe(4);
      expect(listIdentity.get(0).getAttribute('value')).toBe('DNI_LABEL');
      expect(listIdentity.get(0).getAttribute('innerText')).toContain('DNI');
      expect(listIdentity.get(1).getAttribute('value')).toBe('NIE_LABEL');
      expect(listIdentity.get(1).getAttribute('innerText')).toContain('NIE');
      expect(listIdentity.get(2).getAttribute('value')).toBe('PASSPORT_LABEL');
      expect(listIdentity.get(2).getAttribute('innerText')).toContain('Passport');
      expect(listIdentity.get(3).getAttribute('value')).toBe('DOC_AUTO_LABEL');
      expect(listIdentity.get(3).getAttribute('innerText')).toContain('Automatic');

      // input attributes, as defined in model and for the actual selected document
      var attrIdentity=elementDocEntryIdentity.all(by.css('.input'));
      expect(attrIdentity.count()).toBe(7);
      expect(attrIdentity.get(0).isDisplayed()).toBe(false);
      expect(attrIdentity.get(1).isDisplayed()).toBe(false);
      expect(attrIdentity.get(2).isDisplayed()).toBe(false);
      expect(attrIdentity.get(3).isDisplayed()).toBe(false);
      expect(attrIdentity.get(4).isDisplayed()).toBe(false);
      expect(attrIdentity.get(5).isDisplayed()).toBe(true);
      expect(attrIdentity.get(6).isDisplayed()).toBe(true);

      // ********************************
      // Income
      // ********************************
      var elementDocEntryIncome = pvi_validation_page.getDocEntryIncome();
      elementDocEntryIncome.getText().then(function(text){expect(text).toContain('Income')});

      // selected item
      var selectedIncome=elementDocEntryIncome.all(by.css('.navbar-nav > li > a'));
      expect(selectedIncome.count()).toBe(1);
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Paysheet');

      // list item
      var listIncome=elementDocEntryIncome.all(by.css('.dropdown-menu > li > a'));
      expect(listIncome.count()).toBe(3);
      expect(listIncome.get(0).getAttribute('value')).toBe('PAYSHEET_LABEL');
      expect(listIncome.get(0).getAttribute('innerText')).toContain('Paysheet');
      expect(listIncome.get(1).getAttribute('value')).toBe('IRPF_LABEL');
      expect(listIncome.get(1).getAttribute('innerText')).toContain('IRPF');
      expect(listIncome.get(2).getAttribute('value')).toBe('DOC_AUTO_LABEL');
      expect(listIncome.get(2).getAttribute('innerText')).toContain('Automatic');


      // input attributes, as defined in model and for the actual selected document
      var attrIncome=elementDocEntryIncome.all(by.css('.input'));
      expect(attrIncome.count()).toBe(1);
      expect(attrIncome.get(0).isDisplayed()).toBe(true);

      // ********************************
      // Receipt
      // ********************************
      var elementDocEntryReceipt = pvi_validation_page.getDocEntryReceipt();
      elementDocEntryReceipt.getText().then(function(text){expect(text).toContain('Receipts')});

      // selected item
      var selectedReceipt=elementDocEntryReceipt.all(by.css('.navbar-nav > li > a'));
      expect(selectedReceipt.count()).toBe(1);
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Bank receipt');

      // list item
      var listReceipt=elementDocEntryReceipt.all(by.css('.dropdown-menu > li > a'));
      expect(listReceipt.count()).toBe(3);
      expect(listReceipt.get(0).getAttribute('value')).toBe('BANK_RECEIPT_LABEL');
      expect(listReceipt.get(0).getAttribute('innerText')).toContain('Bank receipt');
      expect(listReceipt.get(1).getAttribute('value')).toBe('RECEIPT_LABEL');
      expect(listReceipt.get(1).getAttribute('innerText')).toContain('Receipt');
      expect(listReceipt.get(2).getAttribute('value')).toBe('DOC_AUTO_LABEL');
      expect(listReceipt.get(2).getAttribute('innerText')).toContain('Automatic');

      // input attributes, as defined in model and for the actual selected document
      var attrReceipt=elementDocEntryReceipt.all(by.css('.input'));
      expect(attrReceipt.count()).toBe(1);
      expect(attrReceipt.get(0).isDisplayed()).toBe(true);

    });


    it('should be able to select between different document types in every docentry selector', function() {

      // ********************************
      // Identity
      // ********************************
      var elementDocEntryIdentity = pvi_validation_page.getDocEntryIdentity();

      var listIdentity=elementDocEntryIdentity.all(by.css('.dropdown-menu > li > a'));
      expect(listIdentity.count()).toBe(4);

      // initial selected item
      var selectedIdentity=elementDocEntryIdentity.all(by.css('.navbar-nav > li > a'));
      expect(selectedIdentity.count()).toBe(1);
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('DNI');

      // input attributes, as defined in model and for the actual selected document
      var attrIdentity=elementDocEntryIdentity.all(by.css('.input'));
      expect(attrIdentity.count()).toBe(7);
      expect(attrIdentity.get(0).isDisplayed()).toBe(false);
      expect(attrIdentity.get(1).isDisplayed()).toBe(false);
      expect(attrIdentity.get(2).isDisplayed()).toBe(false);
      expect(attrIdentity.get(3).isDisplayed()).toBe(false);
      expect(attrIdentity.get(4).isDisplayed()).toBe(false);
      expect(attrIdentity.get(5).isDisplayed()).toBe(true);
      expect(attrIdentity.get(6).isDisplayed()).toBe(true);

      // select second item from list
      selectedIdentity.get(0).click();
      listIdentity.get(1).click();
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('NIE');

      // input attributes, as defined in model and for the actual selected document
      attrIdentity=elementDocEntryIdentity.all(by.css('.input'));
      expect(attrIdentity.count()).toBe(7);
      expect(attrIdentity.get(0).isDisplayed()).toBe(false);
      expect(attrIdentity.get(1).isDisplayed()).toBe(false);
      expect(attrIdentity.get(2).isDisplayed()).toBe(false);
      expect(attrIdentity.get(3).isDisplayed()).toBe(false);
      expect(attrIdentity.get(4).isDisplayed()).toBe(false);
      expect(attrIdentity.get(5).isDisplayed()).toBe(true);
      expect(attrIdentity.get(6).isDisplayed()).toBe(true);

      // select third item from list
      selectedIdentity.get(0).click();
      listIdentity.get(2).click();
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('Passport');

      // input attributes, as defined in model and for the actual selected document
      attrIdentity=elementDocEntryIdentity.all(by.css('.input'));
      expect(attrIdentity.count()).toBe(7);
      expect(attrIdentity.get(0).isDisplayed()).toBe(false);
      expect(attrIdentity.get(1).isDisplayed()).toBe(false);
      expect(attrIdentity.get(2).isDisplayed()).toBe(false);
      expect(attrIdentity.get(3).isDisplayed()).toBe(false);
      expect(attrIdentity.get(4).isDisplayed()).toBe(false);
      expect(attrIdentity.get(5).isDisplayed()).toBe(true);
      expect(attrIdentity.get(6).isDisplayed()).toBe(true);

      // select fourth item from list
      selectedIdentity.get(0).click();
      listIdentity.get(3).click();
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('Automatic');

      // input attributes, as defined in model and for the actual selected document
      attrIdentity=elementDocEntryIdentity.all(by.css('.input'));
      expect(attrIdentity.count()).toBe(3);
      expect(attrIdentity.get(0).isDisplayed()).toBe(true);
      expect(attrIdentity.get(1).isDisplayed()).toBe(true);

      // ---
      // Note:
      // Income DocEntry and Receipt DocEntry are locked until load an image on Identity DocEntry, so
      // the document list in the select are not visible and can not be selected in this point
      // ---

      // ********************************
      // Income
      // ********************************
      var elementDocEntryIncome = pvi_validation_page.getDocEntryIncome();

      var listIncome=elementDocEntryIncome.all(by.css('.dropdown-menu > li > a'));
      expect(listIncome.count()).toBe(3);

      // initial selected item
      var selectedIncome=elementDocEntryIncome.all(by.css('.navbar-nav > li > a'));
      expect(selectedIncome.count()).toBe(1);
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Paysheet');

      // try to select second item from list, it can not
      selectedIncome.get(0).click();
      expect(listIncome.get(1).isDisplayed()).toBe(false);

      // input attributes, as defined in model and for the actual selected document
      var attrIncome=elementDocEntryIncome.all(by.css('.input'));
      expect(attrIncome.count()).toBe(1);
      expect(attrIncome.get(0).isDisplayed()).toBe(true);

      // ********************************
      // Receipt
      // ********************************
      var elementDocEntryReceipt = pvi_validation_page.getDocEntryReceipt();

      var listReceipt=elementDocEntryReceipt.all(by.css('.dropdown-menu > li > a'));
      expect(listReceipt.count()).toBe(3);

      // initial selected item
      var selectedReceipt=elementDocEntryReceipt.all(by.css('.navbar-nav > li > a'));
      expect(selectedReceipt.count()).toBe(1);
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Bank receipt');

      // try to select second item from list, it can not
      selectedReceipt.get(0).click();
      expect(listReceipt.get(1).isDisplayed()).toBe(false);

      // input attributes, as defined in model and for the actual selected document
      var attrReceipt=elementDocEntryReceipt.all(by.css('.input'));
      expect(attrReceipt.count()).toBe(1);
      expect(attrReceipt.get(0).isDisplayed()).toBe(true);

      // -----------------------------------
      // Load Identity - a Dni image ...
      // -----------------------------------

      var ipsaImgList = pvi_validation_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);
      var path = require('path');

      // set both Dni attributes
      pvi_validation_page.setAutomaticPhone(identity_phone);
      pvi_validation_page.setAutomaticUserAuthorization();

      var absolutePath = path.resolve(__dirname, dni_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);

      // ... and now should be able to select document type in the Income and Receipt DocEntries

      // ********************************
      // Income
      // ********************************

      // initial selected item
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Paysheet');

      // try to select the second item from list, it can
      selectedIncome.get(0).click();
      expect(listIncome.get(1).isDisplayed()).toBe(true);
      listIncome.get(1).click();
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('IRPF');

      // input attributes, as defined in model and for the actual selected document
      attrIncome=elementDocEntryIncome.all(by.css('.input'));
      expect(attrIncome.count()).toBe(1);
      expect(attrIncome.get(0).isDisplayed()).toBe(true);

      // try to select the third item from list, it can
      selectedIncome.get(0).click();
      expect(listIncome.get(2).isDisplayed()).toBe(true);
      listIncome.get(2).click();
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Automatic');

      // input attributes, as defined in model and for the actual selected document
      attrIncome=elementDocEntryIncome.all(by.css('.input'));
      expect(attrIncome.count()).toBe(2);
      expect(attrIncome.get(0).isDisplayed()).toBe(true);

      // ********************************
      // Receipt
      // ********************************

      // initial selected item
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Bank receipt');

      // try to select the second item from list, it can
      selectedReceipt.get(0).click();
      expect(listReceipt.get(1).isDisplayed()).toBe(true);
      listReceipt.get(1).click();
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Receipt');

      // input attributes, as defined in model and for the actual selected document
      attrReceipt=elementDocEntryReceipt.all(by.css('.input'));
      expect(attrReceipt.count()).toBe(0);

      // try to select the third item from list, it can
      selectedReceipt.get(0).click();
      expect(listReceipt.get(2).isDisplayed()).toBe(true);
      listReceipt.get(2).click();
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Automatic');

      // input attributes, as defined in model and for the actual selected document
      attrReceipt=elementDocEntryReceipt.all(by.css('.input'));
      expect(attrReceipt.count()).toBe(2);

    });


    it('should set a DNI when automatic is selected and OCR return DNI in Identity', function() {

      var ipsaImgList = pvi_validation_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);
      var path = require('path');
      var absolutePath;

      // ********************************
      // Identity
      // ********************************
      var elementPanelTitleIdentity = pvi_validation_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification")});
      var elementDocEntryIdentity = pvi_validation_page.getDocEntryIdentity();
      // selected item
      var selectedIdentity=elementDocEntryIdentity.all(by.css('.navbar-nav > li > a'));
      expect(selectedIdentity.count()).toBe(1);
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('DNI');

      // select item Automatic from list
      var listIdentity=elementDocEntryIdentity.all(by.css('.dropdown-menu > li > a'));
      expect(listIdentity.count()).toBe(4);

      selectedIdentity.get(0).click();
      listIdentity.get(3).click();
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('Automatic');

      var elementPanelIdentity = pvi_validation_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Awaiting document")});

      // set only required Identity attribute to activate image
      pvi_validation_page.setAutomaticPhone(identity_phone);

      // set the Dni image.
      absolutePath = path.resolve(__dirname, dni_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);

      // Check if only first image element has content.
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      //expect(items.get(0).getAttribute('src')).not.toBe(null);
      expect(items.get(0).isDisplayed()).toBe(true);
      expect(items.get(2).isDisplayed()).toBe(false);
      expect(items.get(4).isDisplayed()).toBe(false);

      browser.sleep(300);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);

      // selected item has changed from automatic to real recognized type
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('DNI');

      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification DNI")});
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Document received and identified")});

      var checkboxPanelTitleDni = elementPanelTitleIdentity.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelTitleDni.count()).toEqual(1);

      var checkboxPanelDni = elementPanelIdentity.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelDni.count()).toEqual(1);

      var inputList = elementPanelIdentity.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(4);

      expect(inputList.get(0).getAttribute('value')).toEqual('IGNASI');
      expect(inputList.get(1).getAttribute('value')).toEqual('CASANOAS TARAFA');
      expect(inputList.get(2).getAttribute('value')).toEqual('47871577K');
      expect(inputList.get(3).getAttribute('value')).toEqual('17/01/2019');

    });


    it('should set a Bank Receipt when automatic is selected and OCR return Bank Receipt in Receipt', function() {

      var ipsaImgList = pvi_validation_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);
      var path = require('path');
      var absolutePath;

      // ********************************
      // Identity
      // ********************************
      var elementPanelTitleIdentity = pvi_validation_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification")});
      var elementDocEntryIdentity = pvi_validation_page.getDocEntryIdentity();
      // selected item
      var selectedIdentity=elementDocEntryIdentity.all(by.css('.navbar-nav > li > a'));
      expect(selectedIdentity.count()).toBe(1);
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('DNI');

      // set only required Identity attribute to activate image
      pvi_validation_page.setDniPhone(identity_phone);

      // set the Dni image.
      absolutePath = path.resolve(__dirname, dni_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);
      browser.sleep(300);
      var elementPanelIdentity = pvi_validation_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);

      // ********************************
      // Receipt
      // ********************************
      var elementDocEntryReceipt = pvi_validation_page.getDocEntryReceipt();
      elementDocEntryReceipt.getText().then(function(text){expect(text).toContain('Receipts')});

      // selected item
      var selectedReceipt=elementDocEntryReceipt.all(by.css('.navbar-nav > li > a'));
      expect(selectedReceipt.count()).toBe(1);
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Bank receipt');

      // list item
      var listReceipt=elementDocEntryReceipt.all(by.css('.dropdown-menu > li > a'));
      expect(3).toBe(listReceipt.count());
      expect(listReceipt.get(0).getAttribute('value')).toBe('BANK_RECEIPT_LABEL');
      expect(listReceipt.get(0).getAttribute('innerText')).toContain('Bank receipt');
      expect(listReceipt.get(1).getAttribute('value')).toBe('RECEIPT_LABEL');
      expect(listReceipt.get(1).getAttribute('innerText')).toContain('Receipt');
      expect(listReceipt.get(2).getAttribute('value')).toBe('DOC_AUTO_LABEL');
      expect(listReceipt.get(2).getAttribute('innerText')).toContain('Automatic');

      // select item Automatic from list
      selectedReceipt.get(0).click();
      listReceipt.get(2).click();
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Automatic');

      // input attributes, as defined in model and for the actual selected document
      var attrReceipt=elementDocEntryReceipt.all(by.css('.input'));
      expect(2).toBe(attrReceipt.count());
      expect(true).toBe(attrReceipt.get(0).isDisplayed());
      expect(false).toBe(attrReceipt.get(1).isDisplayed());

      var elementPanelReceipt = pvi_validation_page.getPanelReceipt();
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Awaiting document")});

      pvi_validation_page.setAutomaticAccount(bankreceipt_account);
      absolutePath = path.resolve(__dirname, bankreceipt_resource);
      ipsaImgList.get(1).sendKeys(absolutePath);

      browser.sleep(300);
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);
      // selected item has changed from automatic to real recognized type
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Bank receipt');

      // and the introduced data has been moved from automatic model to real recognized type model
      expect(pvi_validation_page.getBankReceiptAccount()).toContain(bankreceipt_account);

      // Check the final expected results in the screen
      var elementPanelTitleReceipt = pvi_validation_page.getPanelTitleReceipt();
      elementPanelTitleReceipt.getText().then(function(text){expect(text).toContain("Receipts Bank receipt")});
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Document received and identified")});
      var checkboxPanelJustificanteBancarioAll = elementPanelReceipt.all(by.css('.glyphicon'));
      expect(checkboxPanelJustificanteBancarioAll.count()).toEqual(3);
      var checkboxPanelJustificanteBancarioKO = elementPanelReceipt.all(by.css('.glyphicon-remove'));
      expect(checkboxPanelJustificanteBancarioKO.count()).toEqual(1);
      var checkboxPanelJustificanteBancarioOK = elementPanelReceipt.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelJustificanteBancarioOK.count()).toEqual(2);

      // and the original introduced data has been removed
      // select item Automatic from list to check the data value
      selectedReceipt.get(0).click();
      listReceipt.get(2).click();
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Automatic');
      expect(pvi_validation_page.getAutomaticAccount()).toBe('');

    });


    it('should set a Paysheet when automatic is selected and OCR return Paysheet in Income', function() {

      var ipsaImgList = pvi_validation_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);
      var path = require('path');
      var absolutePath;

      // ********************************
      // Identity
      // ********************************
      var elementPanelTitleIdentity = pvi_validation_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification")});
      var elementDocEntryIdentity = pvi_validation_page.getDocEntryIdentity();
      // selected item
      var selectedIdentity=elementDocEntryIdentity.all(by.css('.navbar-nav > li > a'));
      expect(selectedIdentity.count()).toBe(1);
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('DNI');

      // set only required Identity attribute to activate image
      pvi_validation_page.setDniPhone(identity_phone);

      // set the Dni image.
      absolutePath = path.resolve(__dirname, dni_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);
      browser.sleep(300);
      var elementPanelIdentity = pvi_validation_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);

      // ********************************
      // Income
      // ********************************
      var elementDocEntryIncome = pvi_validation_page.getDocEntryIncome();
      elementDocEntryIncome.getText().then(function(text){expect(text).toContain('Income')});

      // selected item
      var selectedIncome=elementDocEntryIncome.all(by.css('.navbar-nav > li > a'));
      expect(selectedIncome.count()).toBe(1);
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Paysheet');

      // list item
      var listIncome=elementDocEntryIncome.all(by.css('.dropdown-menu > li > a'));
      expect(listIncome.count()).toBe(3);
      expect(listIncome.get(0).getAttribute('value')).toBe('PAYSHEET_LABEL');
      expect(listIncome.get(0).getAttribute('innerText')).toContain('Paysheet');
      expect(listIncome.get(1).getAttribute('value')).toBe('IRPF_LABEL');
      expect(listIncome.get(1).getAttribute('innerText')).toContain('IRPF');
      expect(listIncome.get(2).getAttribute('value')).toBe('DOC_AUTO_LABEL');
      expect(listIncome.get(2).getAttribute('innerText')).toContain('Automatic');

      // select item Automatic from list
      selectedIncome.get(0).click();
      listIncome.get(2).click();
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Automatic');

      // input attributes, as defined in model and for the actual selected document
      var attrIncome=elementDocEntryIncome.all(by.css('.input'));
      expect(attrIncome.count()).toBe(2);
      expect(attrIncome.get(0).isDisplayed()).toBe(true);
      expect(attrIncome.get(1).isDisplayed()).toBe(false);

      var elementPanelIncome = pvi_validation_page.getPanelIncome();
      elementPanelIncome.getText().then(function(text){expect(text).toContain("Awaiting document")});

      pvi_validation_page.setAutomaticAmount(paysheet_amount);
      absolutePath = path.resolve(__dirname, paysheet_resource);
      ipsaImgList.get(2).sendKeys(absolutePath);

      browser.sleep(300);
      elementPanelIncome.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);
      // selected item has changed from automatic to real recognized type
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Paysheet');

      // and the introduced data has been moved from automatic model to real recognized type model
      expect(pvi_validation_page.getPaysheetAmount()).toContain(paysheet_amount);

      // Check the final expected results in the screen
      var elementPanelTitleIncome = pvi_validation_page.getPanelTitleIncome();
      elementPanelTitleIncome.getText().then(function(text){expect(text).toContain("Income Paysheet")});

      elementPanelIncome.getText().then(function(text){expect(text).toContain("Document received and identified")});
      var checkboxPanelNominaAll = elementPanelIncome.all(by.css('.glyphicon'));
      expect(checkboxPanelNominaAll.count()).toEqual(3);
      var checkboxPanelNominaKO = elementPanelIncome.all(by.css('.glyphicon-remove'));
      expect(checkboxPanelNominaKO.count()).toEqual(1);
      var checkboxPanelNominaOK = elementPanelIncome.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelNominaOK.count()).toEqual(2);

      // and the original introduced data has been removed
      // select item Automatic from list to check the data value
      selectedIncome.get(0).click();
      listIncome.get(2).click();
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Automatic');
      expect(pvi_validation_page.getAutomaticAmount()).toBe('');

    });

    it('should set an image to every drop area, show all complete results, click terminate and send is disabled', function() {
      var ipsaImgList = pvi_validation_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);
      var path = require('path');
      var absolutePath;

      // ********************************
      // Identity
      // ********************************
      var elementPanelTitleIdentity = pvi_validation_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification")});

      var elementPanelIdentity = pvi_validation_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Awaiting document")});

      // set only required Dni attribute to activate image
      pvi_validation_page.setDniPhone(identity_phone);

      absolutePath = path.resolve(__dirname, dni_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);

      // Check if only first image element has content.
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      //expect(items.get(0).getAttribute('src')).not.toBe(null);
      expect(items.get(0).isDisplayed()).toBe(true);
      expect(items.get(2).isDisplayed()).toBe(false);
      expect(items.get(4).isDisplayed()).toBe(false);

      browser.sleep(300);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification DNI")});
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Document received and identified")});

      var checkboxPanelTitleDni = elementPanelTitleIdentity.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelTitleDni.count()).toEqual(1);

      var checkboxPanelDni = elementPanelIdentity.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelDni.count()).toEqual(1);

      var inputList = elementPanelIdentity.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(4);

      expect(inputList.get(0).getAttribute('value')).toEqual('IGNASI');
      expect(inputList.get(1).getAttribute('value')).toEqual('CASANOAS TARAFA');
      expect(inputList.get(2).getAttribute('value')).toEqual('47871577K');
      expect(inputList.get(3).getAttribute('value')).toEqual('17/01/2019');

      // ********************************
      // Receipt
      // ********************************
      var elementPanelTitleReceipt = pvi_validation_page.getPanelTitleReceipt();
      elementPanelTitleReceipt.getText().then(function(text){expect(text).toContain("Receipts")});

      var elementPanelReceipt = pvi_validation_page.getPanelReceipt();
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Awaiting document")});

      pvi_validation_page.setBankReceiptAccount(bankreceipt_account);
      absolutePath = path.resolve(__dirname, bankreceipt_resource);
      ipsaImgList.get(1).sendKeys(absolutePath);

      // Check if only two first images has content
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      browser.sleep(300);
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Processing document")});
      browser.sleep(waitTimeOut);

      // ********************************
      // Income
      // ********************************
      var elementPanelTitleIncome = pvi_validation_page.getPanelTitleIncome();
      elementPanelTitleIncome.getText().then(function(text){expect(text).toContain("Income")});

      var elementPanelIncome = pvi_validation_page.getPanelIncome();
      elementPanelIncome.getText().then(function(text){expect(text).toContain("Awaiting document")});

      pvi_validation_page.setPaysheetAmount(paysheet_amount);
      absolutePath = path.resolve(__dirname, paysheet_resource);
      ipsaImgList.get(2).sendKeys(absolutePath);

      // Check if all three images has content
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      browser.sleep(300);
      elementPanelIncome.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);

      // Check the final expected results in the screen
      elementPanelTitleReceipt.getText().then(function(text){expect(text).toContain("Receipts Bank receipt")});
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Document received and identified")});
      var checkboxPanelJustificanteBancarioAll = elementPanelReceipt.all(by.css('.glyphicon'));
      expect(checkboxPanelJustificanteBancarioAll.count()).toEqual(3);
      var checkboxPanelJustificanteBancarioKO = elementPanelReceipt.all(by.css('.glyphicon-remove'));
      expect(checkboxPanelJustificanteBancarioKO.count()).toEqual(1);
      var checkboxPanelJustificanteBancarioOK = elementPanelReceipt.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelJustificanteBancarioOK.count()).toEqual(2);

      elementPanelTitleIncome.getText().then(function(text){expect(text).toContain("Income Paysheet")});
      elementPanelIncome.getText().then(function(text){expect(text).toContain("Document received and identified")});
      var checkboxPanelNominaAll = elementPanelIncome.all(by.css('.glyphicon'));
      expect(checkboxPanelNominaAll.count()).toEqual(3);
      var checkboxPanelNominaKO = elementPanelIncome.all(by.css('.glyphicon-remove'));
      expect(checkboxPanelNominaKO.count()).toEqual(1);
      var checkboxPanelNominaOK = elementPanelIncome.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelNominaOK.count()).toEqual(2);

      // Check expected icons by document type
      var checkboxDocumentAll = element.all(by.css('h3.glyphicon'));
      expect(checkboxDocumentAll.count()).toEqual(3);
      var checkboxDocumentAllOK = element.all(by.css('h3.glyphicon-ok'));
      expect(checkboxDocumentAllOK.count()).toEqual(1);
      var checkboxDocumentAllKO = element.all(by.css('h3.glyphicon-remove'));
      expect(checkboxDocumentAllKO.count()).toEqual(2);

      // docentry directive, check if introduced attributes are present, text and checkbox
      element.all(by.css('.input.docentry')).all(by.css('.form-control')).then(function(items) {
        expect(items.length).toBe(9);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
        expect(items[3].getAttribute('value')).toBe('');
        expect(items[4].getAttribute('value')).toBe('');
        expect(items[5].getAttribute('value')).toBe(identity_phone);
		expect(items[6].getAttribute('checked')).toBeFalsy();
		expect(items[7].getAttribute('value')).toBe(bankreceipt_account);
		expect(items[8].getAttribute('value')).toBe(paysheet_amount);

		// check docentry directive enabled items status
        expect(items[0].isEnabled()).toBe(false);
        expect(items[1].isEnabled()).toBe(false);
        expect(items[2].isEnabled()).toBe(false);
        expect(items[3].isEnabled()).toBe(false);
        expect(items[4].isEnabled()).toBe(false);
        expect(items[5].isEnabled()).toBe(false);
		expect(items[6].isEnabled()).toBe(false);
		expect(items[7].isEnabled()).toBe(true);
		expect(items[8].isEnabled()).toBe(true);
      });

      // Check expected buttons state
      expect(element(by.buttonText('New')).isEnabled()).toBe(true);
      expect(element(by.buttonText('Cancel')).isEnabled()).toBe(true);
      expect(element(by.buttonText('Terminate')).isEnabled()).toBe(true);
      expect(element(by.buttonText('Send PVI')).isEnabled()).toBe(false);

      pvi_validation_page.clickTerminateButton();

      expect(element(by.buttonText('New')).isEnabled()).toBe(true);
      expect(element(by.buttonText('Cancel')).isEnabled()).toBe(true);
      expect(element(by.buttonText('Terminate')).isEnabled()).toBe(false);
      expect(element(by.buttonText('Send PVI')).isEnabled()).toBe(false);

    });


    xit('should set an image to every drop area, show all complete results, click terminate and click send', function() {
      var ipsaImgList = pvi_validation_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);
      var path = require('path');
      var absolutePath;

      // ********************************
      // Identity
      // ********************************
      var elementPanelTitleIdentity = pvi_validation_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification")});

      var elementPanelIdentity = pvi_validation_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Awaiting document")});

      // set both Dni attributes to activate image and send
      pvi_validation_page.setDniPhone(identity_phone);
      pvi_validation_page.setDniUserAuthorization();

      absolutePath = path.resolve(__dirname, dni_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);

      // Check if only first image element has content.
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      //expect(items.get(0).getAttribute('src')).not.toBe(null);
      expect(items.get(0).isDisplayed()).toBe(true);
      expect(items.get(2).isDisplayed()).toBe(false);
      expect(items.get(4).isDisplayed()).toBe(false);

      browser.sleep(300);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification DNI")});
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Document received and identified")});

      var checkboxPanelTitleDni = elementPanelTitleIdentity.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelTitleDni.count()).toEqual(1);

      var checkboxPanelDni = elementPanelIdentity.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelDni.count()).toEqual(1);

      var inputList = elementPanelIdentity.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(4);

      expect(inputList.get(0).getAttribute('value')).toEqual('IGNASI');
      expect(inputList.get(1).getAttribute('value')).toEqual('CASANOAS TARAFA');
      expect(inputList.get(2).getAttribute('value')).toEqual('47871577K');
      expect(inputList.get(3).getAttribute('value')).toEqual('17/01/2019');

      // ********************************
      // Receipt
      // ********************************
      var elementPanelTitleReceipt = pvi_validation_page.getPanelTitleReceipt();
      elementPanelTitleReceipt.getText().then(function(text){expect(text).toContain("Receipts")});

      var elementPanelReceipt = pvi_validation_page.getPanelReceipt();
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Awaiting document")});

      pvi_validation_page.setBankReceiptAccount(bankreceipt_account);
      absolutePath = path.resolve(__dirname, bankreceipt_resource);
      ipsaImgList.get(1).sendKeys(absolutePath);

      // Check if only two first images has content
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      browser.sleep(300);
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Processing document")});
      browser.sleep(waitTimeOut);

      // ********************************
      // Income
      // ********************************
      var elementPanelTitleIncome = pvi_validation_page.getPanelTitleIncome();
      elementPanelTitleIncome.getText().then(function(text){expect(text).toContain("Income")});

      var elementPanelIncome = pvi_validation_page.getPanelIncome();
      elementPanelIncome.getText().then(function(text){expect(text).toContain("Awaiting document")});

      pvi_validation_page.setPaysheetAmount(paysheet_amount);
      absolutePath = path.resolve(__dirname, paysheet_resource);
      ipsaImgList.get(2).sendKeys(absolutePath);

      // Check if all three images has content
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      browser.sleep(300);
      elementPanelIncome.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);

      // Check the final expected results in the screen
      elementPanelTitleReceipt.getText().then(function(text){expect(text).toContain("Receipts Bank receipt")});
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Document received and identified")});
      var checkboxPanelJustificanteBancarioAll = elementPanelReceipt.all(by.css('.glyphicon'));
      expect(checkboxPanelJustificanteBancarioAll.count()).toEqual(3);
      var checkboxPanelJustificanteBancarioKO = elementPanelReceipt.all(by.css('.glyphicon-remove'));
      expect(checkboxPanelJustificanteBancarioKO.count()).toEqual(1);
      var checkboxPanelJustificanteBancarioOK = elementPanelReceipt.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelJustificanteBancarioOK.count()).toEqual(2);

      elementPanelTitleIncome.getText().then(function(text){expect(text).toContain("Income Paysheet")});
      elementPanelIncome.getText().then(function(text){expect(text).toContain("Document received and identified")});
      var checkboxPanelNominaAll = elementPanelIncome.all(by.css('.glyphicon'));
      expect(checkboxPanelNominaAll.count()).toEqual(3);
      var checkboxPanelNominaKO = elementPanelIncome.all(by.css('.glyphicon-remove'));
      expect(checkboxPanelNominaKO.count()).toEqual(1);
      var checkboxPanelNominaOK = elementPanelIncome.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelNominaOK.count()).toEqual(2);

      // Check expected icons by document type
      var checkboxDocumentAll = element.all(by.css('h3.glyphicon'));
      expect(checkboxDocumentAll.count()).toEqual(3);
      var checkboxDocumentAllOK = element.all(by.css('h3.glyphicon-ok'));
      expect(checkboxDocumentAllOK.count()).toEqual(1);
      var checkboxDocumentAllKO = element.all(by.css('h3.glyphicon-remove'));
      expect(checkboxDocumentAllKO.count()).toEqual(2);

      // docentry directive, check if introduced attributes are present, text and checkbox
      element.all(by.css('.input.docentry')).all(by.css('.form-control')).then(function(items) {
        expect(items.length).toBe(9);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
        expect(items[3].getAttribute('value')).toBe('');
        expect(items[4].getAttribute('value')).toBe('');
        expect(items[5].getAttribute('value')).toBe(identity_phone);
		expect(items[6].getAttribute('checked')).toBeTruthy();
		expect(items[7].getAttribute('value')).toBe(bankreceipt_account);
		expect(items[8].getAttribute('value')).toBe(paysheet_amount);

		// check docentry directive enabled items status
        expect(items[0].isEnabled()).toBe(false);
        expect(items[1].isEnabled()).toBe(false);
        expect(items[2].isEnabled()).toBe(false);
        expect(items[3].isEnabled()).toBe(false);
        expect(items[4].isEnabled()).toBe(false);
        expect(items[5].isEnabled()).toBe(false);
		expect(items[6].isEnabled()).toBe(false);
		expect(items[7].isEnabled()).toBe(true);
		expect(items[8].isEnabled()).toBe(true);
      });

      // Check expected buttons state
      expect(true).toBe(element(by.buttonText('New')).isEnabled());
      expect(true).toBe(element(by.buttonText('Cancel')).isEnabled());
      expect(true).toBe(element(by.buttonText('Terminate')).isEnabled());
      expect(false).toBe(element(by.buttonText('Send PVI')).isEnabled());

      pvi_validation_page.clickTerminateButton();
      browser.sleep(6000);

      expect(true).toBe(element(by.buttonText('New')).isEnabled());
      expect(true).toBe(element(by.buttonText('Cancel')).isEnabled());
      expect(false).toBe(element(by.buttonText('Terminate')).isEnabled());
      expect(true).toBe(element(by.buttonText('Send PVI')).isEnabled());

      pvi_validation_page.clickSendButton();

      expect('Edit validations').toBe(pvi_validation_page.getModalTittle().getText());

      //validations DNI

      element.all(by.css('.panel-success')).then(function(items) {
        expect(5).toBe(items.length);
            items[0].all(by.css('.panel-heading')).then(function(items0) {
                expect(1).toBe(items0.length);
                expect('Operation OK').toBe(items0[0].getText());
            });

            items[1].all(by.css('.panel-heading')).then(function(items1) {
                expect(1).toBe(items1.length);
                expect('DNI back side OK').toBe(items1[0].getText());
            });


            items[1].all(by.css('.panel-body')).all(by.css('.ng-scope')).then(function(items1b) {
                expect(8).toBe(items1b.length);
                expect('The identification number has been recognized.').toBe(items1b[0].getText());
                expect("The document is not expired.").toBe(items1b[1].getText());
                expect('The identification number entered by the user on the front of the document matches what was recognized on the back side.').toBe(items1b[2].getText());
                expect('The name entered by the user on the front of the document matches what has been recognized on the back side.').toBe(items1b[3].getText());
                expect('The surname entered by the user on the front of the document matches what has been recognized on the back side.').toBe(items1b[4].getText());
                expect('The birthdate entered by the user on the front of the document matches what has been recognized on the back side.').toBe(items1b[5].getText());
                expect('The expiration date entered by the user on the front of the document matches what has been recognized on the back side.').toBe(items1b[6].getText());
                expect('Metadata does not show document manipulations.').toBe(items1b[7].getText());

            });

                expect('glyphicon glyphicon-ok text-success').toBe(items[1].element(by.id('val-VALIDATION_EXPIRATION_DATE')).getAttribute('class'));
                expect('glyphicon glyphicon-ok text-success').toBe(items[1].element(by.id('val-VALIDATION_SYSTEM_IDENTIFICATION_NUMBER_VS_BACK')).getAttribute('class'));
                expect('glyphicon glyphicon-ok text-success').toBe(items[1].element(by.id('val-VALIDATION_SYSTEM_FIRST_NAME_VS_BACK')).getAttribute('class'));
                expect('glyphicon glyphicon-ok text-success').toBe(items[1].element(by.id('val-VALIDATION_SYSTEM_LAST_NAME_VS_BACK')).getAttribute('class'));
                expect('glyphicon glyphicon-ok text-success').toBe(items[1].element(by.id('val-VALIDATION_SYSTEM_BIRTHDATE_VS_BACK')).getAttribute('class'));
                expect('glyphicon glyphicon-ok text-success').toBe(items[1].element(by.id('val-VALIDATION_SYSTEM_EXPIRATION_DATE_VS_BACK')).getAttribute('class'));
                expect('glyphicon glyphicon-ok text-success').toBe(items[1].element(by.id('val-VALIDATION_SYSTEM_EXPIRATION_DATE_VS_BACK')).getAttribute('class'));
                expect('glyphicon glyphicon-ok text-success').toBe(items[1].element(by.id('val-VALIDATION_METADATA')).getAttribute('class'));


            //validations bank receipt
            items[2].all(by.css('.panel-heading')).then(function(items2) {
                expect(1).toBe(items2.length);
                expect('Bank receipt OK').toBe(items2[0].getText());
            });

            items[2].all(by.css('.panel-body')).all(by.css('.ng-scope')).then(function(item2b) {
                expect(5).toBe(item2b.length);
                expect('The identification number exists in the recognized text.').toBe(item2b[0].getText());
                expect('The name exists in the recognized text.').toBe(item2b[1].getText());
                expect('The surname exists in the recognized text.').toBe(item2b[2].getText());
                expect('The account number exists in the recognized text.').toBe(item2b[3].getText());
                expect('Metadata does not show document manipulations.').toBe(item2b[4].getText());

            });


            expect('glyphicon glyphicon-ok text-success').toBe(items[2].element(by.id('val-VALIDATION_DNI_NUMBER')).getAttribute('class'));
            expect('glyphicon glyphicon-remove text-danger').toBe(items[2].element(by.id('val-VALIDATION_FIRST_NAME')).getAttribute('class'));
            expect('glyphicon glyphicon-remove text-danger').toBe(items[2].element(by.id('val-VALIDATION_LAST_NAME')).getAttribute('class'));
            expect('glyphicon glyphicon-ok text-success').toBe(items[2].element(by.id('val-VALIDATION_ACCOUNT_NUMBER')).getAttribute('class'));
            expect('glyphicon glyphicon-ok text-success').toBe(items[2].element(by.id('val-VALIDATION_METADATA')).getAttribute('class'));


            //validations paysheet
            items[3].all(by.css('.panel-heading')).then(function(item3) {
                expect(1).toBe(item3.length);
                expect('Paysheet OK').toBe(item3[0].getText());
            });

            items[3].all(by.css('.panel-body')).all(by.css('.ng-scope')).then(function(item3b) {
                expect(12).toBe(item3b.length);
                expect('The identification number exists in the recognized text.').toBe(item3b[0].getText());
                expect('The name exists in the recognized text.').toBe(item3b[1].getText());
                expect('The surname exists in the recognized text.').toBe(item3b[2].getText());
                expect('The amount exists in the recognized text.').toBe(item3b[3].getText());
                expect('The paysheet date period exists in the recognized text.').toBe(item3b[4].getText());
                expect('The paysheet quotation exists in the recognized text.').toBe(item3b[5].getText());
                expect('The seizures not exists in the recognized text.').toBe(item3b[6].getText());
                expect('The passive rights exists in the recognized text.').toBe(item3b[7].getText());
                expect('The seniority date exists in the recognized text.').toBe(item3b[8].getText());
                expect('The bussines name exists in the recognized text.').toBe(item3b[9].getText());
                expect('The bussines CIF exists in the recognized text.').toBe(item3b[10].getText());
                expect('Metadata does not show document manipulations.').toBe(item3b[11].getText());


            });

            expect('glyphicon glyphicon-ok text-success').toBe(items[3].element(by.id('val-VALIDATION_DNI_NUMBER')).getAttribute('class'));
            expect('glyphicon glyphicon-remove text-danger').toBe(items[3].element(by.id('val-VALIDATION_FIRST_NAME')).getAttribute('class'));
            expect('glyphicon glyphicon-remove text-danger').toBe(items[3].element(by.id('val-VALIDATION_LAST_NAME')).getAttribute('class'));
            expect('glyphicon glyphicon-ok text-success').toBe(items[3].element(by.id('val-VALIDATION_AMOUNT')).getAttribute('class'));
            expect('glyphicon glyphicon-remove text-danger').toBe(items[3].element(by.id('val-VALIDATION_DATE_PERIOD')).getAttribute('class'));
            expect('glyphicon glyphicon-remove text-danger').toBe(items[3].element(by.id('val-VALIDATION_PERCENT_QUOTATION')).getAttribute('class'));
            expect('glyphicon glyphicon-ok text-success').toBe(items[3].element(by.id('val-VALIDATION_SEIZURES')).getAttribute('class'));
            expect('glyphicon glyphicon-remove text-danger').toBe(items[3].element(by.id('val-VALIDATION_PASSIVE_RIGHTS')).getAttribute('class'));
            expect('glyphicon glyphicon-remove text-danger').toBe(items[3].element(by.id('val-VALIDATION_SENIORITY_DATE')).getAttribute('class'));
            expect('glyphicon glyphicon-remove text-danger').toBe(items[3].element(by.id('val-VALIDATION_BUSINESS_NAME')).getAttribute('class'));
            expect('glyphicon glyphicon-remove text-danger').toBe(items[3].element(by.id('val-VALIDATION_CIF_BUSINESS')).getAttribute('class'));
            expect('glyphicon glyphicon-ok text-success').toBe(items[3].element(by.id('val-VALIDATION_METADATA')).getAttribute('class'));
      });


      pvi_validation_page.clickPviModalOk();

      expect('Failed to send operation to PVI.').toBe(pvi_validation_page.getModalMessage());

      pvi_validation_page.clickModalOk();

      pvi_validation_page.clickSendButton();

      pvi_validation_page.putOKValidations();

      pvi_validation_page.clickPviModalOk();
      browser.sleep(5000);

      expect('Operation successfully send to PVI.').toBe(pvi_validation_page.getModalMessage());
      pvi_validation_page.clickModalOk();


    });

  });


  function init_test() {
    browser.sleep(500);
    browser.get('http://localhost:8083/');
    browser.manage().window().maximize();
    try {
      element(by.css('.glyphicon-log-out')).isDisplayed().then(function (isVisible) {
        if (isVisible) {
          pvi_validation_page.logOut();
          browser.sleep(1500);
        }
      });
    } catch (e) {
      console.log("init_test exception:"+e);
    }

    browser.sleep(500);
    browser.get('http://localhost:8083/');
  };

});

