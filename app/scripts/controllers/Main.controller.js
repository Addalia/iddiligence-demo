(function () {
  'use strict';

angular.module('app.MainController', ['ngResource']);
 
  function MainController($rootScope, $scope, $route,$routeParams, $location, $translate, tmhDynamicLocale, PageStatus, User) {
    this.username = '';
    this.name = PageStatus.getAppName();
    var self = this;

    this.actualPage = function(){
      return PageStatus.getActualPage();
    };

    this.logout = function() {
      if(PageStatus.isUserLogged() === true){
        PageStatus.setUserNotLogged();
        User.delete()
          .$promise.then(
            function () {
              PageStatus.setUserName('');
              $location.path('/');
            },
            function (error) {
              PageStatus.goLoginIfUnauthorized(error.status);
              $location.path('/');
            });
      } else {
        $location.path('/');
      }
    };

    this.getPageStatus = function(){
      return PageStatus;
    };

    this.changeLocale = function(locale) {
      $translate.use(locale);
      tmhDynamicLocale.set(locale);
      PageStatus.setDefaultLanguage(locale);
    };

    this.now = function () {
      return new Date();
    };

    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      console.log('--> $routeChangeError', event, current, previous, rejection);
      $location.path('/');
    });

    PageStatus.addInCallBack('main',function(){
      self.username = PageStatus.getUserName();
    });

    PageStatus.addOutCallBack('main',function(){
      self.username = '';
    });
    $scope.$watch(function(){
      self.changeLocale(PageStatus.getDefaultLanguage());
      self.name = PageStatus.getAppName();
    });

  }
  MainController.$inject=['$rootScope', '$scope', '$route', '$routeParams', '$location', '$translate', 'tmhDynamicLocale','PageStatus', 'User'];  
   

  angular
  .module('app.controllers')
  .controller('MainController', MainController);

})();
