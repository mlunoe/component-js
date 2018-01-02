var ObjectUtil = {
  /**
   * Polyfill from MDN
   * Copies values of all enumerable own properties from one or more source
   * objects to a target object. It will return the target object.
   * @param  {Object} target the object to copy to
   * @param  {Object} source(s) the object to copy from
   * @return {Object} the object with source properties copied to target.
   */
  assign: function (target /* , ...source */) {
    var result = target;
    if (result == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    result = Object(result);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        // eslint-disable-next-line no-loop-func
        Object.keys(source).forEach(function (key) {
          result[key] = source[key];
        });
      }
    }

    return result;
  }
};

module.exports = ObjectUtil;
