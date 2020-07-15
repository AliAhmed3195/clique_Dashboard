(function() {
	'use strict';
	angular
	.module('xero')
	.controller('XeroConrtoller', XeroConrtoller)
	.factory('XeroService',XeroService);

	XeroService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','$mdDialog','DashboardModel','Clique'];
	function XeroService($http, $cookieStore, $rootScope, $timeout,$mdDialog,DashboardModel,Clique) {
		var service = {};

		service.connect = connect;
		service.disconnect = disconnect;
		return service;

		function connect(){
			console.log("connect to xero");		
			var url="";
			var env=localStorage.getItem("env");
			var ip = localStorage.getItem("ip");
			var windowlocation = window.location;    
		    url = "http://apps.paynomix.com/v1/xero/doauth";
		    if(windowlocation.origin!=undefined){
		       url = windowlocation.origin+"/v1/xero/doauth"; 
		    }
			/*switch (env) {
		            case "cliquelocal":
		                url = "http://clique.local:8000/v1/xero/doauth";
		                break;
		            case "ahsanlocal":
		                url = "http://hp:8000/v1/xero/doauth";
		                break;
		            default:
		                url = "https://apps.clique.center/v1/xero/doauth";
		                break
		    }*/
			/*if(env==null || env=='' || env==undefined){
				url="https://apps.clique.center/v1/xero/doauth";
			}*/
			//alert(url);
			var w = 800;
			var h = 600;
			var left = (screen.width - w) / 2;
            var top = (screen.height - h) / 4;  // for 25% - devide by 4  |  for 33% - devide by 3
            var targetWin = window.open(
                                        url, 
                                        "Clique - Xero Connect", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
			
		}
		function disconnect(scope,dialog) {

            scope.promise = DashboardModel.DisconnectXero();
            scope.promise.then(function(response) {
                if (response.statuscode == 0) {
                    Clique.showToast(response.statusmessage, 'bottom right', 'success');
                } else {
                    Clique.showToast(response.statusmessage, 'bottom right', 'error');
                }
                scope.showProgress = false;
                dialog.hide();
            });

        }
	}

	/* @ngInject */
	function XeroConrtoller($scope, $timeout, $q,$mdDialog) {
		var vm = this;
		
		$scope.cancelDialog=function(){
            $mdDialog.hide();
        }
        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };
		
	}
	 
	 
})();