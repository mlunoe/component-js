var ObjectUtil = {
  /**
   * Polyfill from MDN
   * Copies values of all enumerable own properties from one or more source
   * objects to a target object. It will return the target object.
   * @param  {Object} target the object to copy to
   * @param  {Object} source(s) the object to copy from
   * @return {Object} the object with source properties copied to target.
   */
  assign: function (target) { // , ...source
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }

    return target;
  }
};

module.exports = ObjectUtil;
