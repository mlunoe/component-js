require('./index.scss');
var Button = require('./components/Button/Button');
var Counter = require('./components/Counter/Counter');
var RequestUtil = require('./utils/RequestUtil');

// https://github.com/addyosmani/es6-equivalents-in-es5

window.onload = function () {
  // RequestUtil.json({
  //   url: 'http://anyorigin.com/get?url=https%3A//api.flickr.com/services/feeds/photos_public.gne%3Fformat%3Djson&callback=?',
  //   success: function () {
  //     console.log('success');
  //   },
  //   error: function () {
  //     console.log('error');
  //   }
  // });
  // window.jsonFlickrFeed = function (photos) {
  //   console.log(photos);
  // }
  jsonp('https://api.flickr.com/services/feeds/photos_public.gne?format=json', 'jsonFlickrFeed', function (photos) {
    console.log(photos);
  });


  var app = document.createElement('div');
  app.classList.add('container-fluid');

  // Declare counter
  var counter = new Counter();
  counter.subscribe(function (count) {
    counter.render(app);
  });
  counter.restartTimer();

  // Declare button
  var button = new Button();
  button.render(app);

  // Mount app
  document.getElementById('app').appendChild(app);
};
