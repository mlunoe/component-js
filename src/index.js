require('./index.html');
require('./index.scss');
var App = require('./components/App/App');

global.onload = function () {
  // Mount app
  new App().mount(global.document.getElementById('app'));
};
