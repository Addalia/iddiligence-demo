(function () {
  'use strict';

  angular.module('app.service-document', ['ngResource', 'app.service-core']);

  function Document ($resource, EnvConfig) {
    var restUrl = EnvConfig.restUrl;
    return $resource( restUrl + '/operations/:idop/:iddoc',
                      { idop: '@_idop', iddoc: '@_iddoc'},
                      { 'update': { method: 'PUT' } ,
                        'query' : { method: 'GET', isArray:false},
                        'create': { method: 'POST', url: restUrl + '/operations/:idop/new'},
                        'status': { method: 'GET', url: restUrl + '/operations/:idop/:iddoc/status'},
                        'views': { method: 'GET', url: restUrl + '/operations/:idop/:iddoc/views'} 
                      }
    );
  }
  Document.$inject=['$resource', 'EnvConfig'];

  angular
    .module('app.service-document')
    .factory('Document', Document);

})();
