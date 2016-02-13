(function() {
    'use strict';

    angular
        .module('pageMgmtApp')
        .config(function($routeProvider){
          $routeProvider
            .when('/', {
              templateUrl: 'views/main.html',
              controller: 'MainCtrl',
              controllerAs: 'main'
            })
            .when('/page', {
              templateUrl: 'views/page.html',
              controller: 'PageController',
              controllerAs: 'page'
            })
            .when('/management/:pageId', {
              templateUrl: 'views/management.html',
              controller: 'ManagementController',
              controllerAs: 'management'
            })
            .when('/logout', {
              templateUrl: 'views/logout.html',
              controller: 'LogoutController',
              controllerAs: 'Logout'
            })
            .when('/about', {
              templateUrl: 'views/about.html',
              controller: 'AboutCtrl',
              controllerAs: 'about'
            })
            .otherwise({
              redirectTo: '/'
            });

        });
})();
