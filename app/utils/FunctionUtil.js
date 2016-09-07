var FunctionUtil = {
  /**
   * Returns a function, that, as long as it continues to be invoked, will not
   * be triggered. The function will be called after it stops being called for
   * N milliseconds. Triggers the function on the trailing edge.
   * @param  {Function} callback function to call
   * @param  {Integer} wait Miliseconds to wait for each call
   * @return {Function} a debounced function that will call callback
   * when invoked
   */
  debounce: function (callback, wait) {
    var lastUpdate;
    var timeoutID;

    return function () {
      var newUpdate = Date.now();
      if (lastUpdate && lastUpdate - newUpdate < wait) {
        clearTimeout(timeoutID);
      }
      timeoutID = setTimeout(callback.bind(this, arguments), wait);
      lastUpdate = newUpdate;
    };
  }
};

module.exports = FunctionUtil;
