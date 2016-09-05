var ObjectUtil = {
  /**
   * Creates a new object with properties from ChildInstance and
   * adds ParentInstance as the prototype object.
   * @param  {{Object|Function}} ChildInstance properties to have on
   * newly created object
   * @param  {{Object|Function}} ParentInstance prototype to have on
   * newly created object
   * @param  {{Object}} propertiesObject Optional. An object whose enumerable
   * own properties specify property descriptors to be added to the
   * newly-created object
   * @return {Object} the object with ChildInstance properties
   * and ParentInstance protoype.
   */
  inherits: function (ChildInstance, ParentInstance, propertiesObject) {
    propertiesObject || (propertiesObject = {});
    var parentInstance = ParentInstance;
    var childInstance = ChildInstance;

    if (typeof ParentInstance === 'function') {
      parentInstance = new ParentInstance();
    }

    if (typeof ChildInstance === 'function') {
      childInstance = new ChildInstance();
    }

    var properties = Object.keys(childInstance).reduce(function (memo, key) {
      memo[key] = {
        value: childInstance[key],
        writable: propertiesObject.writable !== false, // default to true
        enumerable: propertiesObject.enumerable !== false, // default to true
        configurable: propertiesObject.configurable !== false // default to true
      };

      return memo;
    }.bind(this), {});

    return Object.create(parentInstance, properties);
  }
};

module.exports = ObjectUtil;
