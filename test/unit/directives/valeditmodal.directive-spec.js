describe('ClodIDoc validation edit directive', function() {
  var $rootScope,
  $httpBackend,
  $scope,
  $compile,
  injector,
  OpMngr,
  elem,
  status,
  getOpStatCalled,
  setOpStatCalled,
  successCalled,
  $body = $('body'),
  simpleHtml =  '<div id="test-val-edit"> ' +
  '<validation-edit-modal ' +
  '    show="true" ' +
  '    errcallback="errorCallBack" ' +
  '    succcallback="succcallback" ' +
  '    enableCondition="checkPVIReady" ' +
  '></validation-edit-modal> '+
  '</div>';



  var fakePromise = function(isSuccess,value, callback){
    return {
      then: function(success,error){
        fakePromiseValue = value;
        if(isSuccess){
          if(callback){callback();}
          success(value);
        } else {
          if(callback){callback();}
          error(value);
        }
      }
    };
  };

  beforeEach(function() {
    status = {"documentStatus":"OK","operationTerminated":"0","validations":[{"name":"MandatoryDocumentsValidation","description":"VALIDATION_MANDATORY_IDENTITY","status":"OK"},{"name":"MandatoryDocumentsValidation","description":"VALIDATION_MANDATORY_INCOME","status":"OK"},{"name":"MandatoryDocumentsValidation","description":"VALIDATION_MANDATORY_RECEIPT","status":"OK"}],"documents":[{"documentStatus":"OK","documentType":"Dni","validations":[{"name":"DniValidation","description":"VALIDATION_IDENTIFICATION_NUMBER","status":"OK"}],"views":[{"documentStatus":"OK","idView":"4200478015540"}],"idDocument":"4200478015539"},{"documentStatus":"OK","documentType":"Bank_Receipt","validations":[{"name":"BankReceiptValidation","description":"VALIDATION_DNI_NUMBER","status":"OK"}],"views":[{"documentStatus":"OK","idView":"4200478015542"}],"idDocument":"4200478015541"},{"documentStatus":"OK","documentType":"Paysheet","validations":[{"name":"PaysheetValidation","description":"VALIDATION_DNI_NUMBER","status":"OK"},{"name":"PaysheetValidation","description":"VALIDATION_FIRST_NAME","status":"KO"}],"views":[{"documentStatus":"OK","idView":"4200478015544"}],"idDocument":"4200478015543"}]};
    getOpStatCalled = false;
    setOpStatCalled = false;
    successCalled = false;
    function OpMngrConst(){
      return {
        getOpStat : function (){
          return fakePromise(true, status, function(){getOpStatCalled = true});
        },
        setOpStat : function (){
          return fakePromise(true, status, function(){setOpStatCalled = true});
        }
      }
    };
    OpMngr = OpMngrConst();
    module('app');
    module('app.directives',function($provide){
      $provide.value('OperationManager', OpMngr);
    });

    inject(function($injector,_$httpBackend_) {
      injector = $injector;
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      $httpBackend = _$httpBackend_;

      $scope = $rootScope.$new();
      $scope.errcallback = fakePromise(true, '');
      //$scope.succCallBack = fakePromise(true, '');
      $scope.succcallback = function(){return fakePromise(true, '', function(){successCalled = true});};
      $scope.checkPVIReady = function(){return true;};

      elem = $compile(angular.element(simpleHtml))($scope);

      $httpBackend.whenGET('i18n/es-es.json')
      .respond({ "APP_TITLE" : "Cloud IDoc",
        "LOCALE_EN" : "Inglés",
        "LOCALE_ES" : "Español",
      });
      $httpBackend.whenGET('http://localhost:8080/IDocValidationService/resources/operations/status')
      .respond(200, status);

      $httpBackend.flush();
    });

    while ($body.firstChild) {
      $body.removeChild($body.firstChild);
    }
    $body.append(elem);
    $rootScope.$digest();
  });

  it('Should call getOpStat on build', function() {
    expect(getOpStatCalled).toBe(true);
  });

  it('Should call just success on save', function() {
    $('#pvi_modal_ok').click();
    expect(successCalled).toBe(true);
    expect(setOpStatCalled).toBe(false);
  });

  it('Should call success on save with modifications', function() {
    $('#val-VALIDATION_DNI_NUMBER').click();
    $('#pvi_modal_ok').click();
    expect(setOpStatCalled).toBe(true);
    expect(successCalled).toBe(true);
  });

});

