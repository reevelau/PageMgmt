(function() {
    'use strict';

    angular
        .module('pageMgmtApp')
        .controller('LogoutController', Controller);

    Controller.$inject = ['$facebook','$location','$window'];

    /* @ngInject */
    function Controller(fb,$location,$window) {
        var vm = this;

        activate();

        function activate() {
          fb.logout().then(function(resp){
            $window.fbAsyncInit();
            $location.path('/');
          });
        }
    }
})();
