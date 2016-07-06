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
 *     componentDidMount(element) {
 *       // Do something with element after mount
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
    /**
     * Function to call when component should render into parent node
     * Calls componentDidMount when node has mounted
     * @param  {DOM Node} parentElement to render component within
     */
    render: function (parentElement) { // , ...props
      var props = Array.prototype.slice.call(arguments, 1);
      // Create temporary node to set innerHTML in
      var tempNode = document.createElement('div');
      tempNode.innerHTML = this.getView.apply(this, props);
      // Get the first child of temporary node, i.e. our view
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
         * `dd.apply(element, dd.diff(element, newElement));`
         * from https://github.com/fiduswriter/diffDOM to create a mini version
         * of React
         */
        parentElement.replaceChild(newElement, element);
      }

      if (!element) {
        // Handle first render
        parentElement.appendChild(newElement);
      }

      // Store our new instance
      element = newElement;

      if (typeof this.componentDidMount === 'function') {
        var args = [element].concat(props);
        this.componentDidMount.apply(this, args);
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
