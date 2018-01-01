var Component = require('../Component');
var createElement = require('../../utils/ComponentUtil').createElement;
var EventTypes = require('../../constants/EventTypes');
var FunctionUtil = require('../../utils/FunctionUtil');
var ImageGrid = require('../ImageGrid');
var ObjectUtil = require('../../utils/ObjectUtil');
var PhotoStore = require('../../stores/PhotoStore');
var SearchBar = require('../SearchBar');
var Thumbnail = require('../Thumbnail');

function App() {
  var imageGrid = new ImageGrid();
  var searchBar = new SearchBar();
  var lastQuery = '';

  return ObjectUtil.assign(Object.create(new Component()), {
    /* Lifecycle methods */
    componentDidMount: function (element, props) {
      // Fetch photos on intial render
      PhotoStore.fetchPhotos(lastQuery);
    },

    render: function () {
      return createElement('div', {class: 'app'}, [
        createElement(searchBar, {
          onChange: function () {
            // Don't re-fetch unless we have a new query
            if (lastQuery !== this.value) {
              PhotoStore.fetchPhotos(this.value);
              lastQuery = this.value;
            }
          }
        }),
        createElement(imageGrid)
      ]);
    }
  });
}

module.exports = App;
