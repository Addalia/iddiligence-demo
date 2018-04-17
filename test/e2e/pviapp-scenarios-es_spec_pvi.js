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
      login_page.selectProduct('Operaciones PVI');
      pvi_validation_page = login_page.loginAsAdmin('PVIApp');
    });

    afterEach(function() {
      pvi_validation_page.logOut();
    });

    it('should set an image to every drop area, show all complete results, click terminate and click send', function() {
      var ipsaImgList = pvi_validation_page.getAllIpsaImg();
      expect(ipsaImgList.count()).toEqual(3);
      var path = require('path');
      var absolutePath;

      // ********************************
      // Identity
      // ********************************
      var elementPanelTitleIdentity = pvi_validation_page.getPanelTitleIdentity();
      elementPanelTitleIdentity.getText().then(function(text){expect(text).toContain("Identidad")});

      var elementPanelIdentity = pvi_validation_page.getPanelIdentity();
      elementPanelIdentity.getText().then(function(text){expect(text).toContain("Documento a la espera")});

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
      var elementPanelTitleReceipt = pvi_validation_page.getPanelTitleReceipt();
      elementPanelTitleReceipt.getText().then(function(text){expect(text).toContain("Justificantes")});

      var elementPanelReceipt = pvi_validation_page.getPanelReceipt();
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Documento a la espera")});

      pvi_validation_page.setBankReceiptAccount(bankreceipt_account);
      absolutePath = path.resolve(__dirname, bankreceipt_resource);
      ipsaImgList.get(1).sendKeys(absolutePath);

      // Check if only two first images has content
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
      browser.sleep(300);
      elementPanelReceipt.getText().then(function(text){expect(text).toContain("Procesando documento")});
      browser.sleep(waitTimeOut);

      // ********************************
      // Income
      // ********************************
      var elementPanelTitleIncome = pvi_validation_page.getPanelTitleIncome();
      elementPanelTitleIncome.getText().then(function(text){expect(text).toContain("Ingresos")});

      var elementPanelIncome = pvi_validation_page.getPanelIncome();
      elementPanelIncome.getText().then(function(text){expect(text).toContain("Documento a la espera")});

      pvi_validation_page.setPaysheetAmount(paysheet_amount);
      absolutePath = path.resolve(__dirname, paysheet_resource);
      ipsaImgList.get(2).sendKeys(absolutePath);

      // Check if all three images has content
      var items = element.all(by.css('.thumb'));
      expect(items.count()).toEqual(6);
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
		    expect(bankreceipt_account).toBe(items[7].getAttribute('value'));
		    expect(paysheet_amount).toBe(items[8].getAttribute('value'));

		// check docentry directive enabled items status
        expect(false).toBe(items[0].isEnabled());
        expect(false).toBe(items[1].isEnabled());
        expect(false).toBe(items[2].isEnabled());
        expect(false).toBe(items[3].isEnabled());
        expect(false).toBe(items[4].isEnabled());
        expect(false).toBe(items[5].isEnabled());
		    expect(false).toBe(items[6].isEnabled());
		    expect(true).toBe(items[7].isEnabled());
		    expect(true).toBe(items[8].isEnabled());
      });

      // Check expected buttons state
      expect(true).toBe(element(by.buttonText('Nuevo')).isEnabled());
      expect(true).toBe(element(by.buttonText('Cancelar')).isEnabled());
      expect(true).toBe(element(by.buttonText('Terminar')).isEnabled());
      expect(false).toBe(element(by.buttonText('Envio PVI')).isEnabled());

      pvi_validation_page.clickTerminateButton();
      browser.sleep(6000);

      expect(true).toBe(element(by.buttonText('Nuevo')).isEnabled());
      expect(true).toBe(element(by.buttonText('Cancelar')).isEnabled());
      expect(false).toBe(element(by.buttonText('Terminar')).isEnabled());
      expect(true).toBe(element(by.buttonText('Envio PVI')).isEnabled());


      //click send operation to PVI
      pvi_validation_page.clickSendButton();

      expect('Editar validaciones').toBe(pvi_validation_page.getModalTittle().getText());


      //validations DNI

      element.all(by.css('.panel-success')).then(function(items) {
        expect(5).toBe(items.length);
            items[0].all(by.css('.panel-heading')).then(function(items0) {
                expect(items0.length).toBe(1);
                expect('Operación OK').toBe(items0[0].getText());
            });

            items[1].all(by.css('.panel-heading')).then(function(items1) {
                expect(items1.length).toBe(1);
                expect('Reverso DNI OK').toBe(items1[0].getText());
            });


            items[1].all(by.css('.panel-body')).all(by.css('.ng-scope')).then(function(items1b) {
                expect(8).toBe(items1b.length);
                expect('El número de identificación ha sido reconocido.').toBe(items1b[0].getText());
                expect('No ha caducado.').toBe(items1b[1].getText());
                expect('El número de identificación introducido por el usuario en el anverso del documento coincide con lo reconocido en el reverso.').toBe(items1b[2].getText());
                expect('El nombre introducido por el usuario en el anverso del documento coincide con lo reconocido en el reverso.').toBe(items1b[3].getText());
                expect('Los apellidos introducidos por el usuario en el anverso del documento coincide con lo reconocido en el reverso.').toBe(items1b[4].getText());
                expect('La fecha de nacimiento introducida por el usuario en el anverso del documento coincide con lo reconocido en el reverso.').toBe(items1b[5].getText());
                expect('La fecha de caducidad introducida por el usuario en el anverso del documento coincide con lo reconocido en el reverso.').toBe(items1b[6].getText());
                expect('Los metadatos no indican manipulaciones del documento.').toBe(items1b[7].getText());

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
                expect('Justificante bancario OK').toBe(items2[0].getText());
            });

            items[2].all(by.css('.panel-body')).all(by.css('.ng-scope')).then(function(item2b) {
                expect(item2b.length).toBe(5);
                expect('El número de identificación se encuentra en el texto reconocido.').toBe(item2b[0].getText());
                expect('El nombre se encuentra en el texto reconocido.').toBe(item2b[1].getText());
                expect('Los apellidos se encuentran en el texto reconocido.').toBe(item2b[2].getText());
                expect('El número de cuenta se encuentra en el texto reconocido.').toBe(item2b[3].getText());
                expect('Los metadatos no indican manipulaciones del documento.').toBe(item2b[4].getText());

            });


            expect('glyphicon glyphicon-ok text-success').toBe(items[2].element(by.id('val-VALIDATION_DNI_NUMBER')).getAttribute('class'));
            expect('glyphicon glyphicon-remove text-danger').toBe(items[2].element(by.id('val-VALIDATION_FIRST_NAME')).getAttribute('class'));
            expect('glyphicon glyphicon-remove text-danger').toBe(items[2].element(by.id('val-VALIDATION_LAST_NAME')).getAttribute('class'));
            expect('glyphicon glyphicon-ok text-success').toBe(items[2].element(by.id('val-VALIDATION_ACCOUNT_NUMBER')).getAttribute('class'));
            expect('glyphicon glyphicon-ok text-success').toBe(items[2].element(by.id('val-VALIDATION_METADATA')).getAttribute('class'));


            //validations paysheet
            items[3].all(by.css('.panel-heading')).then(function(item3) {
                expect(1).toBe(item3.length);
                expect('Nómina OK').toBe(item3[0].getText());
            });

            items[3].all(by.css('.panel-body')).all(by.css('.ng-scope')).then(function(item3b) {
                expect(item3b.length).toBe(12);
                expect('El número de identificación se encuentra en el texto reconocido.').toBe(item3b[0].getText());
                expect('El nombre se encuentra en el texto reconocido.').toBe(item3b[1].getText());
                expect('Los apellidos se encuentran en el texto reconocido.').toBe(item3b[2].getText());
                expect('El importe se encuentra en texto reconocido.').toBe(item3b[3].getText());
                expect('La fecha periodo de nómina se encuentra en el texto reconocido.').toBe(item3b[4].getText());
                expect('Las retenciones aplicadas en la nómina se encuentra en el texto reconocido.').toBe(item3b[5].getText());
                expect('No se encuentran embargos en el texto reconocido.').toBe(item3b[6].getText());
                expect('Los derechos pasivos se encuentra en el texto reconocido.').toBe(item3b[7].getText());
                expect('La fecha de antiguedad de la nómina se encuentra en el texto reconocido.').toBe(item3b[8].getText());
                expect('El nombre de la empresa se encuentra en el texto reconocido.').toBe(item3b[9].getText());
                expect('El CIF de la empresa se encuentra en el texto reconocido.').toBe(item3b[10].getText());
                expect('Los metadatos no indican manipulaciones del documento.').toBe(item3b[11].getText());


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
      browser.sleep(800);

      pvi_validation_page.clickPviModalOk();

      expect('Fallo al enviar la operación a PVI.').toBe(pvi_validation_page.getModalMessage());

      pvi_validation_page.clickModalOk();

      pvi_validation_page.clickSendButton();

      pvi_validation_page.putOKValidations();

      pvi_validation_page.clickPviModalOk();
      browser.sleep(800);

      expect('Operación enviada a PVI con éxito.').toBe(pvi_validation_page.getModalMessage());
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
