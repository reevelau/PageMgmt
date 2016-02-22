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

        var FEED_POSTING_PATH = '/' + vm.pageId + '/feed';
        var PHOTOS_POSTING_PATH = '/' + vm.pageId + '/photos';
        var VIDEOS_POSTING_PATH = '/' + vm.pageId + '/videos';

        vm.postType = 'status'; // {'status','link', 'video', 'carousel', 'photo'}
        vm.setPostType = function(type){
          vm.postType = type;
        };

        vm.cleanPost = {
                    message: '',
                    published: false,
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

          var postingPath = FEED_POSTING_PATH;
          var postingObj = {};
          postingObj.access_token = vm.pageAccessToken;
          switch (vm.postType) {
            case 'status':
              postingObj.message = vm.post.message;
              postingObj.published = vm.post.published;
              break;
            case 'link':
              postingObj.message = vm.post.message;
              postingObj.link = vm.post.linkUrl;
              postingObj.published = vm.post.published;
              break;

            case 'photo':
              postingPath = PHOTOS_POSTING_PATH;
              postingObj.message = vm.post.message;
              postingObj.url = vm.post.photoUrl;
              postingObj.published = vm.post.published;
              break;
            case 'video':
              postingPath = VIDEOS_POSTING_PATH;
              postingObj.title = vm.post.message;
              postingObj.file_url = vm.post.videoUrl;
              postingObj.published = vm.post.published;
              break;
            default:

          }

          fb.api(postingPath,
              'POST',
              postingObj).then(function(resp){
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
