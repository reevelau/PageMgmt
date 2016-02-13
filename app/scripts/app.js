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
  .run(function($rootScope){


    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

  });
