require('./index.scss');
import Counter from './components/Counter/Counter.js';
import Button from './components/Button/Button.js';

window.onload = function () {
  let app = document.createElement('div');
  app.classList.add('container-fluid');

  // Declare counter
  let counter = new Counter();
  counter.subscribe(function (count) {
    counter.render(app);
  });
  counter.restartTimer();

  // Declare button
  let button = new Button();
  button.render(app);

  // Mount app
  document.getElementById('app').appendChild(app);
};
