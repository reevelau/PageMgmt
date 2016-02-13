(function() {
    'use strict';

    angular
        .module('pageMgmtApp')
        .directive('postform', directive);

    /* @ngInject */
    function directive() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'views/postform.directive.html',
            scope: {
              pageId: '=pageId',
              postCreated: '&'
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

    Controller.$inject = ['$facebook'];

    /* @ngInject */
    function Controller(fb) {
        var vm = this;
        vm.cleanPost = {
                    message: '',
                    published:true
                  };

        vm.post = angular.copy(vm.cleanPost);
        vm.pageAccessToken = '';

        activate();

        function activate() {
          fb.api('/me/accounts').then( function(resp){
            var index = _.findIndex(resp.data,function(o){ return  o.id === vm.pageId;});
            if(index !== -1){
              vm.pageAccessToken = resp.data[index].access_token;
            }
          }, function failedMeAccounts(resp){
            // handle failure
          });
        }

        console.log('postform pageId: ' + vm.pageId);
        vm.submitPost = function(){
          if(vm.pageAccessToken === ''){
            console.log('page access token not available');
            return;
          }

          console.dir(vm.post);




          fb.api('/' + vm.pageId + '/feed',
              'POST',
              {
                message: vm.post.message,
                published: vm.post.published,
                access_token: vm.pageAccessToken
              }).then(function(resp){
                console.log('post return');
                console.dir(resp);
                vm.post = angular.copy(vm.cleanPost);
                if(angular.isDefined(vm.postCreated)){
                  vm.postCreated({postId: 'new post id'});
                }
              }, function failed(resp){
                console.log('posting failed');
                console.dir(resp);

              });

        }
    }
})();
