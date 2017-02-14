var Component = require('../../components/Component/Component');
var EventEmitter = require('../../events/EventEmitter');
var EventTypes = require('../../constants/EventTypes');
var ImageViewer = require('../../components/ImageViewer/ImageViewer');
var ObjectUtil = require('../../utils/ObjectUtil');
var PhotoStore = require('../../stores/PhotoStore');
var Thumbnail = require('../../components/Thumbnail/Thumbnail');

function ImageGrid() {
  var imageViewer = new ImageViewer();
  var shouldAnimateIn = true;
  var selectedImage;

  return ObjectUtil.inherits({
    /* Lifecycle methods */
    componentDidMount: function () {
      // Ensure context is this in handlers
      this.handleImageClick = this.handleImageClick.bind(this);
      this.handleImageViewerClose = this.handleImageViewerClose.bind(this);
      this.handleImageViewerLeftClick =
        this.handleImageViewerLeftClick.bind(this);
      this.handleImageViewerRightClick =
        this.handleImageViewerRightClick.bind(this);

      this.componentDidUpdate();
    },

    componentDidUpdate: function () {
      this.getElement().addEventListener('click', this.handleImageClick, false);
      this.renderPhotoGrid();
    },

    componentWillUnmount: function () {
      var element = this.getElement();
      if (!element) {
        return;
      }

      // Clean up
      element.removeEventListener('click', this.handleImageClick);
    },

    /* Event handlers */
    handleImageClick: function (event) {
      var index = parseInt(event.target.dataset.index, 10);
      if (!isNaN(index)) {
        shouldAnimateIn = true;
        selectedImage = index;
        this.renderSelectedImage();
      }
    },

    handleImageViewerClose: function () {
      shouldAnimateIn = true;
      selectedImage = undefined;
      this.renderSelectedImage();
    },

    handleImageViewerLeftClick: function (event) {
      var photos = PhotoStore.getPhotos();
      // Should do nothing if the key event was already consumed,
      // or there are no photos
      if (event.defaultPrevented || !photos) {
        return;
      }

      if (--selectedImage < 0) {
        selectedImage = photos.length - 1;
      }

      shouldAnimateIn = false;
      this.renderSelectedImage();
    },

    handleImageViewerRightClick: function (event) {
      var photos = PhotoStore.getPhotos();
      // Should do nothing if the key event was already consumed,
      // or there are no photos
      if (event.defaultPrevented || !photos) {
        return;
      }

      // Add before the modulus operator and use modulus as a circular buffer
      selectedImage = ++selectedImage % photos.length;
      shouldAnimateIn = false;
      this.renderSelectedImage();
    },

    /* View functions */
    renderPhotoGrid: function () {
      var element = this.getElement().querySelector('.grid');
      PhotoStore.getPhotos().forEach(function (props, index) {
        var newProps = ObjectUtil.assign({}, props);
        newProps.index = index;
        newProps.className = 'grid-item';
        new Thumbnail().render(element, newProps);
      });
    },

    renderSelectedImage: function () {
      var photos = PhotoStore.getPhotos();
      var element = this.getElement().querySelector('.selected-image');
      if (!element || !photos.length) {
        return;
      }

      var selectedChild = photos[selectedImage];
      if (!selectedChild) {
        imageViewer.unmount();

        return;
      }

      imageViewer.render(element, {
        backdropClose: true,
        onLeftClick: this.handleImageViewerLeftClick,
        onRightClick: this.handleImageViewerRightClick,
        onClose: this.handleImageViewerClose,
        child: selectedChild,
        shouldAnimateIn: shouldAnimateIn
      });
    },

    getView: function () {
      var noImagesMessage = '';
      if (!PhotoStore.getPhotos().length) {
        noImagesMessage = (
          '<p class="text-align-center primary">' +
            'Sorry, no images was found from that search. ' +
            'Please try another search.' +
          '</p>'
        );
      }

      return (
        '<div>' +
          noImagesMessage +
          '<div class="grid grid--1of4"></div>' +
          '<div class="selected-image"></div>' +
        '</div>'
      );
    }
  }, ObjectUtil.inherits(Component, EventEmitter));
}

module.exports = ImageGrid;
