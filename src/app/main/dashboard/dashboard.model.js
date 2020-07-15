(function () {
    'use strict';

    angular
    .module('app.dashboard')
    .factory('DashboardModel', DashboardModel);

    DashboardModel.$inject = ['$http','Clique'];
    function DashboardModel($http,Clique) {
        var service = {};

        service.GetErpStatus = GetErpStatus;
        service.GetErpList = GetErpList;
        service.GetDashboardApps = GetDashboardApps;
        service.CliqueConnect = CliqueConnect;

        service.DisconnectQuickBooks = DisconnectQuickBooks;
        service.DisconnectFreshBooks = DisconnectFreshBooks;
        service.DisconnectXero = DisconnectXero;
        
        return service;


        function GetErpStatus() {
            return Clique.callService('get','/erp/status','').then(handleSuccess, handleError);
        }
        function GetErpList() {
            return Clique.callService('get','/erp','').then(handleSuccess, handleError);
        }
        function GetDashboardApps() {
            return Clique.callService('get','/dashboard/apps','').then(handleSuccess, handleError);
        }
        
        function DisconnectQuickBooks() {
            return Clique.callService('get','/erp/quickbooks/disconnect','').then(handleSuccess, handleError);
        }
        function DisconnectFreshBooks() {
            return Clique.callService('get','/freshbooks/disconnect','').then(handleSuccess, handleError);
        }
        function DisconnectXero() {
            return Clique.callService('get','/xero/disconnect','').then(handleSuccess, handleError);
        }

        function CliqueConnect() {
            return Clique.callService('get','/clique/connect/','').then(handleSuccess, handleError);
        }

        function handleSuccess(res) {
            return res.data;
        }
        function handleError(error) {
            return error;
        }
    }

})();

