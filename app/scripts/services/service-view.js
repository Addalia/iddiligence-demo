(function () {
  'use strict';

  angular.module('app.service-view', ['ngResource', 'app.service-core']);

  function View ($resource, EnvConfig) {
    var restUrl = EnvConfig.restUrl;
    return $resource( restUrl + '/operations/:idop/:iddoc/:idview',
                      { idop: '@_idop', iddoc: '@_iddoc', idview: '@_idview'},
                      { 'update': { method: 'PUT' } ,
                        'query' : { method: 'GET', isArray:false},
                        'create': { method: 'POST', url: restUrl + '/operations/:idop/:iddoc/new'} ,
                        'status': { method: 'GET', url: restUrl + '/operations/:idop/:iddoc/:idview/status'},
                        'upload': { method: 'PUT',
                                    url: restUrl + '/operations/:idop/:iddoc/:idview/file',
                                    /*headers: {'Mime-Type': 'image/jpeg', 'Content-Type': 'application/octet-stream' },*/
                                    headers: {'Mime-Type': function(data) {
                                                  return  data.data.type;
                                                }, 
                                              'Content-Type': 'application/octet-stream'},
                                    transformRequest: angular.identity},
                        'download': { method: 'GET',
	                                    url: restUrl + '/operations/:idop/:iddoc/:idview/file',
	                                    responseType: 'arraybuffer',
															        transformResponse: function(data, headersGetter) {
																            return {  // Stores header object in "header" property
																            					header: headersGetter(),
																					            // Stores the ArrayBuffer object in "data" property
																            					data : data
																            			 };
															        }
	                                  }
                      }
    );
  }
  View.$inject=['$resource', 'EnvConfig'];

  angular
    .module('app.service-view')
    .factory('View', View);

})();
