var RequestUtil = {
  jsonp: function (src, callbackName, callback) {
    var script = document.createElement('script');
    script.setAttribute('src', src + '&callback=' + callbackName);
    // Clean up after script
    script.onload = function () {
      script.remove();
    }

    window[callbackName] = function (data) {
      // Clean up after callback
      delete window[callbackName];
      callback(data);
    }

    document.body.appendChild(script);
  }
};

module.exports = RequestUtil;
