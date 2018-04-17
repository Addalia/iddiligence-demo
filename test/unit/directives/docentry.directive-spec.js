describe('ClodIDoc ipsa-docentry directive', function() {
  var $rootScope,
    $httpBackend,
    $scope,
    $compile,
    element,
    $body = $('body'),
    identitymodel,
    selected, 
    simpleHtml;

    identitymodel = "  ["+ 
"      {"+ 
"          title: \'DNI\',"+ 
"          doctype: \'Dni\',"+ 
"          fields: ["+ 
"            {label: \'Número\', attrname: \'dni_number\', controltype: \'text\', required: \'true\', show: \'true\', id: \'dninumber\'},"+ 
"            {label: \'Nombre\', attrname: \'dni_first_name\', controltype: \'text\', required: \'false\', show: \'true\', id: \'dnifirstname\'},"+ 
"            {label: \'Apellidos\', attrname: \'dni_last_name\', controltype: \'text\', required: \'false\', show: \'true\', id: \'dnilastname\'},"+ 
"            {label: \'Fecha nacimiento\', attrname: \'dni_birthdate\', controltype: \'text\', required: \'false\', show: \'false\', id: \'dnibirthdate\'},"+ 
"            {label: \'Validez\', attrname: \'dni_expiration_date\', controltype: \'text\', required: \'false\', show: \'false\', id: \'dniexpirationdate\'}                        "+ 
"          ]"+ 
"      },"+ 
"      {"+ 
"          title: \'NIE\',"+ 
"          doctype: \'NIE\',              "+ 
"          fields: ["+ 
"            {label: \'Número\', attrname: \'nie_number\', controltype: \'text\', required: \'false\', show: \'true\', id: \'nienumber\'}"+ 
"          ]"+ 
"      },"+ 
"      {"+ 
"          title: \'Pasaporte\',"+ 
"          doctype: \'Passport\',              "+ 
"          fields: []"+ 
"      }      "+ 
"    ]";

    selected = 
"      {"+ 
"          title: \'DNI\',"+ 
"          doctype: \'Dni\',"+ 
"          fields: ["+ 
"            {label: \'Número\', attrname: \'dni_number\', controltype: \'text\', required: \'true\', show: \'true\', id: \'dninumber\'},"+ 
"            {label: \'Nombre\', attrname: \'dni_first_name\', controltype: \'text\', required: \'false\', show: \'true\', id: \'dnifirstname\'},"+ 
"            {label: \'Apellidos\', attrname: \'dni_last_name\', controltype: \'text\', required: \'false\', show: \'true\', id: \'dnilastname\'},"+ 
"            {label: \'Fecha nacimiento\', attrname: \'dni_birthdate\', controltype: \'text\', required: \'false\', show: \'false\', id: \'dnibirthdate\'},"+ 
"            {label: \'Validez\', attrname: \'dni_expiration_date\', controltype: \'text\', required: \'false\', show: \'false\', id: \'dniexpirationdate\'}                        "+ 
"          ]"+ 
"      }"; 


    simpleHtml =  '<div id="test-ipsa-docentry"> ' +
                  '<ipsa-doc-entry ' + 
                  '  title = "IDENTITY_LEGEND" ' +
                  '  model = "' + identitymodel + '"' +
                  '  disable = "disableIdentityDocEntry" ' +
                  '  selected = "' + selected + '"' +
                  '  itemclick = "onIdentityClick(document)" ' +
                  '  onupload = "uploadIdentityImage($dataURI)" ' +
                  '  disableimage = "disableIdentityImage" ' +                  
                  '  image = "image.Identity" ' +
                  '  clearimage = "clearIdentityImage" ' +
                  '  inputstyle = "default" ' +
                  '  clear = "clearIdentityDocEntry"> ' +
                  '</ipsa-doc-entry>'  +
                  '</div>';


  //console.log('identitymodel=' + identitymodel);  
  //console.log('selected=' + selected);  
  //console.log('simpleHtml=' + simpleHtml);  

  beforeEach(function() {
    module('app');
    module('app.directives');

    inject(function($injector,_$httpBackend_) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $httpBackend = _$httpBackend_;


      $httpBackend.whenGET('i18n/es-es.json')
        .respond({ "APP_TITLE" : "Cloud IDoc",
          "LOCALE_EN" : "Inglés",
          "LOCALE_ES" : "Español",
        });

      $httpBackend.flush();

      $scope = $rootScope.$new();
      element = $compile(angular.element(simpleHtml))($scope);

    });

    $body.append(element);
    $rootScope.$digest();
  });

  it('Should replace the element ipsa-docentry with the appropriate content', function() {
    //console.log('test-ipsa-docentry=' + $('test-ipsa-docentry').children());
    //console.log('element=' + element.html());
    expect(element.html()).toContain('navbar-header');
    expect(element.html()).toContain('form name="inputform"');    
  });

  it('Should generate an HTML identifier containing the title attribute', function() {
    expect(element.html()).toContain('id="ipsa-docentry-IDENTITY_LEGEND"');
  });

  it('Should generate an HTML identifier containing the ipsa-img id attribute', function() {
    expect(element.html()).toContain('id="ipsa-img-IDENTITY_LEGEND"');    
  });

  it('Should contain all the documents typename into ipsa-docentry', function() {
    expect(element.html()).toContain('DNI');
    expect(element.html()).toContain('NIE');
    expect(element.html()).toContain('Pasaporte');
  });

  it('Sould contain all the DNI five fields into ipsa-docentry', function() {
    //var count = element.all(by.css('.form-control')).count();
    //var count = document.querySelectorAll('.form-control').length;    
    //console.log('count=' + count);    
    //expect(count).toBe(5);
    expect(element.html()).toContain('Número');
    expect(element.html()).toContain('Nombre');    
    expect(element.html()).toContain('Apellidos');    
    expect(element.html()).toContain('Fecha nacimiento');    
    expect(element.html()).toContain('Validez');    
  });  


});

