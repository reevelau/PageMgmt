(function() {
    'use strict';

    angular
        .module('pageMgmtApp')
        .directive('photoDisplay', directive);

    /* @ngInject */
    function directive() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'views/photoDisplay.directive.html',
            scope: {
              details: '='
            },
            link: linkFunc,
            controller: Controller,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

        }
    }

    Controller.$inject = [];

    /* @ngInject */
    function Controller() {
        var vm = this;

        activate();

        function activate() {
          console.log('photoDisplay details');
          console.dir(vm.details);
        }
    }
})();
