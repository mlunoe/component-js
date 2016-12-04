/*
 * Example usage:
 *
 * var Component = require('../Component/Component');
 * var ObjectUtil = require('./utils/ObjectUtil');
 *
 * module.exports = function MyComponent() {
 *   // Private scope
 *
 *   return ObjectUtil.inherits({
 *     componentDidMount() {
 *       // Do something with this.getElement() after mount
 *     },
 *
 *     componentDidUpdate() {
 *       // Do something  with this.getElement() on component update
 *     },
 *
 *     componentWillUnmount() {
 *       // Clean up component
 *     },
 *
 *     getView(parentElement) {
 *       // Return string of component view
 *       return (
 *         '<div>' +
 *           'Example DIV' +
 *         '</div>'
 *       );
 *     }
 *   }, Component);
 * };
 */

function Component() {
  // Private scope
  var element;

  return {
    // Public API
    props: {},
    /**
     * Returns current attached element
     * @return {DOMElement} current attached DOMElement for component
     */
    getElement: function () {
      return element;
    },
    /**
     * Function to call when component should render into parent node
     * Calls componentDidMount when node has mounted
     * Calls componentDidUpdate when node was updated
     * @param  {DOM Node} parentElement to render component within
     * @param  {Object} properties passed from render caller
     */
    render: function (parentElement, props) {
      this.props = props || {};

      // Create temporary node to set innerHTML in
      var tempNode = document.createElement('div');
      tempNode.innerHTML = this.getView();
      // Get the first child of temporary node, i.e. our view and
      // store our new instance, and this before we get the view
      var newElement = tempNode.firstChild;

      // Rendering into new parent, unmount this element, so we can create a new
      if (element && parentElement !== element.parentNode) {
        this.unmount();
      }
      // Make sure that element is actually a child node of parent
      // before we attempt to replace
      if (element && parentElement === element.parentNode) {
        // Handle consecutive renders
        /*
         * Replace this line with:
         * `dd.apply(element, dd.diff(element, element));`
         * from https://github.com/fiduswriter/diffDOM to create a mini version
         * of React
         */
        parentElement.replaceChild(newElement, element);
      }

      if (!element) {
        // Handle first render
        parentElement.appendChild(newElement);
      }
      // Store reference to element to be removed
      var oldElement = element;
      element = newElement;

      // Call did mount
      if (!oldElement && typeof this.componentDidMount === 'function') {
        this.componentDidMount();
      }

      // Call did update
      if (oldElement && typeof this.componentDidUpdate === 'function') {
        this.componentDidUpdate();
      }
    },

    /**
     * Unmounts element from its parent, if it has a parent. Calls
     * componentWillUnmount if defined on object.
     */
    unmount: function () {
      if (typeof this.componentWillUnmount === 'function') {
        this.componentWillUnmount();
      }

      // Check if child still has a parent node before attempting to remove
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      // Delete reference
      element = undefined;
    }
  };
}

module.exports = Component;
