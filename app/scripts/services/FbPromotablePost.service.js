(function() {
    'use strict';

    angular
        .module('pageMgmtApp')
        .factory('FbPromotablePost', factory);

    factory.$inject = [];

    /* @ngInject */
    function factory() {

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
          ret.attachments = post.attachments;
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
            case 'status':
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
            case 'offer': // TODO : how to handle this?
            default:
                ret.displayTitle = post.message;
              break;
          }

          return ret;
        }


        var service = {
            processPostObject: processPostObject
        };

        return service;
    }
})();
