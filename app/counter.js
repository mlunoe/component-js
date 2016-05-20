module.exports = class Counter {
  constructor() {
    this._count = 0;
    this._subscribers = [];
    this.restartTimer();
  }

  restartTimer() {
    if (this._counterID) {
      clearInterval(this._counterID);
    }

    this._counterID = setInterval(() => {
      this._count = this.count + 1;
      this._subscribers.forEach((onChange) => {
        onChange();
      });
    }, 1000);
  }

  subscribe(onChange) {
    if (typeof onChange === 'function') {
      this._subscribers.push(onChange);
    }
  }

  unsubscribe(handler) {
    this._subscribers = this._subscribers.filter(function (onChange) {
      return onChange !== handler;
    });
  }

  get count() {
    return this._count;
  }

  render() {
    return (
      '<span>' +
        `Seconds passed since you have opened this page: ${this.count}.` +
      '</span>'
    );
  }
};
