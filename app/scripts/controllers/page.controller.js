(function() {
    'use strict';

    angular
        .module('pageMgmtApp')
        .controller('PageController', Controller);

    Controller.$inject = ['$scope', '$facebook', '$location'];

    /* @ngInject */
    function Controller($scope, $facebook, $location) {
        $scope.accounts = [];
        $scope.goTo = function(pageId){
          console.log('goto page id: ' + pageId);
          $location.path('/management/' + pageId);
        };

        $facebook.api('/me/accounts').then(function(resp){
          console.log('/me/accounts');
          console.dir(resp);
          if(angular.isDefined(resp) && angular.isDefined(resp.data) && angular.isArray(resp.data)){
              $scope.accounts = resp.data;
              resp.data.forEach(function(each){
                $facebook.api('/' + each.id + '/picture', {type:'normal'}).then(function(pic){
                  console.log('/' + each.id + '/picture');
                  console.dir(pic);
                  var index = _.findIndex($scope.accounts, function(o){ return o.id === each.id;});
                  if(index !== -1){
                    $scope.accounts[index].picUrl = pic.data.url;
                  }
                });
              });
          }
          else{
            console.warn('unexpected resp /me/accounts');
            console.dir(resp);
          }
        });
    }
})();
