'use strict';

describe('FaceRecognitionDemoApp', function() {
  var login_page;
  var facerecognition_page;
  var waitTimeOut = 18000;

  var pattern_resource = './resources/facerecognition/Cara1.mp4';
  var pattern_name = 'Pattern Name 1';
  var pattern_number = '123456789';

  var identityMedia_resource_1 = './resources/facerecognition/Cara1OK.jpg';
  var identityMedia_result_1 = "0.55021";

  var identityMedia_resource_2 = './resources/facerecognition/Cara1KO.jpg';
  var identityMedia_result_2 = "0.7782";

  login_page = require('./page/login_page.js');
  facerecognition_page = require('./page/facerecognition_page.js');

  beforeEach(function() {
    init_test();
  });

  describe('FaceRecognition page', function() {

    /********************************************************************************************************
      Note: all test results are based in the service named 'FaceRecognitionService' for test purposes only.
    *********************************************************************************************************/

    beforeEach(function() {
      login_page.selectLanguage('Inglés');
      login_page.selectProduct('Face Recognition');
      facerecognition_page = login_page.loginAsAdmin('FaceRecognitionApp');
    });

    afterEach(function() {
      login_page.selectLanguage('Spanish');
      facerecognition_page.logOut();
    });

    it('should able on correct page', function() {
      expect(facerecognition_page.getCurrentUrl()).toEqual("http://localhost:8083/faceRecognitionDemo");
    });


    it('should get the entire empty page', function() {
      expect(facerecognition_page.getPanelTitle()).toBe('Face Recognition');

      // docentry directive, 3 configured input attributes, 3 created but only 2 are visibles. Method 1
      element.all(by.css('.input.docentry')).all(by.css('.form-control')).then(function(items) {
        expect(items.length).toBe(3);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
      });

 	    // docentry directive, 3 configured input attributes, 3 created but only 2 are visibles. Method 2
 	    expect(element.all(by.repeater('field in selected.fields')).count()).toBe(3);

      expect(facerecognition_page.getPPatternName()).toBe('');
      expect(facerecognition_page.getPatternNumber()).toBe('');
      expect(facerecognition_page.getIdentityMediaPatternId()).toBe('');

      // validation directive, 3 configured attributes. Method 1
      element.all(by.css('.input.validation')).all(by.css('.form-control')).then(function(items) {
        expect(items.length).toBe(3);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
      });

		  // validation directive, 3 configured attributes. Method 2
 	    expect(element.all(by.repeater('(key, value) in docattribs')).count()).toBe(3);

      // validation directive, all configured validations in this page. Method 1
      element.all(by.css('.glyphicon.validation')).then(function(items) {
        expect(items.length).toBe(0);
      });

 	    // validation directive, all configured validations in this page. Method 2
 	    expect(element.all(by.repeater('(key, value) in validations')).count()).toBe(0);

	    // validation directive, only configured validations in this directive. Method 2
      var elementPanelPattern = facerecognition_page.getPanelPattern();
      var validationsPattern = elementPanelPattern.all(by.css('.glyphicon.validation'));
      expect(validationsPattern.count()).toEqual(0);

 	    // validation directive, only configured validations in this directive. Method 2
      var elementPanelIdentityMedia = facerecognition_page.getPanelIdentityMedia();
      var validationsIdentityMedia = elementPanelIdentityMedia.all(by.css('.glyphicon.validation'));
      expect(validationsIdentityMedia.count()).toEqual(0);

      expect(element(by.buttonText('New')).isEnabled()).toBe(true);
      expect(element(by.buttonText('Cancel')).isEnabled()).toBe(false);
      expect(element(by.buttonText('Terminate')).isEnabled()).toBe(false);

      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(4);
      expect(items.get(0).isDisplayed()).toBe(false);
      expect(items.get(1).isDisplayed()).toBe(false);
      expect(items.get(2).isDisplayed()).toBe(false);

      // Check if all two image control are disabled
      element.all(by.css('.drop-box-container')).then(function(items) {
        expect(items.length).toBe(2);
      });

      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(2);
      });

    });


    it('should obtain all two ipsa img elements in FaceRecognition page', function() {
      element.all(by.css('.drop-box')).then(function(items) {
        expect(items.length).toBe(2);
      });
    });


    it('should obtain ipsa img element by index', function() {
      var item = facerecognition_page.getIpsaImgByIndex(0);
      expect(item).not.toBe(null);
    });


    it('should obtain all ipsa img element by Id', function() {
      var id = 'ipsa-image-REFERENCE_PATTERN_DOCUMENT';
      expect(element(by.id(id)).isPresent()).toBe(true);

      var item = facerecognition_page.getIpsaImgById(id);
      expect(item).not.toBe(null);
      expect(item.isPresent()).toBe(true);

      id = 'ipsa-image-IDENTITY_MEDIA_DOCUMENT';
      expect(element(by.id(id)).isPresent()).toBe(true);

      item = facerecognition_page.getIpsaImgById(id);
      expect(item).not.toBe(null);
      expect(item.isPresent()).toBe(true);

    });


    it('should set Pattern attributes values and set an video to Pattern drop area and then show train status glyphicon ok', function() {
      var elementDocEntryPattern = facerecognition_page.getDocEntryPattern();
      // selected item
      var selectedPattern=elementDocEntryPattern.all(by.css('.navbar-nav > li > a'));
      expect(selectedPattern.count()).toBe(1);
      expect(selectedPattern.get(0).getAttribute('innerText')).toContain('Video');

      var ipsaImgList = facerecognition_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(2);

      // all two image controls are disabled before entering required fields
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(2);
      });

      var elementPanelPattern = facerecognition_page.getPanelPattern();
      elementPanelPattern.getText().then(function(text){expect(text).toContain("Awaiting document")});

      // set de Pattern attributes, only pattern number is required
      facerecognition_page.setPatternName(pattern_name);
      facerecognition_page.setPatternNumber(pattern_number);

      // and now only one docentry image control is disabled after introduce required fields
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(1);
      });

      // set the Pattern video.
      var path = require('path');
      var absolutePath = path.resolve(__dirname, pattern_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);

      // Check if only first image element has content
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(4);
      expect(items.get(0).isDisplayed()).toBe(false);  // Note: video has no preview like an image
      expect(items.get(1).isDisplayed()).toBe(false);
      expect(items.get(2).isDisplayed()).toBe(false);
      expect(items.get(3).isDisplayed()).toBe(false);

      browser.sleep(300);
      elementPanelPattern.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);
      elementPanelPattern.getText().then(function(text){expect(text).toContain("Document received and identified")});

      // after send Pattern video and receive ok status, itself is locked and the other docentry image control is enabled
      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(1);
      });

      var elementPanelTitlePattern = facerecognition_page.getPanelTitlePattern();
      elementPanelTitlePattern.getText().then(function(text){expect(text).toContain("Reference Pattern")});

      var checkboxPanelTitlePattern = elementPanelTitlePattern.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelTitlePattern.count()).toEqual(1);

      var inputList = elementPanelPattern.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(2);

      // Note: The result of getText from an input element is always empty.
      expect(inputList.get(0).getAttribute('value')).toEqual(pattern_name);
      expect(inputList.get(1).getAttribute('value')).toEqual(pattern_number);

      // when response OK, the PatternId must be stored in IdentityMedia attribute's map
      expect(facerecognition_page.getIdentityMediaPatternId()).not.toBe('');
    });


    it('should clear the entire page when click on New button', function() {
      // set de Pattern attributes
      facerecognition_page.setPatternName(pattern_name);
      facerecognition_page.setPatternNumber(pattern_number);

      var elementPanelPattern = facerecognition_page.getPanelPattern();
      var ipsaImgList = facerecognition_page.getAllIpsaImg();
      // set the Pattern video.
      var path = require('path');
      var absolutePath = path.resolve(__dirname, pattern_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);
      browser.sleep(waitTimeOut);
      var inputList = elementPanelPattern.all(by.css('input[type="text"]'));
      expect(inputList.get(0).getAttribute('value')).toEqual(pattern_name);
      expect(inputList.get(1).getAttribute('value')).toEqual(pattern_number);

      facerecognition_page.clickNewOpButton();

      // docentry directive, 3 configured input attributes, 3 created but only 2 are visibles.
      element.all(by.css('.input.docentry')).all(by.css('.form-control')).then(function(items) {
        expect(items.length).toBe(3);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
      });

      expect(facerecognition_page.getPPatternName()).toBe('');
      expect(facerecognition_page.getPatternNumber()).toBe('');
      expect(facerecognition_page.getIdentityMediaPatternId()).toBe('');

      // validation directive
      element.all(by.css('.input.validation')).all(by.css('.form-control')).then(function(items) {
        expect(items.length).toBe(3);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
      });

      expect(element(by.buttonText('New')).isEnabled()).toBe(true);
      expect(element(by.buttonText('Cancel')).isEnabled()).toBe(false);
      expect(element(by.buttonText('Terminate')).isEnabled()).toBe(false);

      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(4);
      expect(items.get(0).isDisplayed()).toBe(false);
      expect(items.get(1).isDisplayed()).toBe(false);
      expect(items.get(2).isDisplayed()).toBe(false);
      expect(items.get(3).isDisplayed()).toBe(false);
    });


    it('should clear the entire page when click on Cancel button', function() {
      // set de Pattern attributes
      facerecognition_page.setPatternName(pattern_name);
      facerecognition_page.setPatternNumber(pattern_number);

      var elementPanelPattern = facerecognition_page.getPanelPattern();
      var ipsaImgList = facerecognition_page.getAllIpsaImg();
      // set the Pattern video.
      var path = require('path');
      var absolutePath = path.resolve(__dirname, pattern_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);
      browser.sleep(waitTimeOut);
      var inputList = elementPanelPattern.all(by.css('input[type="text"]'));
      expect(inputList.get(0).getAttribute('value')).toEqual(pattern_name);
      expect(inputList.get(1).getAttribute('value')).toEqual(pattern_number);

      facerecognition_page.clickCancelButton();

      // docentry directive, 3 configured input attributes, 3 created but only 2 are visibles.
      element.all(by.css('.input.docentry')).all(by.css('.form-control')).then(function(items) {
        expect(items.length).toBe(3);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
      });

      expect(facerecognition_page.getPPatternName()).toBe('');
      expect(facerecognition_page.getPatternNumber()).toBe('');
      expect(facerecognition_page.getIdentityMediaPatternId()).toBe('');

      // validation directive
      element.all(by.css('.input.validation')).all(by.css('.form-control')).then(function(items) {
        expect(items.length).toBe(3);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
      });

      expect(element(by.buttonText('New')).isEnabled()).toBe(true);
      expect(element(by.buttonText('Cancel')).isEnabled()).toBe(false);
      expect(element(by.buttonText('Terminate')).isEnabled()).toBe(false);

      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(4);
      expect(items.get(0).isDisplayed()).toBe(false);
      expect(items.get(1).isDisplayed()).toBe(false);
      expect(items.get(2).isDisplayed()).toBe(false);
      expect(items.get(3).isDisplayed()).toBe(false);
    });


    it('should set an video/image to every drop area and show all complete results', function() {
      var ipsaImgList = facerecognition_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(2);
      var path = require('path');
      var absolutePath;

      // ********************************
      // Pattern
      // ********************************
      var elementPanelTitlePattern = facerecognition_page.getPanelTitlePattern();
      elementPanelTitlePattern.getText().then(function(text){expect(text).toContain("Reference Pattern")});

      // set de Pattern attributes
      facerecognition_page.setPatternName(pattern_name);
      facerecognition_page.setPatternNumber(pattern_number);

      var elementPanelPattern = facerecognition_page.getPanelPattern();
      elementPanelPattern.getText().then(function(text){expect(text).toContain("Awaiting document")});
      absolutePath = path.resolve(__dirname, pattern_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);

      browser.sleep(300);
      elementPanelPattern.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);

      elementPanelTitlePattern.getText().then(function(text){expect(text).toContain("Reference Pattern")});
      elementPanelPattern.getText().then(function(text){expect(text).toContain("Document received and identified")});

      var checkboxPanelTitlePattern = elementPanelTitlePattern.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelTitlePattern.count()).toEqual(1);

      var checkboxPanelPattern = elementPanelPattern.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelPattern.count()).toEqual(1);

      var inputList = elementPanelPattern.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(2);

      expect(inputList.get(0).getAttribute('value')).toEqual(pattern_name);
      expect(inputList.get(1).getAttribute('value')).toEqual(pattern_number);

      // when response OK, the PatternId must be stored in IdentityMedia attribute's map
      expect(facerecognition_page.getIdentityMediaPatternId()).not.toBe('');

      expect(element(by.buttonText('Terminate')).isEnabled()).toBe(false);

      // ********************************
      // IdentityMedia
      // ********************************
      var elementDocEntryIdentityMedia = facerecognition_page.getDocEntryIdentityMedia();
      // selected item
      var selectedIdentityMedia=elementDocEntryIdentityMedia.all(by.css('.navbar-nav > li > a'));
      expect(selectedIdentityMedia.count()).toBe(1);
      expect(selectedIdentityMedia.get(0).getAttribute('innerText')).toContain('Image');

      var elementPanelTitleIdentityMedia = facerecognition_page.getPanelTitleIdentityMedia();
      elementPanelTitleIdentityMedia.getText().then(function(text){expect(text).toContain("Face Recognition")});

      var elementPanelIdentityMedia = facerecognition_page.getPanelIdentityMedia();
      elementPanelIdentityMedia.getText().then(function(text){expect(text).toContain("Awaiting document")});

      absolutePath = path.resolve(__dirname, identityMedia_resource_1);
      ipsaImgList.get(1).sendKeys(absolutePath);

      browser.sleep(waitTimeOut);

      // Check the final expected results
      elementPanelTitleIdentityMedia.getText().then(function(text){expect(text).toContain("Face Recognition")});
      elementPanelIdentityMedia.getText().then(function(text){expect(text).toContain("Document received and identified")});

      var checkboxPanelTitleIdentityMedia = elementPanelTitleIdentityMedia.all(by.css('.glyphicon-remove'));
      expect(checkboxPanelTitleIdentityMedia.count()).toEqual(1);

      inputList = elementPanelIdentityMedia.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(1);

      // Note: The result of getText from an input element is always empty.
      expect(inputList.get(0).getAttribute('value')).toEqual(identityMedia_result_1);
      expect(element(by.buttonText('Terminate')).isEnabled()).toBe(true);

      // *******************************************************************************
      // Now try to upload another IdentityMedia image, different from the previous one
      // *******************************************************************************
      absolutePath = path.resolve(__dirname, identityMedia_resource_2);
      ipsaImgList.get(1).sendKeys(absolutePath);

      browser.sleep(300);
      elementPanelIdentityMedia.getText().then(function(text){expect(text).toContain("Processing document")});

      browser.sleep(waitTimeOut);

      // Check the final expected results
      elementPanelTitleIdentityMedia.getText().then(function(text){expect(text).toContain("Face Recognition")});
      elementPanelIdentityMedia.getText().then(function(text){expect(text).toContain("Document received and identified")});

      checkboxPanelTitleIdentityMedia = elementPanelTitleIdentityMedia.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelTitleIdentityMedia.count()).toEqual(1);

      inputList = elementPanelIdentityMedia.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(1);

      // Note: The result of getText from an input element is always empty.
      expect(inputList.get(0).getAttribute('value')).toEqual(identityMedia_result_2);


      // *******************************************************************************
      // Click Terminate button and check can't load any new image
      // *******************************************************************************

      expect(element(by.buttonText('Terminate')).isEnabled()).toBe(true);
      facerecognition_page.clickTerminateButton();

      // Check if all two image control are disabled
      element.all(by.css('.drop-box-container')).then(function(items) {
        expect(items.length).toBe(2);
      });

      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {
        expect(items.length).toBe(2);
      });

      // After Terminate Operation button the actual results must not be changed
      elementPanelTitleIdentityMedia.getText().then(function(text){expect(text).toContain("Face Recognition")});
      elementPanelIdentityMedia.getText().then(function(text){expect(text).toContain("Document received and identified")});

      checkboxPanelTitleIdentityMedia = elementPanelTitleIdentityMedia.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelTitleIdentityMedia.count()).toEqual(1);

      inputList = elementPanelIdentityMedia.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(1);

      // Note: The result of getText from an input element is always empty.
      expect(inputList.get(0).getAttribute('value')).toEqual(identityMedia_result_2);
    });


  });

  function init_test() {
    browser.sleep(500);
    browser.get('http://localhost:8083/');
    browser.manage().window().maximize();
    try {
      element(by.css('.glyphicon-log-out')).isDisplayed().then(function (isVisible) {
        if (isVisible) {
          facerecognition_page.logOut();
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

