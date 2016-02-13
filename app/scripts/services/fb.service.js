(function() {
    'use strict';

    angular
        .module('pageMgmt')
        .factory('factory', factory);

    factory.$inject = ['dependencies'];

    /* @ngInject */
    function factory(dependencies) {
        var service = {
            function: function
        };

        return service;

        function function() {

        }
    }
})();
