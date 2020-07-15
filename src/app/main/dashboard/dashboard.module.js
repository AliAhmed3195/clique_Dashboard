(function ()
{
    'use strict';

    angular
        .module('app.dashboard', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.dashboard', {
                url    : '/home',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/dashboard/dashboard.html',
                        controller : 'DashboardController as vm'
                    }
                }
            });
   
        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/dashboard');

         // Api
        msApiProvider.register('apps', ['app/data/apps/apps.json']);


        // Navigation
        msNavigationServiceProvider.saveItem('fuse', {
            title : 'SAMPLE',
            group : true,
            weight: 1
        });

        msNavigationServiceProvider.saveItem('fuse.dashboards', {
            title    : 'Sample',
            icon     : 'icon-tile-four',
            state    : 'app.dashboard',
            /*stateParams: {
                'param1': 'page'
             },*/
            translate: 'SAMPLE.SAMPLE_NAV',
            weight   : 1
        });

         msNavigationServiceProvider.saveItem('fuse.dashboards.paymentlisting', {
            title    : 'Payment Listing',
            icon     : 'icon-tile-four',
            state    : 'app.dashboard.paymentlisting',
            /*stateParams: {
                'param1': 'page'
             },*/
            translate: 'SAMPLE.SAMPLE_NAV',
            weight   : 1
        });
    }
})();