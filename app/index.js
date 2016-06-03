require('./index.scss');
var Button = require('./components/Button/Button');
var Counter = require('./components/Counter/Counter');
var RequestUtil = require('./utils/RequestUtil');

window.onload = function () {
  var app = document.createElement('div');
  app.classList.add('container-fluid');

  var children = [];
  // Declare counter
  var counter = new Counter();
  counter.subscribe(function (count) {
    counter.render(app);
  });
  counter.restartTimer();
  RequestUtil.jsonp('https://api.flickr.com/services/feeds/photos_public.gne?format=json', 'jsonFlickrFeed', function (photos) {
    children = photos.items.map(function (photo) {
      return {src: photo.media.m}
    });

  // Declare button
  var button = new Button();
  button.render(app);

  // Mount app
  document.getElementById('app').appendChild(app);
};
