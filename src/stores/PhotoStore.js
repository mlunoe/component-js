var EventEmitter = require('../events/EventEmitter');
var EventTypes = require('../constants/EventTypes');
var ObjectUtil = require('../utils/ObjectUtil');
var RequestUtil = require('../utils/RequestUtil');

function PhotoStore() {
  var baseUrl = 'https://api.flickr.com/services';
  var transferProperties = [
    'date_taken', 'published', 'author',
    'author_id', 'description', 'link', 'title'
  ];
  var restructureProperties = {
    media: function (media) {
      return {prop: 'src', value: media.m};
    },
    tags:  function (tags) {
      return {prop: 'tags', value: tags.split(' ')};
    }
  };

  var images = [];
  var largeImages = {};

  return ObjectUtil.assign(Object.create(new EventEmitter()), {
    fetchPhotos: function (queryString) {
      var query = '';
      if (queryString) {
        query = '&tags=' + queryString;
      }
      var url = baseUrl + '/feeds/photos_public.gne?' +
        'format=json' +
        '&safe_search=3' +
        query;
      RequestUtil.jsonp(url, 'jsonFlickrFeed', function (photos) {
        images = photos.items.map(function (photo) {
          // Reduce data to the format we want to store
          return Object.keys(photo).reduce(function (memo, prop) {
            if (transferProperties.indexOf(prop) > -1) {
              memo[prop] = photo[prop];
            }

            if (typeof restructureProperties[prop] === 'function') {
              var result = restructureProperties[prop](photo[prop]);
              memo[result.prop] = result.value;
            }

            return memo;
          }, {});
        });

        // Emit change event
        this.emit(EventTypes.PHOTO_STORE_PHOTOS_CHANGE);
      }.bind(this));
    },

    fetchLargePhoto: function (photoID) {
      if (largeImages[photoID]) {
        this.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, photoID);

        return;
      }

      var url =  baseUrl + '/rest/?method=flickr.photos.getSizes' +
        '&api_key=1c00c6a8b785a5baf3fb98859ae3ed18' +
        '&photo_id=' + photoID +
        '&format=json';
      RequestUtil.jsonp(url, 'jsonFlickrApi' + Date.now(), function (data) {
        if (data.stat !== 'ok') {
          this.emit(
            EventTypes.PHOTO_STORE_SINGLE_PHOTO_ERROR,
            photoID,
            data.message
          );

          return false;
        }

        data.sizes.size.forEach(function (photo, index) {
          // First available size of eiter 'Original' or the last available size
          if (!largeImages[photoID] && (photo.label.indexOf('Original') > -1 ||
            (index + 1 === data.sizes.size.length))) {
            largeImages[photoID] = {src: photo.source};
          }
        });

        if (!largeImages[photoID]) {
          this.emit(
            EventTypes.PHOTO_STORE_SINGLE_PHOTO_ERROR,
            photoID,
            'Did not find any content when searching for requested image.'
          );

          return false;
        }

        this.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, photoID);
      }.bind(this));
    },

    getPhotos: function () {
      return images;
    },

    getLargePhoto: function (photoID) {
      return largeImages[photoID];
    }
  }, EventEmitter);
}

// Singleton-ish
module.exports = new PhotoStore();
