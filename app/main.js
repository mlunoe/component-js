import Counter from './counter.js';

let app = document.createElement('div');
let counter = new Counter();

let renderApp = function (count) {
  app.innerHTML = counter.render();
};

renderApp();
counter.subscribe(renderApp);

// Mount app
document.getElementById('app').appendChild(app);
