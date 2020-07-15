(function () {
    'use strict';

    angular
    .module('cliquesa', [])
    .factory('Cliquesa', CliquesaModel);

    CliquesaModel.$inject = ['$http','Clique'];
    function CliquesaModel($http,Clique) {
        var service = {};
         service.CliqueConnect = CliqueConnect;
     
        
        return service;


        function CliqueConnect() {
            return Clique.callService('get','/clique/connect/','').then(handleSuccess, handleError);
        }
        function CliqueDisconnect() {
            return Clique.callService('get','/clique/disconnect/','').then(handleSuccess, handleError);
        }

        function handleSuccess(res) {
            return res.data;
        }
        function handleError(error) {
            return error;
        }
    }

})();

