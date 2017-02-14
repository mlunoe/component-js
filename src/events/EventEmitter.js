/*
 * Example usage:
 *
 * var EventEmitter require('../EventEmitter/EventEmitter');
 * var ObjectUtil = require('./utils/ObjectUtil');
 *
 * module.exports = function MyEventEmitter() {
 *   // Private scope
 *
 *   return ObjectUtil.inhreits({
 *
 *     componentDidMount(element) {
 *       // Do something with element after mount
 *       this.emt('change', 'Element mounted');
 *     }
 *   }, EventEmitter);
 * };
 */

function EventEmitter() {
  var subscriptions = {};

  return {
    /**
     * Function to call to notify subscribers of change
     */
    emit: function (eventName) {// , ...arg
      var args = Array.prototype.slice.call(arguments, 1);
      var subscribers = subscriptions[eventName] || [];
      subscribers.forEach(function(handler) {
        handler.apply(this, args);
      });
    },

    /**
     * Subscribe to change fired by implementing component
     * @param  {Function} hander handler that is called on change
     */
    on: function (eventName, handler) {
      if (!eventName) {
        throw new Error('Subscribers must provide an event to listen to.');
      }

      if (typeof handler !== 'function') {
        throw new Error('Event handler must be of type function. Type "' + typeof handler + '" was provided for event ' + eventName + '.');
      }

      if (!subscriptions[eventName]) {
        // Forst listener, initialize
        subscriptions[eventName] = [];
      }

      var alreadySubscribed = false;
      subscriptions[eventName].forEach(function (eventHander) {
        if (eventHander === handler) {
          alreadySubscribed = true;
        }
      });

      if (!alreadySubscribed) {
        subscriptions[eventName].push(handler);
      }
    },

    /**
     * Unsubscribe from change events fired by implementing component
     * @param  {Function} handler to remove from change events
     */
    removeListener: function (eventName, handler) {
      if (!subscriptions[eventName]) {
        return;
      }

      subscriptions[eventName] = subscriptions[eventName]
        .filter(function (eventHander) {
          return eventHander !== handler;
        }
      );
    }
  };
}

module.exports = EventEmitter;
