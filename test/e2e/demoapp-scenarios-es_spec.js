'use strict';

describe('ValidationDemoApp', function() {
  var login_page;              
  var validation_page;
  var waitTimeOut = 18000;

  var dni_resource = './resources/Dni_reverso.jpg';
  var bankreceipt_resource = './resources/JustificanteBancario.jpg';
  var bankreceipt_account = '2100 2794 960100123491'; 
  var paysheet_resource = './resources/Nomina.jpg';
  var paysheet_amount = '1.423,86';

  login_page = require('./page/login_page.js');                
  validation_page = require('./page/validation_page.js');                    

  beforeEach(function() {
    init_test();
  });


  describe('Validation page', function() {

    /*****************************************************************************
      Note: all test results are based in the plugin OCR named 'OCRPluginTest'.
    ******************************************************************************/
   
    beforeEach(function() {
      login_page.selectProduct('Solicitud de seguros');
      validation_page = login_page.loginAsAdmin('DemoApp');
    });

    afterEach(function() {
      validation_page.logOut();
    });

    it('should able on correct page', function() {
      expect(validation_page.getCurrentUrl()).toEqual("http://localhost:8083/validationDemo");
    });


    it('should get the entire empty page', function() {

      expect(validation_page.getPanelTitle()).toBe('Solicitud de seguros');      

      element.all(by.css('.input.validation')).all(by.css('.form-control')).then(function(items) {      
        //console.log('Numero de items devueltos='+items.length);     
        //for (var i = 0; i < items.length; i++) { 
          //  Object.keys(items[i]).forEach(function(key) {
          //  console.log(key, items[i][key]);
          //});
             
          //var id = items[i].getAttribute('id').then(function(attr) {;
          //  expect(typeof attr).toBe("string");
          //  console.log('id ='+attr);          
          //});             
        //}

        expect(items.length).toBe(4);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
        expect(items[3].getAttribute('value')).toBe('');
      });

      expect(element(by.buttonText('Nuevo')).isEnabled()).toBe(true); 
      expect(element(by.buttonText('Cancelar')).isEnabled()).toBe(false); 
      expect(element(by.buttonText('Terminar')).isEnabled()).toBe(false);
      expect(validation_page.getPaysheetAmount()).toBe('');
      expect(validation_page.getBankReceiptAccount()).toBe('');       

      var items = element.all(by.css('.thumb'));      
      expect(items.count()).toEqual(6);
      //expect(items.get(0).getAttribute('src')).toBe(null);
      expect(items.get(0).isDisplayed()).toBe(false);
      expect(items.get(1).isDisplayed()).toBe(false);      
      expect(items.get(2).isDisplayed()).toBe(false);

      // Check if only Identity image control is enabled. Income and Receipt must be disabled
      //expect(ipsaImgList.get(0).isEnabled()).toBe(true);
      //expect(ipsaImgList.get(1).isEnabled()).toBe(false);       // don't work, always true
      //expect(ipsaImgList.get(2).isEnabled()).toBe(false);       // don't work, always true     
      element.all(by.css('.drop-box-container')).then(function(items) {      
        expect(items.length).toBe(3);
      });

      element.all(by.css('.drop-box-container.not-allowed')).then(function(items) {      
        expect(items.length).toBe(2);
      });

    });


    it('should obtain all three ipsa img elements in validation page', function() {
      element.all(by.css('.drop-box')).then(function(items) {      
        expect(items.length).toBe(3);  
      }); 
    });


    it('should obtain ipsa img element by index', function() {
      var item = validation_page.getIpsaImgByIndex(0);
      expect(item).not.toBe(null); 
    });


    it('should obtain ipsa img element by Id', function() {
      var id = 'ipsa-image-IDENTITY_LEGEND';
      expect(element(by.id(id)).isPresent()).toBe(true);      

      var item = validation_page.getIpsaImgById(id);
      expect(item).not.toBe(null);
      expect(item.isPresent()).toBe(true);   
    });


    it('should set an image to Dni drop area and show ocr-test recognition', function() {

      var elementPanelIdentity = validation_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Documento a la espera")});      

      var ipsaImgList = validation_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);

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

      browser.sleep(200);          
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Procesando documento")});      

      browser.sleep(waitTimeOut);          
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Documento recibido e identificado")});

      var inputList = elementPanelIdentity.all(by.css('input[type="text"]'));
      expect(inputList.count()).toEqual(4);      

      // Note: The result of getText from an input element is always empty.
      expect(inputList.get(0).getAttribute('value')).toEqual('IGNASI');
      expect(inputList.get(1).getAttribute('value')).toEqual('CASANOAS TARAFA');
      expect(inputList.get(2).getAttribute('value')).toEqual('47871577K');
      expect(inputList.get(3).getAttribute('value')).toEqual('17/01/2019');
      
    });


    it('should clear the entire page when click on New Operation button', function() {
      var elementPanelIdentity = validation_page.getPanelIdentity();
      var ipsaImgList = validation_page.getAllIpsaImg();
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

      validation_page.clickNewOpButton();
      element.all(by.css('.input.validation')).all(by.css('.form-control')).then(function(items) {      
        expect(items.length).toBe(4);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
        expect(items[3].getAttribute('value')).toBe('');
      });

      expect(element(by.buttonText('Nuevo')).isEnabled()).toBe(true); 
      expect(element(by.buttonText('Cancelar')).isEnabled()).toBe(false); 
      expect(element(by.buttonText('Terminar')).isEnabled()).toBe(false);
      expect(validation_page.getPaysheetAmount()).toBe('');
      expect(validation_page.getBankReceiptAccount()).toBe('');       

      var items = element.all(by.css('.thumb'));      
      expect(items.count()).toEqual(6);
      expect(items.get(0).isDisplayed()).toBe(false);
      expect(items.get(1).isDisplayed()).toBe(false);      
      expect(items.get(2).isDisplayed()).toBe(false);              
    });


    it('should clear the entire page when click on Cancel button', function() {
      var elementPanelIdentity = validation_page.getPanelIdentity();
      var ipsaImgList = validation_page.getAllIpsaImg();
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

      validation_page.clickCancelButton();

      element.all(by.css('.input.validation')).all(by.css('.form-control')).then(function(items) {      
        expect(items.length).toBe(4);
        expect(items[0].getAttribute('value')).toBe('');
        expect(items[1].getAttribute('value')).toBe('');
        expect(items[2].getAttribute('value')).toBe('');
        expect(items[3].getAttribute('value')).toBe('');
      });

      expect(element(by.buttonText('Nuevo')).isEnabled()).toBe(true); 
      expect(element(by.buttonText('Cancelar')).isEnabled()).toBe(false); 
      expect(element(by.buttonText('Terminar')).isEnabled()).toBe(false);
      expect(validation_page.getPaysheetAmount()).toBe('');
      expect(validation_page.getBankReceiptAccount()).toBe('');       

      var items = element.all(by.css('.thumb'));      
      expect(items.count()).toEqual(6);
      expect(items.get(0).isDisplayed()).toBe(false);
      expect(items.get(2).isDisplayed()).toBe(false);      
      expect(items.get(4).isDisplayed()).toBe(false);            
    });


    it('should show modal message when only Dni document is loaded and click on Terminate button', function() {
      var ipsaImgList = validation_page.getAllIpsaImg();
      // set the Dni image.
      var path = require('path');
      var absolutePath = path.resolve(__dirname, dni_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);
      
      expect(element(by.buttonText('Terminar')).isEnabled()).toBe(true);
      validation_page.clickTerminateButton();
      expect(validation_page.getModalMessage()).toBe('Faltan documentos');
      browser.sleep(3000);                
      validation_page.clickModalOk();
    });      


    it('should set an image to every drop area and show all complete results', function() {
      var ipsaImgList = validation_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);
      var path = require('path');
      var absolutePath;

      // ********************************
      // Identity
      // ********************************      
      var elementPanelTitleIdentity = validation_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identidad")});      

      var elementPanelIdentity = validation_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Documento a la espera")});      
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
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Procesando documento")});      
      
      browser.sleep(waitTimeOut);          
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identidad DNI")});            
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Documento recibido e identificado")});

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
      var elementPanelTitleReceipt = validation_page.getPanelTitleReceipt();
      elementPanelTitleReceipt.getText().then(function(text){expect(text).toContain("Justificantes")});      

      var elementPanelReceipt = validation_page.getPanelReceipt();
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Documento a la espera")});      

      validation_page.setBankReceiptAccount(bankreceipt_account);
      absolutePath = path.resolve(__dirname, bankreceipt_resource);
      ipsaImgList.get(1).sendKeys(absolutePath);

      // Check if only two first images has content
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      //expect(items.get(0).isDisplayed()).toBe(false);   // 0 upload
      //expect(items.get(1).isDisplayed()).toBe(true);    // 1 download                     
      //expect(items.get(2).isDisplayed()).toBe(true);    // 2 upload              
      //expect(items.get(3).isDisplayed()).toBe(false);   // 3 download                     
      //expect(items.get(4).isDisplayed()).toBe(false);   // 4 upload               
      //expect(items.get(5).isDisplayed()).toBe(false);   // 5 download                     

      browser.sleep(300);          
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Procesando documento")});      
      browser.sleep(waitTimeOut);

      // ********************************
      // Income
      // ********************************      
      var elementPanelTitleIncome = validation_page.getPanelTitleIncome();
      elementPanelTitleIncome.getText().then(function(text){expect(text).toContain("Ingresos")});      

      var elementPanelIncome = validation_page.getPanelIncome();
      elementPanelIncome.getText().then(function(text){expect(text).toContain("Documento a la espera")});

      validation_page.setPaysheetAmount(paysheet_amount);
      absolutePath = path.resolve(__dirname, paysheet_resource);
      ipsaImgList.get(2).sendKeys(absolutePath);

      // Check if all three images has content
      var items = element.all(by.css('.thumb'));      
      expect(items.count()).toEqual(6);
      //expect(items.get(0).isDisplayed()).toBe(false);  // 0 upload
      //expect(items.get(1).isDisplayed()).toBe(true);   // 1 download                     
      //expect(items.get(2).isDisplayed()).toBe(false);  // 2 upload              
      //expect(items.get(3).isDisplayed()).toBe(true);   // 3 download                     
      //expect(items.get(4).isDisplayed()).toBe(true);   // 4 upload               
      //expect(items.get(5).isDisplayed()).toBe(false);  // 5 download                     

      browser.sleep(300);          
      elementPanelIncome.getText().then(function(text){expect(text).toContain("Procesando documento")});      

      browser.sleep(waitTimeOut);          

      // Check the final expected results in the screen
      elementPanelTitleReceipt.getText().then(function(text){expect(text).toContain("Justificantes Justificante bancario")});                  
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Documento recibido e identificado")});
      var checkboxPanelJustificanteBancarioAll = elementPanelReceipt.all(by.css('.glyphicon'));
      expect(checkboxPanelJustificanteBancarioAll.count()).toEqual(3);      
      var checkboxPanelJustificanteBancarioKO = elementPanelReceipt.all(by.css('.glyphicon-remove'));
      expect(checkboxPanelJustificanteBancarioKO.count()).toEqual(1);
      var checkboxPanelJustificanteBancarioOK = elementPanelReceipt.all(by.css('.glyphicon-ok'));
      expect(checkboxPanelJustificanteBancarioOK.count()).toEqual(2);      

      elementPanelTitleIncome.getText().then(function(text){expect(text).toContain("Ingresos Nómina")});                  
      elementPanelIncome.getText().then(function(text){expect(text).toContain("Documento recibido e identificado")});
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

    });


    it('should have been loaded the title and the different document types and fields in every docentry selector', function() {

      // ********************************
      // Identity
      // ********************************      
      var elementDocEntryIdentity = validation_page.getDocEntryIdentity();
      elementDocEntryIdentity.getText().then(function(text){expect(text).toContain('Identidad')});      

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
      expect(listIdentity.get(2).getAttribute('innerText')).toContain('Pasaporte');
      expect(listIdentity.get(3).getAttribute('value')).toBe('DOC_AUTO_LABEL');      
      expect(listIdentity.get(3).getAttribute('innerText')).toContain('Automático');

      // input attributes, as defined in model and for the actual selected document
      var attrIdentity=elementDocEntryIdentity.all(by.css('.input'));
      expect(attrIdentity.count()).toBe(5);
      expect(attrIdentity.get(0).isDisplayed()).toBe(false);
      expect(attrIdentity.get(1).isDisplayed()).toBe(false);
      expect(attrIdentity.get(2).isDisplayed()).toBe(false);
      expect(attrIdentity.get(3).isDisplayed()).toBe(false);
      expect(attrIdentity.get(4).isDisplayed()).toBe(false);

      // ********************************
      // Income
      // ********************************      
      var elementDocEntryIncome = validation_page.getDocEntryIncome();
      elementDocEntryIncome.getText().then(function(text){expect(text).toContain('Ingresos')});      

      // selected item
      var selectedIncome=elementDocEntryIncome.all(by.css('.navbar-nav > li > a'));            
      expect(selectedIncome.count()).toBe(1);
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Nómina');

      // list item
      var listIncome=elementDocEntryIncome.all(by.css('.dropdown-menu > li > a'));      
      expect(listIncome.count()).toBe(3);
      expect(listIncome.get(0).getAttribute('value')).toBe('PAYSHEET_LABEL');      
      expect(listIncome.get(0).getAttribute('innerText')).toContain('Nómina');
      expect(listIncome.get(1).getAttribute('value')).toBe('IRPF_LABEL');
      expect(listIncome.get(1).getAttribute('innerText')).toContain('IRPF');
      expect(listIncome.get(2).getAttribute('value')).toBe('DOC_AUTO_LABEL');
      expect(listIncome.get(2).getAttribute('innerText')).toContain('Automático');


      // input attributes, as defined in model and for the actual selected document
      var attrIncome=elementDocEntryIncome.all(by.css('.input'));
      expect(attrIncome.count()).toBe(1);
      expect(attrIncome.get(0).isDisplayed()).toBe(true);

      // ********************************
      // Receipt
      // ********************************      
      var elementDocEntryReceipt = validation_page.getDocEntryReceipt();
      elementDocEntryReceipt.getText().then(function(text){expect(text).toContain('Justificantes')});      

      // selected item
      var selectedReceipt=elementDocEntryReceipt.all(by.css('.navbar-nav > li > a'));            
      expect(selectedReceipt.count()).toBe(1);
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Justificante bancario');

      // list item
      var listReceipt=elementDocEntryReceipt.all(by.css('.dropdown-menu > li > a'));      
      expect(listReceipt.count()).toBe(3);
      expect(listReceipt.get(0).getAttribute('value')).toBe('BANK_RECEIPT_LABEL');      
      expect(listReceipt.get(0).getAttribute('innerText')).toContain('Justificante bancario');
      expect(listReceipt.get(1).getAttribute('value')).toBe('RECEIPT_LABEL');
      expect(listReceipt.get(1).getAttribute('innerText')).toContain('Recibo');
      expect(listReceipt.get(2).getAttribute('value')).toBe('DOC_AUTO_LABEL');
      expect(listReceipt.get(2).getAttribute('innerText')).toContain('Automático');      

      // input attributes, as defined in model and for the actual selected document
      var attrReceipt=elementDocEntryReceipt.all(by.css('.input'));
      expect(attrReceipt.count()).toBe(1);
      expect(attrReceipt.get(0).isDisplayed()).toBe(true);

    });


    it('should be able to select between different document types in every docentry selector', function() {

      // ********************************
      // Identity
      // ********************************      
      var elementDocEntryIdentity = validation_page.getDocEntryIdentity();

      var listIdentity=elementDocEntryIdentity.all(by.css('.dropdown-menu > li > a'));      
      expect(listIdentity.count()).toBe(4);

      // initial selected item
      var selectedIdentity=elementDocEntryIdentity.all(by.css('.navbar-nav > li > a'));            
      expect(selectedIdentity.count()).toBe(1);
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('DNI');

      // input attributes, as defined in model and for the actual selected document
      var attrIdentity=elementDocEntryIdentity.all(by.css('.input'));
      expect(attrIdentity.count()).toBe(5);
      expect(attrIdentity.get(0).isDisplayed()).toBe(false);
      expect(attrIdentity.get(1).isDisplayed()).toBe(false);
      expect(attrIdentity.get(2).isDisplayed()).toBe(false);
      expect(attrIdentity.get(3).isDisplayed()).toBe(false);
      expect(attrIdentity.get(4).isDisplayed()).toBe(false);

      // select second item from list
      selectedIdentity.get(0).click();
      listIdentity.get(1).click();
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('NIE');

      // input attributes, as defined in model and for the actual selected document
      attrIdentity=elementDocEntryIdentity.all(by.css('.input'));
      expect(attrIdentity.count()).toBe(5);
      expect(attrIdentity.get(0).isDisplayed()).toBe(false);

      // select third item from list
      selectedIdentity.get(0).click();
      listIdentity.get(2).click();
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('Pasaporte');

      // input attributes, as defined in model and for the actual selected document
      attrIdentity=elementDocEntryIdentity.all(by.css('.input'));
      expect(attrIdentity.count()).toBe(5);
      expect(attrIdentity.get(0).isDisplayed()).toBe(false);      

      // select fourth item from list
      selectedIdentity.get(0).click();
      listIdentity.get(3).click();
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('Automático');

      // input attributes, as defined in model and for the actual selected document
      attrIdentity=elementDocEntryIdentity.all(by.css('.input'));
      expect(attrIdentity.count()).toBe(1);
      expect(attrIdentity.get(0).isDisplayed()).toBe(false);      

      // ---
      // Note:
      // Income DocEntry and Receipt DocEntry are locked until load an image on Identity DocEntry, so
      // the document list in the select are not visible and can not be selected in this point
      // ---      

      // ********************************
      // Income
      // ********************************      
      var elementDocEntryIncome = validation_page.getDocEntryIncome();

      var listIncome=elementDocEntryIncome.all(by.css('.dropdown-menu > li > a'));      
      expect(listIncome.count()).toBe(3);

      // initial selected item
      var selectedIncome=elementDocEntryIncome.all(by.css('.navbar-nav > li > a'));            
      expect(selectedIncome.count()).toBe(1);
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Nómina');

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
      var elementDocEntryReceipt = validation_page.getDocEntryReceipt();

      var listReceipt=elementDocEntryReceipt.all(by.css('.dropdown-menu > li > a'));      
      expect(listReceipt.count()).toBe(3);

      // initial selected item
      var selectedReceipt=elementDocEntryReceipt.all(by.css('.navbar-nav > li > a'));            
      expect(selectedReceipt.count()).toBe(1);
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Justificante bancario');

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

      var ipsaImgList = validation_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);
      var path = require('path');
      var absolutePath = path.resolve(__dirname, dni_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);

      // ... and now should be able to select document type in the Income and Receipt DocEntries

      // ********************************
      // Income
      // ********************************      

      // initial selected item
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Nómina');

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
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Automático');

      // input attributes, as defined in model and for the actual selected document
      attrIncome=elementDocEntryIncome.all(by.css('.input'));
      expect(attrIncome.count()).toBe(2);
      expect(attrIncome.get(0).isDisplayed()).toBe(true);

      // ********************************
      // Receipt
      // ********************************      

      // initial selected item
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Justificante bancario');

      // try to select the second item from list, it can
      selectedReceipt.get(0).click();
      expect(listReceipt.get(1).isDisplayed()).toBe(true);
      listReceipt.get(1).click();
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Recibo');

      // input attributes, as defined in model and for the actual selected document
      attrReceipt=elementDocEntryReceipt.all(by.css('.input'));
      expect(attrReceipt.count()).toBe(0);

      // try to select the third item from list, it can
      selectedReceipt.get(0).click();
      expect(listReceipt.get(2).isDisplayed()).toBe(true);
      listReceipt.get(2).click();
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Automático');

      // input attributes, as defined in model and for the actual selected document
      attrReceipt=elementDocEntryReceipt.all(by.css('.input'));
      expect(attrReceipt.count()).toBe(2);

    });


    it('Should charge validations when the automatic type is selected in identity', function() {

      // ********************************
      // Identity
      // ********************************      
      var elementDocEntryIdentity = validation_page.getDocEntryIdentity();
      elementDocEntryIdentity.getText().then(function(text){expect(text).toContain('Identidad')});      

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
      expect(listIdentity.get(2).getAttribute('innerText')).toContain('Pasaporte');
      expect(listIdentity.get(3).getAttribute('value')).toBe('DOC_AUTO_LABEL');      
      expect(listIdentity.get(3).getAttribute('innerText')).toContain('Automático');

      // input attributes, as defined in model and for the actual selected document
      var attrIdentity=elementDocEntryIdentity.all(by.css('.input'));
      expect(attrIdentity.count()).toBe(5);
      expect(attrIdentity.get(0).isDisplayed()).toBe(false);
      expect(attrIdentity.get(1).isDisplayed()).toBe(false);
      expect(attrIdentity.get(2).isDisplayed()).toBe(false);
      expect(attrIdentity.get(3).isDisplayed()).toBe(false);
      expect(attrIdentity.get(4).isDisplayed()).toBe(false);

    });


    it('should set a DNI when automatic is selected and OCR return DNI in Identity', function() {

      var ipsaImgList = validation_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);
      var path = require('path');
      var absolutePath;

      // ********************************
      // Identity
      // ********************************      
      var elementPanelTitleIdentity = validation_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identidad")});      
      var elementDocEntryIdentity = validation_page.getDocEntryIdentity();
      // selected item
      var selectedIdentity=elementDocEntryIdentity.all(by.css('.navbar-nav > li > a'));            
      expect(selectedIdentity.count()).toBe(1);
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('DNI');

      // select item Automatic from list
      var listIdentity=elementDocEntryIdentity.all(by.css('.dropdown-menu > li > a'));      
      expect(listIdentity.count()).toBe(4);      

      selectedIdentity.get(0).click();
      listIdentity.get(3).click();
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('Automático');

      var elementPanelIdentity = validation_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Documento a la espera")});      
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
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Procesando documento")});      
      
      browser.sleep(waitTimeOut);
      // selected item has changed from automatic to real recognized type
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('DNI');

      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identidad DNI")});            
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Documento recibido e identificado")});

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

      var ipsaImgList = validation_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);
      var path = require('path');
      var absolutePath;

      // ********************************
      // Identity
      // ********************************      
      var elementPanelTitleIdentity = validation_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identidad")});      
      var elementDocEntryIdentity = validation_page.getDocEntryIdentity();
      // selected item
      var selectedIdentity=elementDocEntryIdentity.all(by.css('.navbar-nav > li > a'));            
      expect(selectedIdentity.count()).toBe(1);
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('DNI');

      absolutePath = path.resolve(__dirname, dni_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);
      browser.sleep(300);          
      var elementPanelIdentity = validation_page.getPanelIdentity();      
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Procesando documento")});      
      
      browser.sleep(waitTimeOut);

      // ********************************
      // Receipt
      // ********************************      
      var elementDocEntryReceipt = validation_page.getDocEntryReceipt();
      elementDocEntryReceipt.getText().then(function(text){expect(text).toContain('Justificantes')});      

      // selected item
      var selectedReceipt=elementDocEntryReceipt.all(by.css('.navbar-nav > li > a'));            
      expect(selectedReceipt.count()).toBe(1);
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Justificante bancario');

      // list item
      var listReceipt=elementDocEntryReceipt.all(by.css('.dropdown-menu > li > a'));      
      expect(listReceipt.count()).toBe(3);
      expect(listReceipt.get(0).getAttribute('value')).toBe('BANK_RECEIPT_LABEL');      
      expect(listReceipt.get(0).getAttribute('innerText')).toContain('Justificante bancario');
      expect(listReceipt.get(1).getAttribute('value')).toBe('RECEIPT_LABEL');
      expect(listReceipt.get(1).getAttribute('innerText')).toContain('Recibo');
      expect(listReceipt.get(2).getAttribute('value')).toBe('DOC_AUTO_LABEL');
      expect(listReceipt.get(2).getAttribute('innerText')).toContain('Automático');      

      // select item Automatic from list
      selectedReceipt.get(0).click();
      listReceipt.get(2).click();
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Automático');

      // input attributes, as defined in model and for the actual selected document
      var attrReceipt=elementDocEntryReceipt.all(by.css('.input'));
      expect(attrReceipt.count()).toBe(2);
      expect(attrReceipt.get(0).isDisplayed()).toBe(true);
      expect(attrReceipt.get(1).isDisplayed()).toBe(false);      

      var elementPanelReceipt = validation_page.getPanelReceipt();
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Documento a la espera")});      

      validation_page.setAutomaticAccount(bankreceipt_account);
      absolutePath = path.resolve(__dirname, bankreceipt_resource);
      ipsaImgList.get(1).sendKeys(absolutePath);

      browser.sleep(300);          
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Procesando documento")});

      browser.sleep(waitTimeOut);
      // selected item has changed from automatic to real recognized type
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Justificante bancario');

      // and the introduced data has been moved from automatic model to real recognized type model
      expect(validation_page.getBankReceiptAccount()).toContain(bankreceipt_account);

      // Check the final expected results in the screen
      var elementPanelTitleReceipt = validation_page.getPanelTitleReceipt();      
      elementPanelTitleReceipt.getText().then(function(text){expect(text).toContain("Justificantes Justificante bancario")});                  
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Documento recibido e identificado")});
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
      expect(selectedReceipt.get(0).getAttribute('innerText')).toContain('Automático');
      expect(validation_page.getAutomaticAccount()).toBe('');      

    });


    it('should set a Paysheet when automatic is selected and OCR return Paysheet in Income', function() {

      var ipsaImgList = validation_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);
      var path = require('path');
      var absolutePath;

      // ********************************
      // Identity
      // ********************************      
      var elementPanelTitleIdentity = validation_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identidad")});      
      var elementDocEntryIdentity = validation_page.getDocEntryIdentity();
      // selected item
      var selectedIdentity=elementDocEntryIdentity.all(by.css('.navbar-nav > li > a'));            
      expect(selectedIdentity.count()).toBe(1);
      expect(selectedIdentity.get(0).getAttribute('innerText')).toContain('DNI');

      absolutePath = path.resolve(__dirname, dni_resource);
      ipsaImgList.get(0).sendKeys(absolutePath);
      browser.sleep(300);          
      var elementPanelIdentity = validation_page.getPanelIdentity();      
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Procesando documento")});      
      
      browser.sleep(waitTimeOut);

      // ********************************
      // Income
      // ********************************
      var elementDocEntryIncome = validation_page.getDocEntryIncome();
      elementDocEntryIncome.getText().then(function(text){expect(text).toContain('Ingresos')});      

      // selected item
      var selectedIncome=elementDocEntryIncome.all(by.css('.navbar-nav > li > a'));            
      expect(selectedIncome.count()).toBe(1);
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Nómina');

      // list item
      var listIncome=elementDocEntryIncome.all(by.css('.dropdown-menu > li > a'));      
      expect(listIncome.count()).toBe(3);
      expect(listIncome.get(0).getAttribute('value')).toBe('PAYSHEET_LABEL');      
      expect(listIncome.get(0).getAttribute('innerText')).toContain('Nómina');
      expect(listIncome.get(1).getAttribute('value')).toBe('IRPF_LABEL');
      expect(listIncome.get(1).getAttribute('innerText')).toContain('IRPF');
      expect(listIncome.get(2).getAttribute('value')).toBe('DOC_AUTO_LABEL');
      expect(listIncome.get(2).getAttribute('innerText')).toContain('Automático');

      // select item Automatic from list
      selectedIncome.get(0).click();
      listIncome.get(2).click();
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Automático');

      // input attributes, as defined in model and for the actual selected document
      var attrIncome=elementDocEntryIncome.all(by.css('.input'));
      expect(attrIncome.count()).toBe(2);
      expect(attrIncome.get(0).isDisplayed()).toBe(true);
      expect(attrIncome.get(1).isDisplayed()).toBe(false);      

      var elementPanelIncome = validation_page.getPanelIncome();
      elementPanelIncome.getText().then(function(text){expect(text).toContain("Documento a la espera")});

      validation_page.setAutomaticAmount(paysheet_amount);
      absolutePath = path.resolve(__dirname, paysheet_resource);
      ipsaImgList.get(2).sendKeys(absolutePath);

      browser.sleep(300);          
      elementPanelIncome.getText().then(function(text){expect(text).toContain("Procesando documento")});

      browser.sleep(waitTimeOut);
      // selected item has changed from automatic to real recognized type
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Nómina');

      // and the introduced data has been moved from automatic model to real recognized type model
      expect(validation_page.getPaysheetAmount()).toContain(paysheet_amount);

      // Check the final expected results in the screen
      var elementPanelTitleIncome = validation_page.getPanelTitleIncome();
      elementPanelTitleIncome.getText().then(function(text){expect(text).toContain("Ingresos Nómina")});      

      elementPanelIncome.getText().then(function(text){expect(text).toContain("Documento recibido e identificado")});
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
      expect(selectedIncome.get(0).getAttribute('innerText')).toContain('Automático');
      expect(validation_page.getAutomaticAmount()).toBe('');      

    });


  });


  function init_test() {
    browser.sleep(500);    
    browser.get('http://localhost:8083/');  
    browser.manage().window().maximize(); 
    try {
      element(by.css('.glyphicon-log-out')).isDisplayed().then(function (isVisible) {
        if (isVisible) {
          //console.log("init_test validation_page_logout isVisible=" + isVisible);              
          validation_page.logOut();        
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

