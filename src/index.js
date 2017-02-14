require('./index.html');
require('./index.scss');
var App = require('./components/App/App');

window.onload = function () {
  var container = document.createElement('div');

  // Mount app
  new App().render(container);
  document.getElementById('app').appendChild(container);
};
