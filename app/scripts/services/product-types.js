(function () {
  'use strict';

  angular.module('app.product-types', []);

  function ProductTypes (EnvConfig) {
    this.services= EnvConfig.products;
    this.selected = 0;
    var self = this;

    var ProductTypes = {
      getServices: getServices,
      setSelected: setSelected,
      getSelected: getSelected,
      getSelectedId: getSelectedId
    };

    function getServices() {
      return self.services;
    }

    function setSelected(id) {
      self.selected = id;
    }

    function getSelected() {
      return self.services[self.selected];
    }

    function getSelectedId() {
      return self.selected;
    }

    return ProductTypes;
  }

  ProductTypes.$inject=['EnvConfig'];

  angular
    .module('app.product-types')
    .factory('ProductTypes', ProductTypes);

})();
