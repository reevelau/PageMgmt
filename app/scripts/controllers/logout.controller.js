(function() {
    'use strict';

    angular
        .module('pageMgmtApp')
        .controller('LogoutController', Controller);

    Controller.$inject = ['$facebook', '$location','$window'];

    /* @ngInject */
    function Controller(fb, $location, $window) {
        var vm = this;

        activate();

        function activate() {
          fb.logout().then(function(resp){
            
          });
          /*
          fb.getLoginStatus().then(function(resp){
            if(resp.status !== 'connected'){
              // go back to root if the loginStatus is not 'connected'
              $location.path('/');
            }
            else{
              // register a even listener for any status change, if yes, go back to root
              fb.logout().then(function(resp){
                //$window.location.reload();
                $location.path('/');
              });
            }
          });
          */


        }
    }
})();
