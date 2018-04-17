(function () {
  'use strict';

  angular.module('app.service-pvi', ['ngResource', 'app.service-core']);

  function PVI ($resource, EnvConfig) {
    var restUrl = EnvConfig.restUrl;
    return $resource( restUrl + '/operations/:idop/syncjob/sendpvi', { idop: '@idop'},
                    {'send': { method: 'POST' , url: restUrl + '/operations/:idop/syncjob/sendpvi'}});
  }
  PVI.$inject=['$resource', 'EnvConfig'];

  angular
  .module('app.service-pvi')
  .factory('PVI', PVI);

})();
