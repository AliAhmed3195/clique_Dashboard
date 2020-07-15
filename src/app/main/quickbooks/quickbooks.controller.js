(function() {
	'use strict';
	angular
	.module('quickbooks')
	.controller('QuickBooksConrtoller', QuickBooksConrtoller)
	.directive('connectToQuickbooks', connectToQuickbooks)
	.factory('QuickBooksService',QuickBooksService);


	var qbAuthorizeUrl="http://clique.local:8000/authorize/";
	var env=localStorage.getItem("env");
	

    var windowlocation = window.location;    
    qbAuthorizeUrl = "http://apps.paynomix.com/authorize/";
    if(windowlocation.origin!=undefined){
       qbAuthorizeUrl = windowlocation.origin+"/authorize/"; 
    }

    /*switch (env) {
            case "cliquelocal":
                qbAuthorizeUrl = "http://clique.local:8000/authorize/";
                break;
            case "ahsanlocal":
                qbAuthorizeUrl = "http://hp:8000/authorize/";
                break;
            default:
                qbAuthorizeUrl = "https://apps.clique.center/authorize/";
                break
    }*/

	QuickBooksService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','$mdDialog','DashboardModel'];
	function QuickBooksService($http, $cookieStore, $rootScope, $timeout,$mdDialog,DashboardModel) {
		var vm=this;
		var service = {};

		service.openDialog = openDialog;
		service.openDialogAfrerDisconnect = openQuickBooksDialogWhenDisconnectFromQBAppCenter;
		service.directLogin = QuikcbooksDirectLogin;
		service.disconnect = disconnectQuickbooks;
		
		return service;

		function openDialog(){
			$mdDialog.show({
				controller: QuickBooksConrtoller,
				templateUrl: 'app/main/quickbooks/connection.dialog.tmpl.html',
				parent: angular.element(document.body),
                  //targetEvent: ev,
                  clickOutsideToClose:true
              })
			.then(function(answer) {
			}, function() {
			});
		}

		/*QuickBooks connection dialog*/
        function openQuickBooksDialogWhenDisconnectFromQBAppCenter() {
            var disconnect_intuit = false;
            if (typeof(Storage) !== "undefined") {
                var disconnect_intuit_info = sessionStorage.getItem("disconnect_intuit");
                if (disconnect_intuit_info != null) {
                    disconnect_intuit = true;
                }
            }
            if (disconnect_intuit == true) {
                service.openDialog();
                if (typeof(Storage) !== "undefined") {
                    sessionStorage.removeItem("disconnect_intuit");
                }
            }
        }

        /*QuickBooks direct login*/

        function QuikcbooksDirectLogin(scope,window) {

            var signin_intuit = false;
            if (typeof(Storage) !== "undefined") {
                var signIntuitInfo = sessionStorage.getItem("signin_intuit");
                if (signIntuitInfo != null) {
                    signin_intuit = true;
                }
            }
            if (signin_intuit == true) {
            	//if(1==1) {
                scope.promise = DashboardModel.GetErpStatus();
                scope.promise.then(function(response) {
                    
                    if (response.statuscode == 1) {
                        var erpObj = response.data.erp;
                        //if (erpObj.is_connected == 0) {
                 
                            var script = window.document.createElement("script");
                            script.type = "text/javascript";
                            script.src = "https://appcenter.intuit.com/Content/IA/intuit.ipp.anywhere-1.3.3.js"
                            script.onload = function() {
                                scope.$emit('intuitjs:loaded');
                            }
                            window.document.body.appendChild(script);
                           	scope.$on('intuitjs:loaded', function(evt) {
                           		
                                window.intuit.ipp.anywhere.setup({
                                    grantUrl: qbAuthorizeUrl,
                                    datasources: {
                                        quickbooks: true,
                                        payments: false
                                    }
                                });
                                intuit.ipp.anywhere.directConnectToIntuit();
                                scope.$apply();
                            });
                        //}

                        if (typeof(Storage) !== "undefined") {
                            sessionStorage.removeItem("signin_intuit");
                        }        

                    } else {

                        //Clique.showToast(response.statusmessage, 'bottom right', 'error');
                    }

                });

                


            }
        };

        function disconnectQuickbooks(scope,dialog,Clique) {

            scope.promise = DashboardModel.DisconnectQuickBooks();
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
	function QuickBooksConrtoller($scope, $timeout, $q,$mdDialog) {
		var vm = this;
		$scope.connected=false;
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
	 function connectToQuickbooks($window,$cookies,Clique) {
		return {
			//template: "<ipp:connectToIntuit></ipp:connectToIntuit>",
			template: "<a href='#'><img width='300' src='assets/images/logos/C2QB_green_btn_lg_hover.png' onclick='intuit.ipp.anywhere.controller.onConnectToIntuitClicked();' /></a>",
			link: function(scope){
				var script = $window.document.createElement("script");
				script.type = "text/javascript";
				script.src="https://appcenter.intuit.com/Content/IA/intuit.ipp.anywhere-1.3.3.js"
				script.onload= function(){
					scope.$emit('intuitjs:loaded');
				}
				$window.document.body.appendChild(script);
				scope.$on('intuitjs:loaded',function(evt) {

					$window.intuit.ipp.anywhere.setup({
						//grantUrl: 'https://apps.clique.center/authorize/?authtoken='+authtoken
						grantUrl: qbAuthorizeUrl
					});
					scope.connected=true;
					scope.$apply();
				});

			}
		}
	}
	 
})();