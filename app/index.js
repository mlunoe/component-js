require('./index.scss');
var App = require('./App');
var RequestUtil = require('./utils/RequestUtil');

window.onload = function () {
  var children = [];
  var container = document.createElement('div');
  var app = new App();
  // Declare counter
  RequestUtil.jsonp('https://api.flickr.com/services/feeds/photos_public.gne?format=json', 'jsonFlickrFeed', function (photos) {
    children = photos.items.map(function (photo) {
      return {src: photo.media.m}
    });

    app.render(container, {children: children});
  });

  // Mount app
  app.subscribe(function () {
    app.render(container, {children: children});
  });
  app.render(container, {children: children});
  document.getElementById('app').appendChild(container);
};
