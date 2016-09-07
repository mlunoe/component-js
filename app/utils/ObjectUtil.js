var ObjectUtil = {
  /**
   * Polyfill from MDN
   * Copies values of all enumerable own properties from one or more source
   * objects to a target object. It will return the target object.
   * @param  {object} target the object to copy to
   * @param  {object} source(s) the object to copy from
   * @return {object} the object with source properties copied to target.
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
  },

  /**
   * Creates a new object with properties from Child and
   * adds Parent as the prototype object.
   * @param  {{Object|Function}} Child properties to have on
   * newly created object
   * @param  {{Object|Function}} Parent prototype to have on
   * newly created object
   * @return {Object} the object with Child properties
   * and Parent protoype.
   */
  inherits: function (Child, Parent) {
    var parent = Parent;
    var child = Child;

    if (typeof Parent === 'function') {
      parent = new Parent();
    }

    if (typeof Child === 'function') {
      child = new Child();
    }

    return this.assign(Object.create(parent), child);
  }
};

module.exports = ObjectUtil;
