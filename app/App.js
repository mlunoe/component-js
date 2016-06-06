var Component = require('./components/Component/Component');
var EventTypes = require('./constants/EventTypes');
var FunctionUtil = require('./utils/FunctionUtil');
var SearchBar = require('./components/SearchBar/SearchBar');
var ImageGrid = require('./components/ImageGrid/ImageGrid');
var ObjectUtil = require('./utils/ObjectUtil');
var PhotoStore = require('./stores/PhotoStore');
var Thumbnail = require('./components/Thumbnail/Thumbnail');

function App() {
  var imageGrid = new ImageGrid();
  var searchBar = new SearchBar();
  var selectedImage;
  var renderImageGridHandler;
  var lastQuery = '';

  return ObjectUtil.inherits({
    /* Lifecycle methods */
    componentDidMount: function (element) {
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

      // Re-render image grid when requested
      renderImageGridHandler = this.renderImageGrid.bind(
        this,
        element.querySelector('.image-grid')
      );

      imageGrid.on(EventTypes.COMPONENT_CHANGE, renderImageGridHandler);
      // Re-render image grid when new photos are received
      PhotoStore.on(EventTypes.PHOTO_STORE_PHOTOS_CHANGE, renderImageGridHandler);
      // Fetch photos on intial render
      PhotoStore.fetchPhotos(lastQuery);
    },

    componentWillUnmount: function () {
      // Never actually called,
      // but always good practise to clean up after our selves
      imageGrid.removeChangeListener(
        EventTypes.PHOTO_STORE_PHOTOS_CHANGE,
        renderImageGridHandler
      );
      PhotoStore.removeChangeListener(
        EventTypes.PHOTO_STORE_PHOTOS_CHANGE,
        renderImageGridHandler
      );
    },

    /* View functions */
    renderImageGrid: function (imageGridElement) {
      imageGrid.render(imageGridElement);
    },

    getView: function (props) {
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
