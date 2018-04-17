describe('ClodIDoc validation directive', function() {
  var $rootScope,
    $httpBackend,
    $scope,
    $compile,
    el,
    $body = $('body'),
    simpleHtml = '<div id="test"> ' +
                '   <div idoc-validation title="IDENTITY_LEGEND", ' +
                '     status="dis", ' +
                '     docattribs="{atribnombre: {value:ok, checks:[ok, ko]} , atribapelli: {value:dis, checks:[ok, ko]} }", ' +
                '     validations="{coinci:\'ok\'}"> ' +
                '   </div> ' +
                ' </div>';

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
      el = $compile(angular.element(simpleHtml))($scope);
    });

    $body.append(el);
    $rootScope.$digest();
  });

  it('Should generate an HTML with a tittle', function() {
    expect(el.html()).toContain('IDENTITY_LEGEND');
  });

  it('Should be a states', function() {
    expect(el.html()).toContain('dis');
    expect(el.html()).toContain('ok');
    expect(el.html()).toContain('ko');
    expect(el.html()).toContain('pending');
  });

  it('Should generate an HTML with two attributes', function() {
    expect(el.html()).toContain('control-label text-justify text-nowrap text-sm-right" style="padding-top: 0.5em;">atribapelli</label>');
    expect(el.html()).toContain('control-label text-justify text-nowrap text-sm-right" style="padding-top: 0.5em;">atribnombre</label>');
  });

  it('Should generate an HTML with a validation', function() {
    expect(el.html()).toContain('class="glyphicon validation glyphicon-ok text-success"');
  });

});

