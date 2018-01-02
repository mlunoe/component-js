var onGoingRequests = {};
var RequestUtil = {
  /**
   * Makes a request by adding a script tag to the body element with the src
   * attribute as the request url
   * @param  {String} url to request
   * @param  {String} callbackName name of callback
   * @param  {Function} callback to be called when request returns
   */
  jsonp: function (url, callbackName, callback) {
    var script = global.document.createElement('script');
    script.setAttribute('src', url + '&jsoncallback=' + callbackName);
    // Clean up after script
    script.onload = function () {
      global.document.body.removeChild(script);
    };

    global[callbackName] = function (data) {
      onGoingRequests[callbackName]--;
      if (onGoingRequests[callbackName] === 0) {
        delete onGoingRequests[callbackName];
      }
      // Clean up after callback, if we are the last call waiting
      if (onGoingRequests === 0) {
        delete global[callbackName];
      }
      callback(data);
    };

    // TODO: Should really clear ongoing requests as we are firing a new one to
    // override it. This will be fixed by not using jsonp
    if (onGoingRequests[callbackName] === undefined) {
      onGoingRequests[callbackName] = 0;
    }

    onGoingRequests[callbackName]++;
    global.document.body.appendChild(script);
  }
};

module.exports = RequestUtil;
