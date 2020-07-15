(function() {
  "use strict";

  angular
    .module("app.dashboard")
    .controller("DashboardController", DashboardController);

  function DashboardController(
    $location,
    $scope,
    $mdDialog,
    $window,
    Clique,
    $http,
    $q,
    $rootScope,
    QuickBooksService,
    $timeout,
    DashboardModel,
    XeroService,
    FreshBooksService,
  
    // StandaloneService,
    $filter
  ) {
    var vm = this;

    vm.apps = [];

    /*Get Apps*/
    $scope.promise = DashboardModel.GetDashboardApps();
    $scope.promise.then(function(response) {
      vm.apps = response.data;
      if (response.data.length > 0) {
        $scope.numberOfBox = response.data.length;
        AnimateRotate(10, "infinite", $scope.numberOfBox, 1, true);
      }
    });

    /*start background code*/
    $scope.randomNumber = 1;
    $scope.app_color = "black";
    $scope.polygonDesign = [
      { name: "pb1", color: "black" },
      { name: "pb3", color: "white" },
      { name: "pb4", color: "black" },
      { name: "pb5", color: "white" },
      { name: "pb6", color: "white" },
      { name: "pb7", color: "black" },
      { name: "pb8", color: "black" },
      { name: "pb9", color: "black" },
      { name: "pb10", color: "black" },
      { name: "pb11", color: "white" },
      { name: "pb13", color: "black" },
      { name: "pb23", color: "black" }
    ];
    var sessionSavedBg = sessionStorage.getItem("bg");
    getRandomInt(0, 11);

    function getRandomInt(min, max) {
      var bg_name = "";
      $scope.randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      if (sessionSavedBg == undefined || sessionSavedBg == null) {
        bg_name = $scope.polygonDesign[$scope.randomNumber].name;
        $scope.randomeBg =
          "assets/images/backgrounds/polygonbg/" +
          $scope.polygonDesign[$scope.randomNumber].name +
          ".jpg";
      } else {
        bg_name = sessionSavedBg;
        $scope.randomeBg =
          "assets/images/backgrounds/polygonbg/" + sessionSavedBg + ".jpg";
      }
      $scope.app_color = $filter("filter")($scope.polygonDesign, {
        name: bg_name
      })[0].color;
    }

    if (sessionSavedBg == undefined || sessionSavedBg == null) {
      $scope.showDashboard = false;
      var img = new Image();
      img.onload = function() {
        $timeout(function() {
          $scope.showDashboard = true;
          sessionStorage.setItem(
            "bg",
            $scope.polygonDesign[$scope.randomNumber].name
          );
        }, 300);
      };
      img.src = $scope.randomeBg;
    } else {
      $scope.showDashboard = true;
    }

    $scope.hoverIn = function(length) {
      var i;
      for (i = 1; i <= length; i++) {
        $("#image_" + i).removeClass("icon" + i);
      }
    };
    $scope.hoverOut = function(length) {
      var i;
      for (i = 1; i <= length; i++) {}
    };

    $scope.stopAppIconAnimation = function() {
      $timeout(function() {
        $scope.stopAnimation = true;
      });
    };
    $scope.stopAnimation = false;

    function AnimateRotate(angle, repeat, total, id, flag) {
      var duration = 500;
      var $elem = $("#appicon_" + id);
      if ($scope.stopAnimation == false) {
        $({
          deg: 0
        }).animate(
          {
            deg: angle
          },
          {
            duration: duration,
            step: function(now) {
              $elem.css({
                transform: "rotate(" + now + "deg)"
              });
              $elem.css({
                "transition-duration": "0s"
              });
            },
            complete: function() {
              $({
                deg: 0
              }).animate(
                {
                  deg: angle
                },
                {
                  duration: duration,
                  step: function(now) {
                    $elem.css({
                      "transition-duration": "1s"
                    });
                    $elem.css({
                      transform: "rotate(" + 0 + "deg)"
                    });
                  }
                }
              );
              if (flag == true) {
                var totalIcone = total;
                flag = false;
              }
              if (total == 0) {
                id = 1;
                total = $scope.numberOfBox;
                flag = true;
              } else {
                id = id + 1;
              }
              total = total - 1;
              AnimateRotate(angle, repeat, total, id, flag);
            }
          }
        );
      }
    }

    /*eof background*/

    $timeout(function() {
      vm.showHeadline = true;
    }, 1000);

    QuickBooksService.directLogin($scope, $window);
    QuickBooksService.openDialogAfrerDisconnect();

    $scope.openErpConnectDialog = function() {
      $mdDialog.show({
        controller: ERPController,
        templateUrl: "app/main/dashboard/erp.html",
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        fullscreen: true // Only for -xs, -sm breakpoints.
      });
    };
    $scope.openERPConnectionStatusDialog = function() {
      $mdDialog.show({
        scope: $scope,
        preserveScope: true,
        controller: openERPConnectionStatusController,
        templateUrl: "app/main/dashboard/erp_connection_status.html",
        parent: angular.element(document.body),
        clickOutsideToClose: false
      });
    };

    /*App Methods*/
    $scope.openApp = function(app) {
      localStorage.setItem("app_id", app.id);
  //    sessionStorage.setItem("app_id", app.id);
      $scope.erpName = "";
      $scope.erpShow = true;
      switch (app.title) {
        case "Erp":
          $scope.openErpConnectDialog();
          break;
        default:
          if (app.is_dependent.status == true) {
            switch (app.is_dependent.app) {
              case "Erp":
                $scope.openERPConnectionStatusDialog();
                $rootScope.selectedApp = app;
                $scope.promise = DashboardModel.GetErpStatus();
                $scope.promise.then(function(response) {
                  if (response.statuscode == 0) {
                    var count = 0;
                    var is_connected = 0;
                    if (response.data.erp != undefined) {
                      var count = 0;
                      var is_connected = 0;
                      if (response.data.erp != undefined) {
                        var erpObj = response.data.erp;
                        count = Object.keys(erpObj).length;
                        if (count > 0) {
                          $scope.erpShow = false;
                          var is_connected = erpObj.is_connected;
                          $scope.erpName = erpObj.type;
                        }
                      }
                      if (is_connected == 0) {
                        $mdDialog.hide();
                        $scope.openErpConnectDialog();
                      } else {
                        $timeout(function() {
                          window.location.assign(app.url);
                        }, 2000);
                      }
                    }
                  } else {
                    $mdDialog.hide();
                    Clique.showToast(
                      response.statusmessage,
                      "bottom right",
                      "error"
                    );
                  }
                });

                break;
            }
          } else {
            window.location.assign(app.url);
          }
          break;
      }
    };
  }

  /*Erp Controller*/
  function ERPController(
    api,
    $scope,
    Clique,
    $mdDialog,
    $http,
    $state,
    DashboardModel,
    XeroService,
    QuickBooksService,
    FreshBooksService,
  
    //StandaloneService,
    $filter,
    $timeout
  ) {
    $scope.showProgress = false;
    $scope.erpItems;

    $scope.promise = DashboardModel.GetErpList();
    $scope.promise.then(function(response) {
      if (response.statuscode == 0) {
        // debugger;
        $scope.erpItems = response.data.items;
        console.log('something', $scope.erpItems);
        // Clique.showToast(response.statusmessage, "bottom right", "error");s
      } else {
        Clique.showToast(response.statusmessage, "bottom right", "error");
      }
    });

    $scope.openErpConnectDialog = function(erpTypes, isConnected) {
      $scope.errorMessage = "";
      $scope.showErrorMessage = false;
      var connectedErp = $filter("filter")($scope.erpItems, {
        is_connected: true
      })[0];
      console.log(isConnected);
      if (connectedErp != undefined && isConnected == false) {
        $scope.showErrorMessage = true;
        //$scope.errorMessage="Please disconnect form "+connectedErp.name+" in order to connect your desire Accounting Software";
        $scope.errorMessage =
          "Please disconnect your current Accounting Software";
        $timeout(function() {
          $scope.showErrorMessage = false;
        }, 4000);
      } else {
        switch (erpTypes) {
           
          case "quickbooks":
            if (isConnected == 0) {
              $mdDialog.hide();
              QuickBooksService.openDialog();
            } else {
              $scope.showProgress = true;
              QuickBooksService.disconnect($scope, $mdDialog, Clique);
            }

            break;
          case "xero":
            if (isConnected == 0) {
              $mdDialog.hide();
              XeroService.connect();
            } else {
              $scope.showProgress = true;
              XeroService.disconnect($scope, $mdDialog);
            }
            break;
          case "freshbook":
            if (isConnected == 0) {
              $mdDialog.hide();
              FreshBooksService.connect();
            } else {
              $scope.showProgress = true;
              FreshBooksService.disconnect($scope, $mdDialog);
            }
            break;
          case "Standalone":
              if (isConnected == 0) {
                $mdDialog.hide();
                FreshBooksService.connectclique($scope, $mdDialog, $state);
              } else {
                $scope.showProgress = true;
                FreshBooksService.disconnectclique($scope, $mdDialog, $state);
              }
              break;
        }
      }
    };
    $scope.refreshInvoiceGrid = function() {
      $state.reload();
    };

    $scope.cancelDialog = function() {
      $mdDialog.hide();
    };
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }

  function openERPConnectionStatusController(
    $scope,
    $rootScope,
    Clique,
    $mdDialog
  ) {
    $scope.selectedApp = $rootScope.selectedApp;
    //$scope.erpName = "";

    //console.log($scope.erpName);
    //$rootScope.erpName
    $scope.cancelDialog = function() {
      $mdDialog.hide();
    };
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }
})();
