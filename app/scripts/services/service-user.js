(function () {
  'use strict';

  angular.module('app.service-user', ['ngResource']);

  function User ($resource, EnvConfig) {
    var restUrl = EnvConfig.restUrl;
    // console.log('User() restUrl=' + restUrl);

    return $resource( restUrl + '/authenticate/'
                      /*,{ 'save': { method: 'POST'} ,
                        'get': { method: 'GET', isArray: false } } */);
  }
  User.$inject=['$resource', 'EnvConfig'];

  angular
    .module('app.service-user')
    .factory('User', User);

})();
