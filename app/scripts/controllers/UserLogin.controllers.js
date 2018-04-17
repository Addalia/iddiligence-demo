(function () {
  'use strict';

angular.module('app.UserLoginCtrl', ['app.service-user', 'app.product-types']);

  function UserLoginCtrl($scope, $location, $translate, $timeout, User, PageStatus, ProductTypes) {
    this.name = 'login';
    this.error = '';
    this.user = {};
    this.productTypes = ProductTypes;
    this.products = ProductTypes.getServices();
    this.selected = PageStatus.getDefaultProduct();
    ProductTypes.setSelected(this.selected);
    PageStatus.setActualPage(this.name);
    var self = this;

    self.updateSelectedProduct =  function() {
      if(typeof self.selected === undefined){
        self.selected = '0';
      }
      ProductTypes.setSelected(self.selected);
      PageStatus.setDefaultProduct(self.selected);
      PageStatus.setAppName(self.products[self.selected].name);
    };

    function goSelectedProduct(){
        $location.path(ProductTypes.getSelected().path);
    }

    function checkLogged(){
      if(PageStatus.isUserLogged()){
        goSelectedProduct();
      } else {
          User.get()
            .$promise.then(
              function (user) {
                PageStatus.setUserName(user.user);
                PageStatus.setUserLogged();
                goSelectedProduct(0);
              },
              function (error) {// Error
                PageStatus.setUserNotLogged();
                if(error.status !== 401 ){
                  self.error = $translate.instant('UNKNOW_SERVER_ERROR_1',{ status: error.status });
                }
              });
      }
    }

    this.login = function() {
      User.save(self.user)
      .$promise.then(
        // Success
        function () {
          PageStatus.setUserName(self.user.user);
          PageStatus.setUserLogged();
          goSelectedProduct();
        },
        // Error
        function (error) {
          PageStatus.setUserNotLogged();
          if(error.status === 401 ){
            self.error = $translate.instant('WRONG_USER');
          } else {
            self.error = $translate.instant('UNKNOW_SERVER_ERROR_1',{ status: error.status });
          }
        }
        );
    };


    $scope.$watch(function(){
      self.updateSelectedProduct();
    });
    $timeout(checkLogged);
  }
  
UserLoginCtrl.$inject=['$scope', '$location', '$translate', '$timeout', 'User','PageStatus', 'ProductTypes'];

  angular
  .module('app.UserLoginCtrl')
  .controller('UserLoginCtrl', UserLoginCtrl);

})();



