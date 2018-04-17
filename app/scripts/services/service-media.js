(function () {
  'use strict';

  angular.module('app.service-media', ['ngResource', 'app.service-core']);

  function Media ($resource, EnvConfig) {
    var restUrl = EnvConfig.restUrl;
    return $resource( restUrl + '/patterns/facerecognition/:idpattern/:idmedia',
                      { idpattern: '@_idpattern', idmedia: '@_idmedia'},
                      {'query' : { method: 'GET', url: restUrl + '/patterns/facerecognition/:idpattern/views'},
                       'upload': { method: 'PUT',
                                    url: restUrl + '/patterns/facerecognition/:idpattern/:idmedia/file',
                                    headers: {'Mime-Type': function(data) {
                                                  return  data.data.type;
                                                },
                                              'Content-Type': 'application/octet-stream'},
                                    transformRequest: angular.patterns},
                       'create': { method: 'POST', url: restUrl + '/patterns/facerecognition/:idpattern/new'}
                      }
    );
  }
  Media.$inject=['$resource', 'EnvConfig'];

  angular
    .module('app.service-media')
    .factory('Media', Media);

})();
