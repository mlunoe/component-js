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
      renderErrorHandler = this.renderError.bind(
        this,
        element.querySelector('.error-message')
      );
      renderImageGridHandler = this.renderImageGrid.bind(
        this,
        element.querySelector('.image-grid'),
        renderErrorHandler
      );


      imageGrid.on(EventTypes.COMPONENT_CHANGE, renderImageGridHandler);
      // Re-render image grid when new photos are received
      PhotoStore.on(EventTypes.PHOTO_STORE_PHOTOS_CHANGE, renderImageGridHandler);
      // Re-render error when new error is received
      PhotoStore.on(EventTypes.PHOTO_STORE_PHOTOS_ERROR, renderErrorHandler);
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
        EventTypes.PHOTO_STORE_PHOTOS_ERROR,
        renderErrorHandler
      );
    },

    /* View functions */
    renderImageGrid: function (imageGridElement, renderError) {
      // Reset error message
      renderError();
      // Re-render image grid when requested
      imageGrid.render(imageGridElement);
    },

    renderError: function (errorElement, message) {
      if (!message) {
        errorElement.innerHTML = '';
        return;
      }
      // Re-render error message when requested
      errorElement.innerHTML =
      '<p class="text-align-center primary">' +
        message +
      '</p>';
    },

    getView: function (props) {
      return (
        '<div class="app">' +
          '<div class="search-bar"></div>' +
          '<div class="error-message"></div>' +
          '<div class="image-grid"></div>' +
        '</div>'
      );
    }
  }, Component);
}

module.exports = App;
