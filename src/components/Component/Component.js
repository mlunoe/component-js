var ObjectUtil = require('../../utils/ObjectUtil');

/*
 * Example usage:
 *
 * var Component = require('../Component');
 * var createElement = require('../../utils/ComponentUtil').createElement;
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
 *     render(props) {
 *       // Return element of component view
 *       return (
 *         createElement('div', null, [
 *           createElement('Example content')
 *         ])
 *       );
 *     }
 *   });
 * };
 */

var attrNames = ['accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'bgcolor', 'border', 'buffered', 'challenge', 'charset', 'checked', 'cite', 'class', 'code', 'codebase', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'contextmenu', 'controls', 'coords', 'crossorigin', 'data', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'dropzone', 'enctype', 'for', 'form', 'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'icon', 'id', 'integrity', 'ismap', 'itemprop', 'keytype', 'kind', 'label', 'lang', 'language', 'list', 'loop', 'low', 'manifest', 'max', 'maxlength', 'minlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'ping', 'placeholder', 'poster', 'preload', 'radiogroup', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'scoped', 'seamless', 'selected', 'shape', 'size', 'sizes', 'slot', 'span', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'summary', 'tabindex', 'target', 'title', 'type', 'usemap', 'value', 'width', 'wrap'];

function camelCaseToDash(str) {
  return !str ? str : str.replace(/([A-Z])/g, function (g) {
    return '-' + g[0].toLowerCase();
  });
}

function Component() {
  // Private scope
  var element = null;
  // var parentComponent = null;
  var parentElement = null;

  return {
    forceUpdate: function () {
      var props = this.props;
      if (this.state == null) {
        // Hard set this, so we don't call forceUpdate recursively
        this.state = this.initialState();
      }

      // Keep an updated copy of the parent
      if (element && element.parentNode && element.parentNode !== parentElement) {
        parentElement = element.parentNode;
      }

      var newElement = this.render(props);


      var isMounting = element == null && newElement != null;
      var isUnmounting = element != null && newElement == null;

      // Call will mount
      if (isMounting && typeof this.componentWillMount === 'function') {
        this.componentWillMount(props);
      }
      // Call will update
      if (!isMounting && typeof this.componentWillUpdate === 'function') {
        this.componentWillUpdate(element, props);
      }
      if (isUnmounting) {
        this.unmount();
      }

      // Set props given on element
      if (newElement != null && typeof props === 'object' && props !== null) {
        Object.keys(props).forEach(function (key) {
          var value = props[key];
          var attrName = camelCaseToDash(key);
          if (typeof value !== undefined && (attrNames.includes(attrName) || attrName.startsWith('data-'))) {
            newElement.setAttribute(attrName, value);
          }
        });
      }

      if (newElement != null && typeof props.children === 'object' && props.children.length) {
        props.children.forEach(function (child) {
          if (child != null) {
            newElement.appendChild(child);
          }
        });
      }

      var oldElement = element;
      element = newElement;

      if (parentElement != null && element != null && !parentElement.contains(element) && parentElement.contains(oldElement)) {
        parentElement.replaceChild(element, oldElement);
      } else if (parentElement != null && element != null && !parentElement.contains(element) && !parentElement.contains(oldElement)) {
        parentElement.appendChild(element);
      }

      // Call did mount
      if (isMounting && typeof this.componentDidMount === 'function') {
        this.componentDidMount(element, props);
      }

      // Call did update
      if (!isMounting && typeof this.componentDidUpdate === 'function') {
        this.componentDidUpdate(element, props);
      }
    },

    /**
     * Attaches a component as child of an element
     * @param  {HTMLElement} parentElement    element to mount component at
     * @return {}
     */
    mount: function (_parentElement, props) {
      if (_parentElement == null) {
        return
      }

      if (element != null && element.parentNode !== _parentElement) {
        this.unmount();
      }

      parentElement = _parentElement;
      this.setProps(props);
      this.forceUpdate();
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
      if (parentElement != null && parentElement.contains(element)) {
        parentElement.removeChild(element);
      }

      // Reset reference
      element = null;
      parentElement = null;
    },

    initialState: function () {
      return {};
    },

    getElement: function () {
      return element;
    },

    setState: function (changes) {
      var newState = ObjectUtil.assign({}, this.state, changes);
      if (newState === this.state ) {
        return;
      }

      this.state = newState;
      this.forceUpdate();
    },

    setProps: function (changes) {
      var newProps = ObjectUtil.assign({}, this.props, changes);
      if (newProps === this.props ) {
        return;
      }

      this.props = newProps;
    },

    render: function () {
      // Separate if-statement so Webpack knows to remove in production
      if (process.env.NODE_ENV !== 'production') {
        throw new Error('Component does not implement `render`, but extends from Component. All objects that extends Component must implement `render`');
      }
    }
  };
}

module.exports = Component;
