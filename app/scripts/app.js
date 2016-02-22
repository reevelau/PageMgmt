'use strict';

/**
 * @ngdoc overview
 * @name pageMgmtApp
 * @description
 * # pageMgmtApp
 *
 * Main module of the application.
 */
angular
  .module('pageMgmtApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngFacebook'
  ])
  .config(function ($routeProvider) {

  })
  .config(function configFacebookSdk($facebookProvider){
    $facebookProvider.setAppId('821305878016174');
    $facebookProvider.setPermissions('manage_pages,publish_pages,read_insights,email');
    $facebookProvider.setVersion('v2.5');
    $facebookProvider.setCustomInit({
        xfbml      : true
      });
  })
  .run(function($rootScope, $location){


    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

     $rootScope.$on('fb.auth.statusChange',function(authResponse){
       console.log('fb.auth.statusChange');
       console.dir(authResponse);
       if(authResponse.status === 'connected'){
         console.log('connection become connected');
       }
     });

     $rootScope.$on('fb.auth.login',function(authResponse){
       console.log('fb.auth.login, authResponse');
       console.dir(authResponse);
     });
     $rootScope.$on('fb.auth.logout',function(authResponse){
       console.log('fb.auth.logout, authResponse');
       console.dir(authResponse);
       $location.path('/');
     });
     $rootScope.$on('fb.edge.create',function(url,ele){
       console.log('fb.edge.create, {url,ele}');
       console.dir(url);
       console.dir(ele);
     });
     $rootScope.$on('fb.edge.remove',function(url,ele){
       console.log('fb.edge.remove, {url,ele}');
       console.dir(url);
       console.dir(ele);
     });
     $rootScope.$on('fb.message.send',function(url){
       console.log('fb.message.send');
       console.dir(url);
     });
  });
