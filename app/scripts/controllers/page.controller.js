(function() {
    'use strict';

    angular
        .module('pageMgmtApp')
        .controller('PageController', Controller);

    Controller.$inject = ['$scope', '$facebook', '$location'];

    /* @ngInject */
    function Controller($scope, $facebook, $location) {
        $scope.accounts = [];
        $scope.goTo = function(account){
          //console.log('goto page id: ' + pageId);
          $location.path('/management/' + account.id);
        };

        $facebook.api('/me/accounts').then(function(resp){
          console.log('/me/accounts');
          console.dir(resp);
          if(angular.isDefined(resp) && angular.isDefined(resp.data) && angular.isArray(resp.data)){
              // Assumption here, number of account would exceed 1 api request, i.e. no paging
              $scope.accounts = resp.data;

              $scope.accounts.forEach(function(each){
                // for every account, going to grab the profile picture
                $facebook.api('/' + each.id + '/picture', {type:'normal'}).then(function(pic){
                  var index = _.findIndex($scope.accounts, function(o){ return o.id === each.id;});
                  if(index !== -1){
                    $scope.accounts[index].picUrl = pic.data.url;
                  }
                }, function(err){
                  // TODO this is a subtle missing information, replacing with a not found pic
                  $scope.accounts[index].picUrl = '/images/not-found.png';
                });
              });
          }
          else{
            console.warn('unexpected resp /me/accounts');
            console.dir(resp);
          }
        }, function(err){
          // default behavior, when error go back to main page
          $location.path('/');
        });
    }
})();
