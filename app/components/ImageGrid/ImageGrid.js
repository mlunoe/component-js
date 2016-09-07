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
    componentDidMount: function (element) {
      this.componentDidUpdate(element);
    },

    componentDidUpdate: function (element) {
      element.onclick = this.handleImageClick.bind(this, element.querySelector('.selected-image'));
      var photos = PhotoStore.getPhotos();
      this.renderPhotoGrid(element.querySelector('.grid'), photos);
    },

    componentWillUnmount: function () {
      // Nothing to clean up
    },

    /* Event handlers */
    handleImageClick: function (element, event) {
      var index = parseInt(event.target.dataset.index, 10);
      if (!isNaN(index)) {
        shouldAnimateIn = true;
        selectedImage = index;
        this.renderSelectedImage(element, PhotoStore.getPhotos());
      }
    },

    handleImageViewerClose: function (element) {
      shouldAnimateIn = true;
      selectedImage = undefined;
      this.renderSelectedImage(element, PhotoStore.getPhotos());
    },

    handleImageViewerLeftClick: function (element, photos, event) {
      // Should do nothing if the key event was already consumed,
      // or there is only one or no photos
      if (event.defaultPrevented || !photos || photos.length < 2) {
        return;
      }

      if (--selectedImage < 0) {
        selectedImage = photos.length - 1;
      }

      shouldAnimateIn = false;
      this.renderSelectedImage(element, PhotoStore.getPhotos());
    },

    handleImageViewerRightClick: function (element, photos, event) {
      // Should do nothing if the key event was already consumed,
      // or there is only one or no photos
      if (event.defaultPrevented || !photos || photos.length < 2) {
        return;
      }

      // Add before the modulus operator and use modulus as a circular buffer
      selectedImage = ++selectedImage % photos.length;
      shouldAnimateIn = false;
      this.renderSelectedImage(element, PhotoStore.getPhotos());
    },

    /* View functions */
    renderPhotoGrid: function (element, photos) {
      photos.forEach(function (props, index) {
        var newProps = ObjectUtil.assign({}, props);
        newProps.index = index;
        newProps.className = 'grid-item';
        new Thumbnail().render(element, newProps);
      });
    },

    renderSelectedImage: function (element, photos) {
      if (!element || !photos.length) {
        return;
      }

      var selectedChild = photos[selectedImage];
      if (!selectedChild) {
        imageViewer.unmount();

        return;
      }

      var props = {
        backdropClose: true,
        onLeftClick: this.handleImageViewerLeftClick.bind(this, element, photos),
        onRightClick: this.handleImageViewerRightClick.bind(this, element, photos),
        onClose: this.handleImageViewerClose.bind(this, element),
        child: selectedChild,
        shouldAnimateIn: shouldAnimateIn
      };

      imageViewer.render(element, props);
    },

    getView: function (props) {
      var noImagesMessage = '';
      if (!PhotoStore.getPhotos().length) {
        noImagesMessage = (
          '<p class="text-align-center primary">' +
            'Sorry, no images was found from that search. Please try another search.' +
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
