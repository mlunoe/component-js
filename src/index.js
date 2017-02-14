require('./index.scss');
var App = require('./App');

window.onload = function () {
  var container = document.createElement('div');

  // Mount app
  new App().render(container);
  document.getElementById('app').appendChild(container);
};
