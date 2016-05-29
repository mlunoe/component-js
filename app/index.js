import Counter from './components/Counter/Counter.js';

window.onload = function () {
  let app = document.createElement('div');
  let counter = new Counter();

  let renderApp = function (count) {
    app.innerHTML = counter.render();
  };

  counter.subscribe(renderApp);

  // Mount app
  document.getElementById('app').appendChild(app);
  counter.restartTimer();
};
