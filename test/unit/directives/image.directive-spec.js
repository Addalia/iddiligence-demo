describe('ClodIDoc ipsa-image directive', function() {
  var $rootScope,
    $httpBackend,
    $scope,
    $compile,
    element,
    $body = $('body'),
    simpleHtml =  '<div id="test-ipsa-image"> ' +
                  '<ipsa-image title = "IDENTITY_LEGEND" ' +
                  '  onupload = "validationDemoCtrl.uploadDniImage($dataURI)" ' +
                  '  disable = "validationDemoCtrl.disableDniImage" ' +
                  '  clear = "validationDemoCtrl.clearDniImage"> ' +
                  '</ipsa-image>'  +
                  '</div>';

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

  it('Should replace the element ipsa-image with the appropriate content', function() {
    expect(element.html()).toContain('ngf-drop="" ngf-select="" ng-model="picFile"');
  });

  it('Should generate an HTML identifier containing the title attribute', function() {
    expect(element.html()).toContain('id="ipsa-image-IDENTITY_LEGEND"');
  });

});
