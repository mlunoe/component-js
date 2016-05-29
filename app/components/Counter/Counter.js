let Counter = (function () {
  let count = 0;
  let counterID;
  let subscribers = [];

  let notifySubscribers = function () {
    subscribers.forEach(function(onChange) {
      onChange();
    });
  }

  return {
    restartTimer() {
      if (counterID) {
        clearInterval(counterID);
      }

      count = 0;
      notifySubscribers();
      // Tick each second
      counterID = setInterval(function () {
        count++;
        notifySubscribers();
      }, 1000);
    },

    subscribe(onChange) {
      if (typeof onChange === 'function') {
        subscribers.push(onChange);
      }
    },

    unsubscribe(handler) {
      subscribers = subscribers.filter(function (onChange) {
        return onChange !== handler;
      });
    },

    render() {
      return (
        '<span>' +
          `Seconds passed since you have opened this page: ${count}.` +
        '</span>'
      );
    }
  };
});

module.exports = Counter;
