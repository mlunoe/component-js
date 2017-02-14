var Component = require('../Component/Component');
var EventTypes = require('../../constants/EventTypes');
var FunctionUtil = require('../../utils/FunctionUtil');
var SearchBar = require('../SearchBar/SearchBar');
var ImageGrid = require('../ImageGrid/ImageGrid');
var ObjectUtil = require('../../utils/ObjectUtil');
var PhotoStore = require('../../stores/PhotoStore');
var Thumbnail = require('../Thumbnail/Thumbnail');

function App() {
  var imageGrid = new ImageGrid();
  var searchBar = new SearchBar();
  var lastQuery = '';

  return ObjectUtil.inherits({
    /* Lifecycle methods */
    componentDidMount: function () {
      // Fetch new photos on input change
      searchBar.render(this.getElement().querySelector('.search-bar'), {
        onChange: function () {
          // Don't re-fetch unless we have a new query
          if (lastQuery !== this.value) {
            PhotoStore.fetchPhotos(this.value);
            lastQuery = this.value;
          }
        }
      });

      // Ensure context is this in handlers
      this.renderImageGrid = this.renderImageGrid.bind(this);

      // Re-render image grid when requested
      imageGrid.on(EventTypes.COMPONENT_CHANGE, this.renderImageGrid);
      // Re-render image grid when new photos are received
      PhotoStore.on(EventTypes.PHOTO_STORE_PHOTOS_CHANGE, this.renderImageGrid);
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
    renderImageGrid: function () {
      imageGrid.render(this.getElement().querySelector('.image-grid'));
    },

    getView: function () {
      return (
        '<div class="app">' +
          '<div class="search-bar"></div>' +
          '<div class="image-grid"></div>' +
        '</div>'
      );
    }
  }, Component);
}

module.exports = App;
