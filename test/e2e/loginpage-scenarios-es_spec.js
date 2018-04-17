'use strict';

describe('ValidationDemoApp', function() {
  var login_page;              
  var validation_page;
  var pvi_validation_page;
  var waitTimeOut = 5000;

  login_page = require('./page/login_page.js');                
  validation_page = require('./page/validation_page.js');                    
  pvi_validation_page = require('./page/pvi_validation_page.js');

  beforeEach(function() {
    init_test();
  });


  describe('Login page', function() {

    it('should access with a correct user to DemoApp page', function() {
      login_page.setUser('admin');
      login_page.setPassword('admin');   
      login_page.selectProduct('Solicitud de seguros'); 
      login_page.clickSubmitButton('DemoApp');
      expect(validation_page.getPanelTitle()).toBe('Solicitud de seguros');
      expect(validation_page.getLeftLogo().isDisplayed()).toBe(true);
      expect(validation_page.getRightLogo().isDisplayed()).toBe(true);
      validation_page.logOut();
    });

    it('should access with a correct user to IdentityApp page', function() {
      login_page.setUser('admin');
      login_page.setPassword('admin');    
      login_page.selectProduct('Validación de identidad');
      login_page.clickSubmitButton('IdentityApp');
      expect(validation_page.getPanelTitle()).toBe('Validación de identidad');
      validation_page.logOut();
    });

    it('should access with a correct user to PVIApp page', function() {
      login_page.setUser('admin');
      login_page.setPassword('admin');    
      login_page.selectProduct('Operaciones PVI');
      login_page.clickSubmitButton('PVIApp');
      expect(pvi_validation_page.getPanelTitle()).toBe('Operaciones PVI');
      pvi_validation_page.logOut();
    });
	
    it('should not access with a wrong user', function() {
      login_page.setUser('wronguser');
      login_page.setPassword('wrongpassword');    
      login_page.clickSubmitButton('DemoApp');      
      expect(login_page.getMessage()).toContain('Usuario o contraseña incorrectos');
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

