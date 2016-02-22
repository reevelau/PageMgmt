(function() {
    'use strict';

    // This is a little function to conver query string into a JSON object
    function QueryStringToJSON(searchStr) {
      var pairs = searchStr.slice(1).split('&');

      var result = {};
      pairs.forEach(function(pair) {
          pair = pair.split('=');
          result[pair[0]] = decodeURIComponent(pair[1] || '');
      });

      return JSON.parse(JSON.stringify(result));
    }

    angular
        .module('pageMgmtApp')
        .controller('ManagementController', Controller);

    Controller.$inject = ['$scope','$facebook','$routeParams', '$location', 'FbPromotablePost'];

    /* @ngInject */
    function Controller($scope, fb, routeParams, $location, FbPromotablePost) {
        fb.getLoginStatus().then(function(resp){
          if(resp.status !== 'connected'){
            // go back to root if the loginStatus is not 'connected'
            $location.path('/');
          }
          else{
            // register a even listener for any status change, if yes, go back to root
          }
        });

        $scope.pageId = routeParams.pageId; // page that going to be managed
        $scope.posts = [];                  // list of processed posts
        $scope.fbPreviousUrl = '';          // used for pagination, storing the previousUrl returning from every api resp
        $scope.fbNextUrl = '';              // used for pagination, storing the nextUrl

        populatingPosts($scope.pageId);

        // Once user create a post using directive, this function will be called
        $scope.postCreatedCallback = function(postId){
          console.log('new post id: ' + postId);
          populatingPosts($scope.pageId);
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
                  var i = _.findIndex($scope.posts,function(o){ return o.id === each.id;});
                  $scope.posts[i].details = FbPromotablePost.processPostObject(resp);
                });

              fb.api('/' + each.id + '/insights/post_impressions_unique')
                .then(function(insights){
                  var i = _.findIndex($scope.posts,function(o){ return o.id === each.id;});
                  $scope.posts[i].post_impressions_unique = insights.data[0].values[0].value;
                });
            });
          });
        };

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
