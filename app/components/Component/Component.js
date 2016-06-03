/*
 * Example usage:
 *
 * var Component require('../Component/Component');
 * var ObjectUtil = require('./utils/ObjectUtil');
 *
 * module.exports = function MyComponent() {
 *   // Private scope
 *
 *   return ObjectUtil.assign(Object.create(new Component()), {
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
 *   })
 * };
 */

function Component() {
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
    render(parentNode /*, ...props*/) {
      var props = Array.prototype.slice.call(arguments, 1);
      // Create temporary node to set innerHTML in
      var tempNode = document.createElement('div');
      tempNode.innerHTML = this.getView.apply(this, props);
      // Get the first child of temporary node, i.e. our view
      var newElement = tempNode.firstChild;
      // Make sure that element is actually a child node of parent
      // before we attempt to replace
      if (element && parentNode === element.parentNode) {
        // Handle consecutive renders
        parentNode.replaceChild(newElement, element);
      } else {
        // Handle first render
        parentNode.appendChild(newElement);
      }

      // Store our new instance
      element = newElement;

      if (typeof this.componentDidMount === 'function') {
        var args = [element].concat(props);
        this.componentDidMount.apply(this, args);
      }
    }
  };
}

module.exports = Component;
