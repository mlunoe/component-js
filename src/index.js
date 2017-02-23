require('./index.html');
require('./index.scss');
var App = require('./components/App/App');

global.onload = function () {
  var container = global.document.createElement('div');

  // Mount app
  new App().render(container);
  global.document.getElementById('app').appendChild(container);
};
