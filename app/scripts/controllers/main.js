(function() {
    'use strict';

    angular
        .module('pageMgmtApp')
        .controller('MainCtrl', Controller);

    Controller.$inject = ['$scope', '$facebook', '$location','$window'];



    /* @ngInject */
    function Controller($scope, $facebook, $location, $window) {
        //$window.FB.XFBML.parse();
        console.log('$window');
        console.dir($window);

        $scope.$on('fb.auth.login',function(){
          $location.path('/page');
        });

        $scope.loggedin = false;

        $scope.welcomeMsg = 'not login';

        $scope.fbLogout = function(){
          $facebook.logout();
        }

        $scope.goToPageSelection = function(){
          $location.path('/page');
        }

        $facebook.getLoginStatus().then(function success(resp){
          console.log('getLoginStatus success');
          console.dir(resp);
          if(resp.status === 'connected'){
            $scope.loggedin = true;
          }



        }, function failed(resp){
          console.dir(resp);
        } );

        $facebook.api("/me").then(
          function(response) {
            $scope.welcomeMsg = "continue as " + response.name;
          },
          function(err) {
            $scope.welcomeMsg = "Please log in";
            $window.FB.XFBML.parse();
          });

        $facebook.api('/me/accounts').then(
          function(resp){
            console.log('/me/accounts');
            console.dir(resp);
          }
        );
    }
})();
