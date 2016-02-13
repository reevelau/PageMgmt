(function() {
    'use strict';

    angular
        .module('pageMgmtApp')
        .controller('ManagementController', Controller);

    Controller.$inject = ['$scope','$facebook','$routeParams'];

    function QueryStringToJSON(searchStr) {
      var pairs = searchStr.slice(1).split('&');

      var result = {};
      pairs.forEach(function(pair) {
          pair = pair.split('=');
          result[pair[0]] = decodeURIComponent(pair[1] || '');
      });

      return JSON.parse(JSON.stringify(result));
    }

    /* @ngInject */
    function Controller($scope, fb, routeParams) {

        fb.getLoginStatus().then(function(resp){
          console.log('login status');
          console.dir(resp);
        });

        $scope.pageId = routeParams.pageId;

        $scope.posts = []; // how can I have pagination?
        $scope.fbPreviousUrl = "";
        $scope.fbNextUrl = "";
        $scope.postCreatedCallback = function(postId){
          console.log('new post id: ' + postId);
          populatingPosts($scope.pageId);
        }

        function handleLink(attachments){
          var ret = {};
          ret.title = attachments.data[0].title;
          ret.description = attachments.data[0].description;
          if(angular.isDefined(attachments.data[0].media) && angular.isDefined(attachments.data[0].media.image)){
            ret.imgSrc = attachments.data[0].media.image.src;
            ret.withImg = true;
          }else {
            ret.withImg = false;
          }
          ret.url = attachments.data[0].url;
          return ret;
        };

        function handlePhoto(attachments){
          var ret = {};
          ret.title = attachments.data[0].title;
          ret.url = attachments.data[0].url;
          ret.description = attachments.data[0].description;
          ret.thumbnails = [];

          if(attachments.data[0].type === 'album' || attachments.data[0].type === 'new_album'){
            attachments.data[0].subattachments.data.forEach(function(subatt){
              if(subatt.type === 'photo'){
                var sa = {};
                sa.imgSrc = subatt.media.image.src;
                sa.url = subatt.url;
                ret.thumbnails.push(sa);
              }
            });
          }
          else if(attachments.data[0].type === 'photo' || attachments.data[0].type === 'cover_photo'){
            var sa = {};
            sa.imgSrc = attachments.data[0].media.image.src;
            sa.url = attachments.data[0].url;

            ret.thumbnails.push(sa);
          }

          return ret;
        };

        function handleVideo(attachments){
          var ret = {};
          ret.title = attachments.data[0].title;
          ret.description = attachments.data[0].description;
          if(angular.isDefined(attachments.data[0].media) && angular.isDefined(attachments.data[0].media.image)){
            ret.imgSrc = attachments.data[0].media.image.src;
            ret.withImg = true;
          }else {
            ret.withImg = false;
          }
          ret.url = attachments.data[0].url;

          return ret;
        };

        function processPostObject(post){
          var ret = {};

          ret.type = post.type;
          ret.created_time = new Date(post.created_time);
          ret.is_published = post.is_published;
          ret.attachments = JSON.stringify(post.attachments,null,' ');
          ret.display_attachments = true;
          if(angular.isDefined(post.message) && post.message!== null){
            ret.displayTitle = post.message;
          }
          else if(angular.isDefined(post.name) && post.name !== null){
            ret.displayTitle = post.name;
          }

          var att = post.attachments;

          switch(post.type){

            case 'link':
                ret.linkContent = handleLink(att);
                ret.display_attachments = false;
              break;
            case 'photo':
                ret.photoContent = handlePhoto(att);
                ret.display_attachments = false;
              break;
            case 'video':
                ret.videoContent = handleVideo(att);
                ret.display_attachments = false;
              break;
            case 'status':
                ret.display_attachments = false;
              break;
            default:
                ret.displayTitle = post.message;
              break;
          }

          return ret;
        }

        function populatingPosts(pageId, params){
          var _params = {};
          _params.limit = 5;

          if(angular.isDefined(params)){
            angular.extend(_params,params);
          }

          var url = '/' + pageId + '/promotable_posts';

          fb.api(url,_params).then(function(resp){
            $scope.posts = resp.data;
            if(angular.isDefined(resp.paging) && angular.isDefined(resp.paging.previous))
              $scope.fbPreviousUrl = resp.paging.previous;
            if(angular.isDefined(resp.paging) && angular.isDefined(resp.paging.next))
              $scope.fbNextUrl = resp.paging.next;

            resp.data.forEach(function(each){
              fb.api('/' + each.id, {fields:'message,link,caption,type,actions,is_published,created_time,name,attachments'})
                .then(function(resp){
                  var id = _.findIndex($scope.posts,function(o){ return o.id === each.id;});
                  $scope.posts[id].details = processPostObject(resp);
                });

              fb.api('/' + each.id + '/insights/post_impressions_unique').then(function(insights){
                var id = _.findIndex($scope.posts,function(o){ return o.id === each.id;});
                $scope.posts[id].post_impressions_unique = insights.data[0].values[0].value;

              });
            });
          });
        };

        populatingPosts($scope.pageId);

        $scope.goPrevious = function(){
          var previousUrl = $scope.fbPreviousUrl;
          var queryParam = QueryStringToJSON(previousUrl);
          populatingPosts($scope.pageId,queryParam);
        };

        $scope.goNext = function(){
          var nextUrl = $scope.fbNextUrl;
          var queryParam = QueryStringToJSON(nextUrl);
          populatingPosts($scope.pageId,queryParam);
        }


    }
})();
