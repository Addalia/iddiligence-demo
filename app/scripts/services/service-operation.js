(function () {
  'use strict';

  angular.module('app.service-operation', ['ngResource', 'app.service-core']);

  function Operation ($resource, EnvConfig) {
    var restUrl = EnvConfig.restUrl;
    return $resource( restUrl + '/operations/:idop',
      { idop: '@_idop'},
      { 'terminate': { method: 'POST', url: restUrl + '/operations/:idop'},
        'update': { method: 'PUT' },
        'create': { method: 'POST', url: restUrl + '/operations/new'},
        'status': { method: 'GET', url: restUrl + '/operations/:idop/status'},
        'updateStatus': { method: 'PUT', url: restUrl + '/operations/:idop/status'}
      }
    );
  }
  Operation.$inject=['$resource', 'EnvConfig'];

  angular
  .module('app.service-operation')
  .factory('Operation', Operation);

})();
