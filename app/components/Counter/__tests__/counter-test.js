var expect = require('chai').expect;
var sinon = require('sinon');

var Counter = require('../Counter.js');

describe('CounterApp', function () {
  var clock;
  var div;
  var counter;

  beforeEach(function () {
    clock = sinon.useFakeTimers();
    counter = new Counter();
    counter.restartTimer();
    div = document.createElement('div')
    div.innerHTML = counter.render();
  });

  it('renders correctly', function () {
    var spans = div.getElementsByTagName('span');
    expect(spans[0].innerHTML).to.equal('Seconds passed since you have opened this page: 0.');
  });

  it('updates time accordingly', function () {
    clock.tick(2000);
    div.innerHTML = counter.render();
    var spans = div.getElementsByTagName('span');
    expect(spans[0].innerHTML).to.equal('Seconds passed since you have opened this page: 2.');
  });

});
