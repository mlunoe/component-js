var Component = require('../Component/Component');

var Counter = (function () {
  var count = 0;
  var counterID;

  return Object.assign({
    restartTimer() {
      if (counterID) {
        clearInterval(counterID);
      }

      count = 0;
      this.notifySubscribers();
      // Tick each second
      counterID = setInterval(() => {
        count++;
        this.notifySubscribers();
      }, 1000);
    },

    getView() {
      return (
        '<div class="text-center">' +
          `Seconds passed since you have opened this page: ${count}.` +
        '</div>'
      );
    }
  }, new Component());
});

module.exports = Counter;
