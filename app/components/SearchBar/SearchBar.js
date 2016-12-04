var Component = require('../../components/Component/Component');
var FunctionUtil = require('../../utils/FunctionUtil');
var ObjectUtil = require('../../utils/ObjectUtil');

function SearchBar() {
  return ObjectUtil.inherits({
    /* Lifecycle methods */
    componentDidMount: function () {
      // Default to 100 miliseconds. A good time for responsive behaviour
      var wait = this.props.wait || 100;
      // Call onChange on input change
      this.getElement().addEventListener(
        'input',
        // Debounce requests on input, so we only request when typing stops
        FunctionUtil.debounce(this.props.onChange, 100)
      );
    },

    /* View functions */
    getView: function () {
      if (typeof this.props.onChange !== 'function') {
        throw new Error(
          'SearchBar needs onChange as a function. Type "' +
          typeof this.props.onChange +
          '" was given.'
        );
      }

      return (
        '<input placeholder="search" autofocus="true" class="search" />'
      );
    }
  }, Component);
}

module.exports = SearchBar;
