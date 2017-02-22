var Component = require('../Component');
var EventTypes = require('../../constants/EventTypes');
var FunctionUtil = require('../../utils/FunctionUtil');
var SearchBar = require('../SearchBar');
var ImageGrid = require('../ImageGrid');
var ObjectUtil = require('../../utils/ObjectUtil');
var PhotoStore = require('../../stores/PhotoStore');
var Thumbnail = require('../Thumbnail');

function App() {
  var imageGrid = new ImageGrid();
  var searchBar = new SearchBar();
  var lastQuery = '';

  return ObjectUtil.assign(Object.create(new Component()), {
    /* Lifecycle methods */
    componentDidMount: function (element, props) {
      // Fetch new photos on input change
      searchBar.render(element.querySelector('.search-bar'), {
        onChange: function () {
          // Don't re-fetch unless we have a new query
          if (lastQuery !== this.value) {
            PhotoStore.fetchPhotos(this.value);
            lastQuery = this.value;
          }
        }
      });

      // Pass necessary properties to handlers
      this.renderImageGrid = this.renderImageGrid.bind(
        this,
        element.querySelector('.image-grid')
      );
      // Re-render image grid when new photos are received
      PhotoStore.addListener(
        EventTypes.PHOTO_STORE_PHOTOS_CHANGE,
        this.renderImageGrid
      );
      // Fetch photos on intial render
      PhotoStore.fetchPhotos(lastQuery);
    },

    componentWillUnmount: function () {
      // Never actually called,
      // but always good practise to clean up after our selves
      imageGrid.removeChangeListener(
        EventTypes.PHOTO_STORE_PHOTOS_CHANGE,
        this.renderImageGrid
      );
      PhotoStore.removeChangeListener(
        EventTypes.PHOTO_STORE_PHOTOS_CHANGE,
        this.renderImageGrid
      );
    },

    /* View functions */
    renderImageGrid: function (imageGridEl) {
      imageGrid.render(imageGridEl);
    },

    getView: function () {
      return (
        '<div class="app">' +
          '<div class="search-bar"></div>' +
          '<div class="image-grid"></div>' +
        '</div>'
      );
    }
  });
}

module.exports = App;
