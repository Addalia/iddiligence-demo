(function () {
  'use strict';

  angular.module('app.service-patterns', ['ngResource', 'app.service-core']);

  function Patterns ($resource, EnvConfig) {
    var restUrl = EnvConfig.restUrl;
    return $resource( restUrl + '/patterns/facerecognition/:idpattern',
                      { idpattern: '@_idpattern'},
                      { 'query': { method: 'GET', url: restUrl + '/patterns/facerecognition/:idpattern'},
                        'status': { method: 'GET', url: restUrl + '/patterns/facerecognition/:idpattern/status', isArray:true},
                        'create': { method: 'POST', url: restUrl + '/patterns/facerecognition/new'},
                        'remove': { method: 'DELETE', url: restUrl + '/patterns/facerecognition/:idpattern/syncjob/delpattern'}
                      }
    );
  }
  Patterns.$inject=['$resource', 'EnvConfig'];

  angular
    .module('app.service-patterns')
    .factory('Patterns', Patterns);

})();


