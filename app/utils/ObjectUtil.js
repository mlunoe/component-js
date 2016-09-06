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
   * Creates a new object with properties from ChildInstance and
   * adds ParentInstance as the prototype object.
   * @param  {{object|function}} ChildInstance properties to have on
   * newly created object
   * @param  {{object|function}} ParentInstance prototype to have on
   * newly created object
   * @return {object} the object with ChildInstance properties
   * and ParentInstance protoype.
   */
  inherits: function (ChildInstance, ParentInstance) {
    var parentInstance = ParentInstance;
    var childInstance = ChildInstance;

    if (typeof ParentInstance === 'function') {
      parentInstance = new ParentInstance();
    }

    if (typeof ChildInstance === 'function') {
      childInstance = new ChildInstance();
    }

    return this.assign(Object.create(parentInstance), childInstance);
  }
};

module.exports = ObjectUtil;
