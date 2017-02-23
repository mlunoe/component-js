/*
 * Example usage:
 *
 * var Component = require('../Component');
 * var ObjectUtil = require('./utils/ObjectUtil');
 *
 * module.exports = function MyComponent() {
 *   // Private scope
 *
 *   return ObjectUtil.assign(Object.create(new Component()), {
 *     componentWillMount(props) {
 *       // Do something with props before mount
 *     },
 *
 *     componentDidMount(element, props) {
 *       // Do something with element and props after mount
 *     },
 *
 *     componentWillUpdate(element, props) {
 *       // Do something with element and props before update
 *     },
 *
 *     componentDidUpdate(element, props) {
 *       // Do something with element and props on update
 *     },
 *
 *     componentWillUnmount(element, props) {
 *       // Clean up component with element and props
 *     },
 *
 *     getView(props) {
 *       // Return string of component view
 *       return (
 *         '<div>' +
 *           'Example DIV' +
 *         '</div>'
 *       );
 *     }
 *   });
 * };
 */

function Component() {
  // Private scope
  var element = null;

  return {
    // Public API
    /**
     * Function to call when component should render into parent node
     * Calls componentWillMount when node will be mounted
     * Calls componentDidMount when node has mounted
     * Calls componentWillUpdate when node will be updated
     * Calls componentDidUpdate when node was updated
     * @param {DOM Node} parentElement to render component within
     * @param {Object} properties passed from render caller
     */
    render: function (parentElement, props) {
      // Separate if-statement so Webpack knows to remove in production
      if (process.env.NODE_ENV !== 'production') {
        if (!parentElement) {
          throw new Error('Parent of type: `' + typeof parentElement + '` is not valid. Please call `render` with a valid `HTMLElement`.');
        }
      }

      // Call will mount
      if (element == null && typeof this.componentWillMount === 'function') {
        this.componentWillMount(props);
      }

      // Call will update
      if (element != null && typeof this.componentWillUpdate === 'function') {
        this.componentWillUpdate(element, props);
      }

      // Create temporary node to set innerHTML in
      var tempNode = global.document.createElement('div');
      tempNode.innerHTML = this.getView(props);
      // Get the first child of temporary node, i.e. our view and
      // store our new instance, and this before we get the view
      var newElement = tempNode.firstChild;

      // Rendering into new parent, unmount this element, so we can create a new
      if (element != null && parentElement !== element.parentNode) {
        this.unmount(element, props);
      }
      // Make sure that element is actually a child node of parent
      // before we attempt to replace
      if (element != null && parentElement === element.parentNode) {
        // Handle consecutive renders
        /*
         * Replace this line with:
         * `dd.apply(element, dd.diff(element, element));`
         * from https://github.com/fiduswriter/diffDOM to create a mini version
         * of React
         */
        parentElement.replaceChild(newElement, element);
      }

      if (element == null) {
        // Handle first render
        parentElement.appendChild(newElement);
      }
      // Store reference to element to be removed
      var oldElement = element;
      element = newElement;

      // Call did mount
      if (oldElement == null && typeof this.componentDidMount === 'function') {
        this.componentDidMount(element, props);
      }

      // Call did update
      if (oldElement != null && typeof this.componentDidUpdate === 'function') {
        this.componentDidUpdate(element, props);
      }
    },

    /**
     * Unmounts element from its parent, if it has a parent. Calls
     * componentWillUnmount if defined on object.
     */
    unmount: function () {
      // Component was already unmounted
      if (element == null) {
        return;
      }

      if (typeof this.componentWillUnmount === 'function') {
        this.componentWillUnmount(element);
      }

      // Check if child still has a parent node before attempting to remove
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      // Reset reference
      element = null;
    },

    /**
     * Produces view declaration in the form of a string
     * @param  {Object} props properties passed to Component in `render`
     * @return {String} view declaration to render in DOM
     */
    getView: function (props) {
      // Separate if-statement so Webpack knows to remove in production
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(typeof this + ' does not implement `getView`, but extends from Component. All objects that extends Component must implement `getView`');
      }

      return '';
    }
  };
}

module.exports = Component;
