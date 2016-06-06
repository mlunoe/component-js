var Component = require('../../components/Component/Component');
var FunctionUtil = require('../../utils/FunctionUtil');
var ObjectUtil = require('../../utils/ObjectUtil');

function SearchBar() {
  return ObjectUtil.inherits({
    /* Lifecycle methods */
    componentDidMount: function (element, props) {
      // Default to 100 miliseconds. A good time for responsive behaviour
      var wait = props.wait || 100;
      // Call onChange on input change
      element.addEventListener(
        'input',
        // Debounce requests on input, so we only request when typing stops
        FunctionUtil.debounce(props.onChange, 100)
      );
    },

    /* View functions */
    getView: function (props) {
      if (typeof props.onChange !== 'function') {
        throw new Error('SearchBar needs onChange as a function. Type "' + typeof props.onChange + '" was given.');
      }

      return (
        '<input placeholder="search" autofocus="true" class="search" />'
      );
    }
  }, Component);
}

module.exports = SearchBar;
