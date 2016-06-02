/*
 * Example usage:
 *
 * var Component require('../Component/Component');
 *
 * module.exports = var MyComponent = (function () {
 *   // Private scope
 *
 *   return Object.assign({
 *
 *     componentDidMount(element) {
 *       // Do something with element after mount
 *     },
 *
 *     getView(parentNode) {
 *       // Return string of component view
 *       return (
 *         '<div>' +
 *           'Example DIV' +
 *         '</div>'
 *       );
 *     }
 *   }, new Component());
 * });
 */

var Component = (function () {
  // Private scope
  var element;
  var subscribers = [];

  return {
    // Public API

    /**
     * Function to call to notify subscribers of change
     */
    notifySubscribers() {
      subscribers.forEach(function(onChange) {
        onChange();
      });
    },

    /**
     * Subscribe to change fired by implementing component
     * @param  {function} onChange handler that is called on change
     */
    subscribe(onChange) {
      if (typeof onChange === 'function') {
        subscribers.push(onChange);
      }
    },

    /**
     * Unsubscribe from change events fired by implementing component
     * @param  {function} handler to remove from change events
     */
    unsubscribe(handler) {
      subscribers = subscribers.filter(function (onChange) {
        return onChange !== handler;
      });
    },

    /**
     * Function to call when component should render into parent node
     * Calls componentDidMount when node has mounted
     * @param  {DOM Node} parentNode to render component within
     */
    render(parentNode) {
      // Create temporary node to set innerHTML in
      var tempNode = document.createElement('div');
      tempNode.innerHTML = this.getView();
      // Get the first child of temporary node, i.e. our view
      var newElement = tempNode.firstChild;
      if (element) {
        // Handle consecutive renders
        parentNode.replaceChild(newElement, element);
      } else {
        // Handle first render
        parentNode.appendChild(newElement);
      }

      // Store our new instance
      element = newElement;

      if (typeof this.componentDidMount === 'function') {
        this.componentDidMount(element);
      }
    }
  };
});

module.exports = Component;
