'use strict';

describe('IdentityDemoApp', function() {
  var login_page;              
  var identity_page;  
  var waitTimeOut = 18000;

  login_page = require('./page/login_page.js');                
  identity_page = require('./page/identity_page.js');                      

  beforeEach(function() {
    init_test();
  });

  describe('Identity page', function() {

    /*****************************************************************************
      Note: all test results are based in the plugin OCR named 'OCRPluginTest'.
    ******************************************************************************/
   
    beforeEach(function() {
      login_page.selectLanguage('Inglés');
      login_page.selectProduct('Identity Validation');
      identity_page = login_page.loginAsAdmin('IdentityApp');
    });

    afterEach(function() {
      login_page.selectLanguage('Spanish');
      identity_page.logOut();
    });

    it('should able on correct page', function() {
      expect(identity_page.getCurrentUrl()).toEqual("http://localhost:8083/identityDemo");
    });

    it('should get the entire empty page', function() {
      expect(identity_page.getPanelTitle()).toBe('Identity Validation');

      // docentry directive, 5 configured input attributes, 5 created but only 4 are visibles. Method 1
      element.all(by.css('.input.docentry')).all(by.css('.form-control')).then(function(items) {      
        expect(items.length).toBe(5);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
        expect(items[3].getAttribute('value')).toBe('');
        expect(items[4].getAttribute('value')).toBe('');
      });

 	    // docentry directive, 5 configured input attributes, 5 created but only 4 are visibles. Method 2
	    expect(element.all(by.repeater('field in selected.fields')).count()).toBe(5);

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


      // validation directive, all configured validations in this page. Method 1
      element.all(by.css('.glyphicon.validation')).then(function(items) {
        expect(items.length).toBe(3);
        expect(items[0].getAttribute('class')).toContain('glyphicon');        
      });
 	  
 	    // validation directive, all configured validations in this page. Method 2
	    expect(element.all(by.repeater('(key, value) in validations')).count()).toBe(3);	  

	    // validation directive, only configured validations in this directive. Method 2
      var elementPanelIdentity = identity_page.getPanelIdentity();
      var validationsIdentity = elementPanelIdentity.all(by.css('.glyphicon.validation'));
      expect(validationsIdentity.count()).toEqual(1);

	    // validation directive, only configured validations in this directive. Method 2
      var elementPanelSignature = identity_page.getPanelSignature();      
      var validationsSignature = elementPanelIdentity.all(by.css('.glyphicon.validation'));
      expect(validationsSignature.count()).toEqual(1);


      expect(element(by.buttonText('New')).isEnabled()).toBe(true);
      expect(element(by.buttonText('Cancel')).isEnabled()).toBe(false);
      expect(element(by.buttonText('Terminate')).isEnabled()).toBe(false);

      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      expect(items.get(0).isDisplayed()).toBe(false);
      expect(items.get(1).isDisplayed()).toBe(false);
      expect(items.get(2).isDisplayed()).toBe(false);

      // Check if all three image control are disabled
      element.all(by.css('.drop-box-container')).then(function(items) { 
        expect(items.length).toBe(3);
      });

      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {      
        expect(items.length).toBe(3);
      });

    });


    it('should obtain all three ipsa img elements in identity page', function() {
      element.all(by.css('.drop-box')).then(function(items) { 
        expect(items.length).toBe(3);
      }); 
    });


    it('should obtain ipsa img element by index', function() {
      var item = identity_page.getIpsaImgByIndex(0);
      expect(item).not.toBe(null); 
    });


    it('should obtain ipsa img element by Id', function() {
      var id = 'ipsa-image-BACK_LABEL';
      expect(element(by.id(id)).isPresent()).toBe(true);      

      var item = identity_page.getIpsaImgById(id);
      expect(item).not.toBe(null);
      expect(item.isPresent()).toBe(true);   

      id = 'ipsa-image-FRONT_LABEL';
      expect(element(by.id(id)).isPresent()).toBe(true);      

      item = identity_page.getIpsaImgById(id);
      expect(item).not.toBe(null);
      expect(item.isPresent()).toBe(true);   

      id = 'ipsa-image-SIGNATURE_CARD_LABEL';
      expect(element(by.id(id)).isPresent()).toBe(true);      

      item = identity_page.getIpsaImgById(id);
      expect(item).not.toBe(null);
      expect(item.isPresent()).toBe(true);   
    });


    it('should set attributes values and set an image to Dni Back drop area and then show ocr-test recognition', function() {
      var elementPanelIdentity = identity_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Awaiting document")});

      var ipsaImgList = identity_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);

      // all three image controls are disabled before entering required fields
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {      
        expect(items.length).toBe(3);
      });

      // set de Dni back attributes
      identity_page.setDniNumber('47871577K');
      identity_page.setDniFirstName('IGNASI');
      identity_page.setDniLastName('CASANOAS TARAFA');
      identity_page.setDniBirthdate('01/01/1986');

      // and now only two docentry image controls are disabled after introduce required fields
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) { 
        expect(items.length).toBe(2);
      });

      // set the Dni Back image.
      var path = require('path');
      var absolutePath = path.resolve(__dirname, "./resources/Dni_reverso.jpg");
      ipsaImgList.get(0).sendKeys(absolutePath);
      
      // Check if only first image element has content
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      expect(items.get(0).isDisplayed()).toBe(true);
      expect(items.get(1).isDisplayed()).toBe(false); 
      expect(items.get(2).isDisplayed()).toBe(false);

      browser.sleep(300);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Processing document")});

      // after send Dni Back image, itself is locked, and the other two docentry images are enabled
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) { 
        expect(items.length).toBe(1);
      });

      browser.sleep(waitTimeOut);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Document received and identified")});

      var elementPanelTitleIdentity = identity_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification document")});

      var checkboxPanelTitleDni = elementPanelTitleIdentity.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelTitleDni.count()).toEqual(1);

      var inputList = elementPanelIdentity.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(4);

      // Note: The result of getText from an input element is always empty.
      expect(inputList.get(0).getAttribute('value')).toEqual('IGNASI');
      expect(inputList.get(1).getAttribute('value')).toEqual('CASANOAS TARAFA');
      expect(inputList.get(2).getAttribute('value')).toEqual('47871577K');
      expect(inputList.get(3).getAttribute('value')).toEqual('01/01/1986');

      var allPanelIdentityIconsOK = elementPanelIdentity.all(by.css('.glyphicon-ok.text-success'));
      expect(allPanelIdentityIconsOK.count()).toEqual(5);

      var checkListOK = elementPanelIdentity.all(by.css('.checklist.glyphicon-ok.text-success'));
      expect(checkListOK.count()).toEqual(3);

      var checkListKO = elementPanelIdentity.all(by.css('.checklist.glyphicon-remove.text-danger'));
      expect(checkListKO.count()).toEqual(1);

	    // validation directive, only configured validations in this directive.
      var validationsIdentity = elementPanelIdentity.all(by.css('.glyphicon.validation'));
      expect(validationsIdentity.count()).toEqual(1);

      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Expiration date")});      
    });


    it('should synchronize front type when select back type and do not allow change it', function() {

      // ********************************
      // DocEntry Identity Back
      // ********************************      
      var elementDocEntryBackIdentity = identity_page.getDocEntryBackIdentity();
      elementDocEntryBackIdentity.getText().then(function(text){expect(text).toContain('Back')});

      // initial selected item
      var selectedBackIdentity=elementDocEntryBackIdentity.all(by.css('.navbar-nav > li > a'));
      expect(selectedBackIdentity.count()).toBe(1);
      expect(selectedBackIdentity.get(0).getAttribute('innerText')).toContain('DNI');

      // list item
      var listBackIdentity=elementDocEntryBackIdentity.all(by.css('.dropdown-menu > li > a'));
      expect(listBackIdentity.count()).toBe(3);
      expect(listBackIdentity.get(0).getAttribute('value')).toBe('DNI_LABEL');
      expect(listBackIdentity.get(0).getAttribute('innerText')).toContain('DNI');
      expect(listBackIdentity.get(1).getAttribute('value')).toBe('NIE_LABEL');
      expect(listBackIdentity.get(1).getAttribute('innerText')).toContain('NIE');
      expect(listBackIdentity.get(2).getAttribute('value')).toBe('PASSPORT_LABEL');
      expect(listBackIdentity.get(2).getAttribute('innerText')).toContain('Passport');

      // ********************************
      // DocEntry Identity Front
      // ********************************      
      var elementDocEntryFrontIdentity = identity_page.getDocEntryFrontIdentity();
      elementDocEntryFrontIdentity.getText().then(function(text){expect(text).toContain('Front')});

      // initial selected item
      var selectedFrontIdentity=elementDocEntryFrontIdentity.all(by.css('.navbar-nav > li > a'));
      expect(selectedFrontIdentity.count()).toBe(1);
      expect(selectedFrontIdentity.get(0).getAttribute('innerText')).toContain('DNI Front');

      // list item
      var listFrontIdentity=elementDocEntryFrontIdentity.all(by.css('.dropdown-menu > li > a'));
      expect(listFrontIdentity.count()).toBe(2);
      expect(listFrontIdentity.get(0).getAttribute('value')).toBe('DNI_FRONT_LABEL');
      expect(listFrontIdentity.get(0).getAttribute('innerText')).toContain('DNI Front');
      expect(listFrontIdentity.get(1).getAttribute('value')).toBe('NIE_FRONT_LABEL');
      expect(listFrontIdentity.get(1).getAttribute('innerText')).toContain('NIE Front');

      // ********************************
      // Change DocEntry Identity Back
      // ********************************            
      // select second item from list
      selectedBackIdentity.get(0).click();
      listBackIdentity.get(1).click();
      expect(selectedBackIdentity.get(0).getAttribute('innerText')).toContain('NIE');

      // Identity Front must be changed
      expect(selectedFrontIdentity.get(0).getAttribute('innerText')).toContain('NIE Front');

      // not possible to change Identity Front type because select is not visible
      expect(selectedFrontIdentity.get(0).getAttribute('class')).toContain('not-allowed');

      // try to select second item from list, it can not
      selectedFrontIdentity.get(0).click();
      expect(listFrontIdentity.get(0).isDisplayed()).toBe(false);

      // ********************************
      // Change DocEntry Identity Back
      // ********************************            
      // select third item from list
      selectedBackIdentity.get(0).click();
      listBackIdentity.get(2).click();
      expect(selectedBackIdentity.get(0).getAttribute('innerText')).toContain('Passport');

      // Identity Front must be changed to empty
	    expect(selectedFrontIdentity.get(0).getAttribute('innerText')).toMatch('');

      // not possible to change Identity Front type because select is not visible
      expect(selectedFrontIdentity.get(0).getAttribute('class')).toContain('not-allowed');

      // try to select second item from list, it can not
      selectedFrontIdentity.get(0).click();
      expect(listFrontIdentity.get(0).isDisplayed()).toBe(false);
    });


    it('should clear the entire page when click on New Operation button', function() {
      var elementPanelIdentity = identity_page.getPanelIdentity();
      var ipsaImgList = identity_page.getAllIpsaImg();

      // set de Dni back attributes
      identity_page.setDniNumber('47871577K');
      identity_page.setDniFirstName('IGNASI');
      identity_page.setDniLastName('CASANOAS TARAFA');
      identity_page.setDniBirthdate('01/01/1986');

      // set the Dni Back image.
      var path = require('path');
      var absolutePath = path.resolve(__dirname, "./resources/Dni_reverso.jpg");
      ipsaImgList.get(0).sendKeys(absolutePath);
      browser.sleep(waitTimeOut);

	    // validation directive
      var inputList = elementPanelIdentity.all(by.css('input[type="text"]'));
      expect(inputList.get(0).getAttribute('value')).toEqual('IGNASI');
      expect(inputList.get(1).getAttribute('value')).toEqual('CASANOAS TARAFA');
      expect(inputList.get(2).getAttribute('value')).toEqual('47871577K');
      expect(inputList.get(3).getAttribute('value')).toEqual('01/01/1986');

      identity_page.clickNewOpButton();

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

      // docentry directive
      expect(identity_page.getDniNumber()).toBe('');
      expect(identity_page.getDniFirstName()).toBe('');
      expect(identity_page.getDniLastName()).toBe('');
      expect(identity_page.getDniBirthdate()).toBe('');

      var items = element.all(by.css('.thumb')); 
      expect(items.count()).toEqual(6);
      expect(items.get(0).isDisplayed()).toBe(false);
      expect(items.get(1).isDisplayed()).toBe(false);
      expect(items.get(2).isDisplayed()).toBe(false);

      // Check if all three image control are disabled
      element.all(by.css('.drop-box-container')).then(function(items) { 
        expect(items.length).toBe(3);
      });

      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) { 
        expect(items.length).toBe(3);
      });
    });


    it('should clear the entire page when click on Cancel button', function() {
      var elementPanelIdentity = identity_page.getPanelIdentity();
      var ipsaImgList = identity_page.getAllIpsaImg();

      // set de Dni back attributes
      identity_page.setDniNumber('47871577K');
      identity_page.setDniFirstName('IGNASI');
      identity_page.setDniLastName('CASANOAS TARAFA');
      identity_page.setDniBirthdate('01/01/1986');

      // set the Dni Back image.
      var path = require('path');
      var absolutePath = path.resolve(__dirname, "./resources/Dni_reverso.jpg");
      ipsaImgList.get(0).sendKeys(absolutePath);
      browser.sleep(waitTimeOut);

	    // validation directive
      var inputList = elementPanelIdentity.all(by.css('input[type="text"]'));
      expect(inputList.get(0).getAttribute('value')).toEqual('IGNASI');
      expect(inputList.get(1).getAttribute('value')).toEqual('CASANOAS TARAFA');
      expect(inputList.get(2).getAttribute('value')).toEqual('47871577K');
      expect(inputList.get(3).getAttribute('value')).toEqual('01/01/1986');

      identity_page.clickCancelButton();

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

      // docentry directive
      expect(identity_page.getDniNumber()).toBe('');
      expect(identity_page.getDniFirstName()).toBe('');
      expect(identity_page.getDniLastName()).toBe('');
      expect(identity_page.getDniBirthdate()).toBe('');

      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      expect(items.get(0).isDisplayed()).toBe(false);
      expect(items.get(2).isDisplayed()).toBe(false);
      expect(items.get(4).isDisplayed()).toBe(false);

      // Check if all three image control are disabled
      element.all(by.css('.drop-box-container')).then(function(items) {
        expect(items.length).toBe(3);
      });

      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(3);
      });      
    });


    it('should show modal message when only Dni Back document is loaded and click on Terminate button', function() {
      var ipsaImgList = identity_page.getAllIpsaImg();

      // set de Dni back attributes
      identity_page.setDniNumber('47871577K');
      identity_page.setDniFirstName('IGNASI');
      identity_page.setDniLastName('CASANOAS TARAFA');
      identity_page.setDniBirthdate('01/01/1986');

      // set the Dni Back image.
      var path = require('path');
      var absolutePath = path.resolve(__dirname, "./resources/Dni_reverso.jpg");
      ipsaImgList.get(0).sendKeys(absolutePath);
      
      expect(element(by.buttonText('Terminate')).isEnabled()).toBe(true);
      identity_page.clickTerminateButton();
      expect(identity_page.getModalMessage()).toBe('There are missing documents');
      browser.sleep(3000);
      identity_page.clickModalOk();
    });      


    it('should set an image to every drop area and show all complete results', function() {
      var ipsaImgList = identity_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);
      var path = require('path');
      var absolutePath;

      var elementPanelTitleIdentity = identity_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification document")});

      var elementPanelIdentity = identity_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Awaiting document")});

      // all three image controls are disabled
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(3);
      });

      // ********************************
      // Identity Back
      // ********************************      
      // set de Dni Back attributes
      identity_page.setDniNumber('47871577K');
      identity_page.setDniFirstName('IGNASI');
      identity_page.setDniLastName('CASANOAS TARAFA');
      identity_page.setDniBirthdate('01/01/1986');

      // and now only two image controls are disabled after introduce required fields
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(2);
      });

      // set the Dni Back image.
      absolutePath = path.resolve(__dirname, "./resources/Dni_reverso.jpg");
      ipsaImgList.get(0).sendKeys(absolutePath);
      
      // Check if only first image element has content.
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      expect(items.get(0).isDisplayed()).toBe(true);
      expect(items.get(2).isDisplayed()).toBe(false);
      expect(items.get(4).isDisplayed()).toBe(false);

      browser.sleep(300);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);

      var elementPanelTitleIdentity = identity_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification document DNI")});

      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Document received and identified")});

      var checkboxPanelTitleDni = elementPanelTitleIdentity.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelTitleDni.count()).toEqual(1);

      var inputList = elementPanelIdentity.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(4);

      // Note: The result of getText from an input element is always empty.
      expect(inputList.get(0).getAttribute('value')).toEqual('IGNASI');
      expect(inputList.get(1).getAttribute('value')).toEqual('CASANOAS TARAFA');
      expect(inputList.get(2).getAttribute('value')).toEqual('47871577K');
      expect(inputList.get(3).getAttribute('value')).toEqual('01/01/1986');

      var allPanelIdentityIconsOK = elementPanelIdentity.all(by.css('.glyphicon-ok.text-success'));
      expect(allPanelIdentityIconsOK.count()).toEqual(5);

      var checkListOK = elementPanelIdentity.all(by.css('.checklist.glyphicon-ok.text-success'));
      expect(checkListOK.count()).toEqual(3);

      var checkListKO = elementPanelIdentity.all(by.css('.checklist.glyphicon-remove.text-danger'));
      expect(checkListKO.count()).toEqual(1);

	    // validation directive, only configured validations in this directive.
      var validationsIdentity = elementPanelIdentity.all(by.css('.glyphicon.validation'));
      expect(validationsIdentity.count()).toEqual(1);

      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Expiration date")});      

      var elementPanelSignature = identity_page.getPanelSignature();
      elementPanelSignature.getText().then(function(text){expect(text).toContain("Awaiting document")});

      // ********************************
      // Identity Front
      // ********************************
      // set the Dni Front image.
      absolutePath = path.resolve(__dirname, "./resources/Dni_anverso.jpg");
      ipsaImgList.get(1).sendKeys(absolutePath);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Document received and identified")});

      browser.sleep(waitTimeOut);

      var allPanelIdentityIconsOK = elementPanelIdentity.all(by.css('.glyphicon-ok.text-success'));
      expect(allPanelIdentityIconsOK.count()).toEqual(6);

      var checkListOK = elementPanelIdentity.all(by.css('.checklist.glyphicon-ok.text-success'));
      expect(checkListOK.count()).toEqual(4);

      var checkListKO = elementPanelIdentity.all(by.css('.checklist.glyphicon-remove.text-danger'));
      expect(checkListKO.count()).toEqual(4);

      // ********************************
      // Signature
      // ********************************      
      var elementPanelTitleSignature = identity_page.getPanelTitleSignature();
      elementPanelTitleSignature.getText().then(function(text){expect(text).toContain("Signature Card")});
      elementPanelSignature.getText().then(function(text){expect(text).toContain("Awaiting document")});

      absolutePath = path.resolve(__dirname, "./resources/Boleta.jpg");
      ipsaImgList.get(2).sendKeys(absolutePath);

      browser.sleep(300);
      elementPanelSignature.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);

      elementPanelTitleSignature.getText().then(function(text){expect(text).toContain("Signature Card")});
      var allPanelSignatureIconsOK = elementPanelSignature.all(by.css('.glyphicon-ok.text-success'));
      expect(allPanelSignatureIconsOK.count()).toEqual(3);

	    // validation directive, only configured validations in this directive.
      var validationsSignature = elementPanelSignature.all(by.css('.glyphicon.validation'));
      expect(validationsSignature.count()).toEqual(2);

      elementPanelSignature.getText().then(function(text){expect(text).toContain("Has sender sign")});
      elementPanelSignature.getText().then(function(text){expect(text).toContain("Has agent sign")});

      // Check all expected icons by document type
      var checkboxDocumentAll = element.all(by.css('h3.glyphicon'));
      expect(checkboxDocumentAll.count()).toEqual(2);
      var checkboxDocumentAllOK = element.all(by.css('h3.glyphicon-ok'));
      expect(checkboxDocumentAllOK.count()).toEqual(2);

    });


    it('should have been loaded the title and the different document types and fields in every docentry selector', function() {

      // ********************************
      // Docentry Identity Back
      // ********************************      
      var elementDocEntryBackIdentity = identity_page.getDocEntryBackIdentity();
      elementDocEntryBackIdentity.getText().then(function(text){expect(text).toContain('Back')});      

      // initial selected item
      var selectedBackIdentity=elementDocEntryBackIdentity.all(by.css('.navbar-nav > li > a'));            
      expect(selectedBackIdentity.count()).toBe(1);
      expect(selectedBackIdentity.get(0).getAttribute('innerText')).toContain('DNI');

      // list item
      var listBackIdentity=elementDocEntryBackIdentity.all(by.css('.dropdown-menu > li > a'));      
      expect(listBackIdentity.count()).toBe(3);
      expect(listBackIdentity.get(0).getAttribute('value')).toBe('DNI_LABEL');      
      expect(listBackIdentity.get(0).getAttribute('innerText')).toContain('DNI');
      expect(listBackIdentity.get(1).getAttribute('value')).toBe('NIE_LABEL');      
      expect(listBackIdentity.get(1).getAttribute('innerText')).toContain('NIE');
      expect(listBackIdentity.get(2).getAttribute('value')).toBe('PASSPORT_LABEL');      
      expect(listBackIdentity.get(2).getAttribute('innerText')).toContain('Passport');

      // input attributes, as defined in model and for the actual selected document
      var attrBackIdentity=elementDocEntryBackIdentity.all(by.css('.input'));
      expect(attrBackIdentity.count()).toBe(5);
      expect(attrBackIdentity.get(0).isDisplayed()).toBe(true);
      expect(attrBackIdentity.get(1).isDisplayed()).toBe(true);
      expect(attrBackIdentity.get(2).isDisplayed()).toBe(true);
      expect(attrBackIdentity.get(3).isDisplayed()).toBe(true);
      expect(attrBackIdentity.get(4).isDisplayed()).toBe(false);

      // ********************************
      // DocEntry Identity Front
      // ********************************      
      var elementDocEntryFrontIdentity = identity_page.getDocEntryFrontIdentity();
      elementDocEntryFrontIdentity.getText().then(function(text){expect(text).toContain('Front')});      

      // initial selected item
      var selectedFrontIdentity=elementDocEntryFrontIdentity.all(by.css('.navbar-nav > li > a'));            
      expect(selectedFrontIdentity.count()).toBe(1);
      expect(selectedFrontIdentity.get(0).getAttribute('innerText')).toContain('DNI Front');

      // list item
      var listFrontIdentity=elementDocEntryFrontIdentity.all(by.css('.dropdown-menu > li > a'));      
      expect(listFrontIdentity.count()).toBe(2);
      expect(listFrontIdentity.get(0).getAttribute('value')).toBe('DNI_FRONT_LABEL');      
      expect(listFrontIdentity.get(0).getAttribute('innerText')).toContain('DNI Front');
      expect(listFrontIdentity.get(1).getAttribute('value')).toBe('NIE_FRONT_LABEL');      
      expect(listFrontIdentity.get(1).getAttribute('innerText')).toContain('NIE Front');

      // input attributes, as defined in model and for the actual selected document
      var attrFrontIdentity=elementDocEntryFrontIdentity.all(by.css('.input'));
      expect(attrFrontIdentity.count()).toBe(0);

      // ********************************
      // Signature
      // ********************************      
      var elementDocEntrySignature = identity_page.getDocEntrySignature();
      elementDocEntrySignature.getText().then(function(text){expect(text).toContain('Signature')});      

      // selected item
      var selectedSignature=elementDocEntrySignature.all(by.css('.navbar-nav > li > a'));            
      expect(selectedSignature.count()).toBe(1);
      expect(selectedSignature.get(0).getAttribute('innerText')).toContain('Signature');

      // list item
      var listSignature=elementDocEntrySignature.all(by.css('.dropdown-menu > li > a'));      
      expect(listSignature.count()).toBe(1);
      expect(listSignature.get(0).getAttribute('value')).toBe('SIGNATURE_CARD_LABEL');      
      expect(listSignature.get(0).getAttribute('innerText')).toContain('Signature');

      // input attributes, as defined in model and for the actual selected document
      var attrSignature=elementDocEntrySignature.all(by.css('.input'));
      expect(attrSignature.count()).toBe(0);
    });


  	it('after complete an operation and press New Operation button, should set an image to Dni drop area and show only his partial results', function() {
      var ipsaImgList = identity_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);
      var path = require('path');
      var absolutePath;

      var elementPanelTitleIdentity = identity_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification document")});

      var elementPanelIdentity = identity_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Awaiting document")});

      // all three image controls are disabled
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(3);
      });

      // ********************************
      // Identity Back
      // ********************************      
      // set de Dni Back attributes
      identity_page.setDniNumber('47871577K');
      identity_page.setDniFirstName('IGNASI');
      identity_page.setDniLastName('CASANOAS TARAFA');
      identity_page.setDniBirthdate('01/01/1986');

      // and now only two image controls are disabled after introduce required fields
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(2);
      });

      // set the Dni Back image.
      absolutePath = path.resolve(__dirname, "./resources/Dni_reverso.jpg");
      ipsaImgList.get(0).sendKeys(absolutePath);
      
      // Check if only first image element has content.
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      expect(items.get(0).isDisplayed()).toBe(true);
      expect(items.get(2).isDisplayed()).toBe(false);
      expect(items.get(4).isDisplayed()).toBe(false);

      browser.sleep(300);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);

      var elementPanelTitleIdentity = identity_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification document DNI")});

      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Document received and identified")});

      var checkboxPanelTitleDni = elementPanelTitleIdentity.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelTitleDni.count()).toEqual(1);

      var inputList = elementPanelIdentity.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(4);

      // Note: The result of getText from an input element is always empty.
      expect(inputList.get(0).getAttribute('value')).toEqual('IGNASI');
      expect(inputList.get(1).getAttribute('value')).toEqual('CASANOAS TARAFA');
      expect(inputList.get(2).getAttribute('value')).toEqual('47871577K');
      expect(inputList.get(3).getAttribute('value')).toEqual('01/01/1986');

      var allPanelIdentityIconsOK = elementPanelIdentity.all(by.css('.glyphicon-ok.text-success'));
      expect(allPanelIdentityIconsOK.count()).toEqual(5);

      var checkListOK = elementPanelIdentity.all(by.css('.checklist.glyphicon-ok.text-success'));
      expect(checkListOK.count()).toEqual(3);

      var checkListKO = elementPanelIdentity.all(by.css('.checklist.glyphicon-remove.text-danger'));
      expect(checkListKO.count()).toEqual(1);

      var elementPanelSignature = identity_page.getPanelSignature();
      elementPanelSignature.getText().then(function(text){expect(text).toContain("Awaiting document")});

      // ********************************
      // Identity Front
      // ********************************
      // set the Dni Front image.
      absolutePath = path.resolve(__dirname, "./resources/Dni_anverso.jpg");
      ipsaImgList.get(1).sendKeys(absolutePath);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Document received and identified")});

      browser.sleep(waitTimeOut);

      var allPanelIdentityIconsOK = elementPanelIdentity.all(by.css('.glyphicon-ok.text-success'));
      expect(allPanelIdentityIconsOK.count()).toEqual(6);

      var checkListOK = elementPanelIdentity.all(by.css('.checklist.glyphicon-ok.text-success'));
      expect(checkListOK.count()).toEqual(4);

      var checkListKO = elementPanelIdentity.all(by.css('.checklist.glyphicon-remove.text-danger'));
      expect(checkListKO.count()).toEqual(4);

      // ********************************
      // Signature
      // ********************************      
      var elementPanelTitleSignature = identity_page.getPanelTitleSignature();
      elementPanelTitleSignature.getText().then(function(text){expect(text).toContain("Signature")});
      elementPanelSignature.getText().then(function(text){expect(text).toContain("Awaiting document")});

      absolutePath = path.resolve(__dirname, "./resources/Boleta.jpg");
      ipsaImgList.get(2).sendKeys(absolutePath);

      browser.sleep(300);
      elementPanelSignature.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);

      elementPanelTitleSignature.getText().then(function(text){expect(text).toContain("Signature Card")});
      var allPanelSignatureIconsOK = elementPanelSignature.all(by.css('.glyphicon-ok.text-success'));
      expect(allPanelSignatureIconsOK.count()).toEqual(3);

      // Check expected icons by document type
      var checkboxDocumentAll = element.all(by.css('h3.glyphicon'));
      expect(checkboxDocumentAll.count()).toEqual(2);
      var checkboxDocumentAllOK = element.all(by.css('h3.glyphicon-ok'));
      expect(checkboxDocumentAllOK.count()).toEqual(2);


      // *******************************
      // New operation
	    // *******************************
      identity_page.clickNewOpButton();

      var elementPanelIdentity = identity_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Awaiting document")});

      // ********************************
      // Identity Back
      // ********************************      
      // set de Dni Back attributes
      identity_page.setDniNumber('47871577K');
      identity_page.setDniFirstName('IGNASI');
      identity_page.setDniLastName('CASANOAS TARAFA');
      identity_page.setDniBirthdate('01/01/1986');

      // and now only two image controls are disabled after introduce required fields
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(2);
      });

      // set the Dni Back image.
      absolutePath = path.resolve(__dirname, "./resources/Dni_reverso.jpg");
      ipsaImgList.get(0).sendKeys(absolutePath);
      
      // Check if only first image element has content.
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      expect(items.get(0).isDisplayed()).toBe(true);
      expect(items.get(2).isDisplayed()).toBe(false);
      expect(items.get(4).isDisplayed()).toBe(false);

      browser.sleep(300);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);

      var elementPanelTitleIdentity = identity_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification document DNI")});

      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Document received and identified")});

      var checkboxPanelTitleDni = elementPanelTitleIdentity.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelTitleDni.count()).toEqual(1);

      var inputList = elementPanelIdentity.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(4);

      // Note: The result of getText from an input element is always empty.
      expect(inputList.get(0).getAttribute('value')).toEqual('IGNASI');
      expect(inputList.get(1).getAttribute('value')).toEqual('CASANOAS TARAFA');
      expect(inputList.get(2).getAttribute('value')).toEqual('47871577K');
      expect(inputList.get(3).getAttribute('value')).toEqual('01/01/1986');

      var allPanelIdentityIconsOK = elementPanelIdentity.all(by.css('.glyphicon-ok.text-success'));
      expect(allPanelIdentityIconsOK.count()).toEqual(5);

      var checkListOK = elementPanelIdentity.all(by.css('.checklist.glyphicon-ok.text-success'));
      expect(checkListOK.count()).toEqual(3);

      var checkListKO = elementPanelIdentity.all(by.css('.checklist.glyphicon-remove.text-danger'));
      expect(checkListKO.count()).toEqual(1);

      var elementPanelSignature = identity_page.getPanelSignature();
      elementPanelSignature.getText().then(function(text){expect(text).toContain("Awaiting document")});

    });


    it('should set attributes values and set an image to Nie Back drop area and then show ocr-test recognition', function() {
      var elementPanelIdentity = identity_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Awaiting document")});

      var ipsaImgList = identity_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);

      // all three image controls are disabled before entering required fields
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {      
        expect(items.length).toBe(3);
      });

      // ********************************
      // DocEntry Identity Back
      // ********************************      
      var elementDocEntryBackIdentity = identity_page.getDocEntryBackIdentity();
      elementDocEntryBackIdentity.getText().then(function(text){expect(text).toContain('Back')});

      // initial selected item
      var selectedBackIdentity=elementDocEntryBackIdentity.all(by.css('.navbar-nav > li > a'));
      expect(selectedBackIdentity.count()).toBe(1);
      expect(selectedBackIdentity.get(0).getAttribute('innerText')).toContain('DNI');

      // list item
      var listBackIdentity=elementDocEntryBackIdentity.all(by.css('.dropdown-menu > li > a'));
      expect(listBackIdentity.count()).toBe(3);
      expect(listBackIdentity.get(0).getAttribute('value')).toBe('DNI_LABEL');
      expect(listBackIdentity.get(0).getAttribute('innerText')).toContain('DNI');
      expect(listBackIdentity.get(1).getAttribute('value')).toBe('NIE_LABEL');
      expect(listBackIdentity.get(1).getAttribute('innerText')).toContain('NIE');
      expect(listBackIdentity.get(2).getAttribute('value')).toBe('PASSPORT_LABEL');
      expect(listBackIdentity.get(2).getAttribute('innerText')).toContain('Passport');

      // ********************************
      // DocEntry Identity Front
      // ********************************      
      var elementDocEntryFrontIdentity = identity_page.getDocEntryFrontIdentity();
      elementDocEntryFrontIdentity.getText().then(function(text){expect(text).toContain('Front')});

      // initial selected item
      var selectedFrontIdentity=elementDocEntryFrontIdentity.all(by.css('.navbar-nav > li > a'));
      expect(selectedFrontIdentity.count()).toBe(1);
      expect(selectedFrontIdentity.get(0).getAttribute('innerText')).toContain('DNI Front');

      // list item
      var listFrontIdentity=elementDocEntryFrontIdentity.all(by.css('.dropdown-menu > li > a'));
      expect(listFrontIdentity.count()).toBe(2);
      expect(listFrontIdentity.get(0).getAttribute('value')).toBe('DNI_FRONT_LABEL');
      expect(listFrontIdentity.get(0).getAttribute('innerText')).toContain('DNI Front');
      expect(listFrontIdentity.get(1).getAttribute('value')).toBe('NIE_FRONT_LABEL');
      expect(listFrontIdentity.get(1).getAttribute('innerText')).toContain('NIE Front');

      // ********************************
      // Change DocEntry Identity Back
      // ********************************            
      // select second item from list
      selectedBackIdentity.get(0).click();
      listBackIdentity.get(1).click();
      expect(selectedBackIdentity.get(0).getAttribute('innerText')).toContain('NIE');

      // Identity Front must be changed
      expect(selectedFrontIdentity.get(0).getAttribute('innerText')).toContain('NIE Front');

      // set de Nie back attributes
      identity_page.setNieNumber('X1234567P');
      identity_page.setNieFirstName('BENJAMIN');
      identity_page.setNieLastName('NOWAK STARK');
      identity_page.setNieBirthdate('12/08/1972');

      // and now only two docentry image controls are disabled after introduce required fields
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) { 
        expect(items.length).toBe(2);
      });

      // set the Nie Back image.
      var path = require('path');
      var absolutePath = path.resolve(__dirname, "./resources/Nie_reverso.jpg");
      ipsaImgList.get(0).sendKeys(absolutePath);

      // Check if only first image element has content
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      expect(items.get(0).isDisplayed()).toBe(true);
      expect(items.get(1).isDisplayed()).toBe(false); 
      expect(items.get(2).isDisplayed()).toBe(false);

      browser.sleep(300);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Processing document")});

      // after send Nie Back image, itself is locked, and the other two docentry images are enabled
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) { 
        expect(items.length).toBe(1);
      });

      browser.sleep(waitTimeOut);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Document received and identified")});

      var elementPanelTitleIdentity = identity_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identification document NIE")});
      
      var checkboxPanelTitleNie = elementPanelTitleIdentity.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelTitleNie.count()).toEqual(1);

      var inputList = elementPanelIdentity.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(4);

      // Note: The result of getText from an input element is always empty.
      expect(inputList.get(0).getAttribute('value')).toEqual('BENJAMIN');
      expect(inputList.get(1).getAttribute('value')).toEqual('NOWAK STARK');
      expect(inputList.get(2).getAttribute('value')).toEqual('X1234567P');
      expect(inputList.get(3).getAttribute('value')).toEqual('12/08/1972');

      var allPanelIdentityIconsOK = elementPanelIdentity.all(by.css('.glyphicon-ok.text-success'));
      expect(allPanelIdentityIconsOK.count()).toEqual(6);

      var checkListOK = elementPanelIdentity.all(by.css('.checklist.glyphicon-ok.text-success'));
      expect(checkListOK.count()).toEqual(4);

      var checkListKO = elementPanelIdentity.all(by.css('.checklist.glyphicon-remove.text-danger'));
      expect(checkListKO.count()).toEqual(0);

      // validation directive, only configured validations in this directive.
      var validationsIdentity = elementPanelIdentity.all(by.css('.glyphicon.validation'));
      expect(validationsIdentity.count()).toEqual(1);

      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Expiration date")});      

      // ********************************
      // Identity Front
      // ********************************
      // set the Nie Front image.
      absolutePath = path.resolve(__dirname, "./resources/Dni_anverso.jpg");
      ipsaImgList.get(1).sendKeys(absolutePath);
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Document received and identified")});

      browser.sleep(waitTimeOut);

      var allPanelIdentityIconsOK = elementPanelIdentity.all(by.css('.glyphicon-ok.text-success'));
      expect(allPanelIdentityIconsOK.count()).toEqual(7);

      var checkListOK = elementPanelIdentity.all(by.css('.checklist.glyphicon-ok.text-success'));
      expect(checkListOK.count()).toEqual(5);

      var checkListKO = elementPanelIdentity.all(by.css('.checklist.glyphicon-remove.text-danger'));
      expect(checkListKO.count()).toEqual(3);

      // ********************************
      // Signature
      // ********************************      
      var elementPanelTitleSignature = identity_page.getPanelTitleSignature();
      elementPanelTitleSignature.getText().then(function(text){expect(text).toContain("Signature")});
      var elementPanelSignature = identity_page.getPanelSignature();            
      elementPanelSignature.getText().then(function(text){expect(text).toContain("Awaiting document")});

      absolutePath = path.resolve(__dirname, "./resources/Boleta.jpg");
      ipsaImgList.get(2).sendKeys(absolutePath);

      browser.sleep(300);
      elementPanelSignature.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);

      elementPanelTitleSignature.getText().then(function(text){expect(text).toContain("Signature Card")});
      var allPanelSignatureIconsOK = elementPanelSignature.all(by.css('.glyphicon-ok.text-success'));
      expect(allPanelSignatureIconsOK.count()).toEqual(3);

      // validation directive, only configured validations in this directive.
      var validationsSignature = elementPanelSignature.all(by.css('.glyphicon.validation'));
      expect(validationsSignature.count()).toEqual(2);

      elementPanelSignature.getText().then(function(text){expect(text).toContain("Has sender sign")});
      elementPanelSignature.getText().then(function(text){expect(text).toContain("Has agent sign")});

      // Check all expected icons by document type
      var checkboxDocumentAll = element.all(by.css('h3.glyphicon'));
      expect(checkboxDocumentAll.count()).toEqual(2);
      var checkboxDocumentAllOK = element.all(by.css('h3.glyphicon-ok'));
      expect(checkboxDocumentAllOK.count()).toEqual(2);

    });

  });

  function init_test() {
    browser.sleep(500);    
    browser.get('http://localhost:8083/');  
    browser.manage().window().maximize(); 
    try {
      element(by.css('.glyphicon-log-out')).isDisplayed().then(function (isVisible) {
        if (isVisible) {
          identity_page.logOut();        
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

