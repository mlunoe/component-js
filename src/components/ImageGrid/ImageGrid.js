var Component = require('../../components/Component');
var ComponentUtil = require('../../utils/ComponentUtil');
var EventEmitter = require('../../events/EventEmitter');
var EventTypes = require('../../constants/EventTypes');
var ImageViewer = require('../../components/ImageViewer');
var ObjectUtil = require('../../utils/ObjectUtil');
var PhotoStore = require('../../stores/PhotoStore');
var Thumbnail = require('../../components/Thumbnail');

function ImageGrid() {
  var imageViewer = new ImageViewer();
  var shouldAnimateIn = true;
  var selectedImageIndex;

  /* Event handlers */
  var handleRenderSelectedImage = function () {};

  function handleImageClick(event) {
    var node = event.target;
    // Walk up dom tree to first element from event.target with `data-index`,
    // stop if we reach the image grid node
    while (node.getAttribute('data-index') == null && node !== this) {
      node = node.parentNode;
    }
    var index = parseInt(node.getAttribute('data-index'), 10);
    if (!isNaN(index)) {
      shouldAnimateIn = true;
      selectedImageIndex = index;
      handleRenderSelectedImage();
    }
  }

  function handleImageViewerClose() {
    shouldAnimateIn = true;
    selectedImageIndex = undefined;
    handleRenderSelectedImage();
  }

  function handleImageViewerLeftClick(event) {
    var photos = PhotoStore.getPhotos();
    // Should do nothing if there are no photos
    if (!photos) {
      return;
    }

    if (--selectedImageIndex < 0) {
      selectedImageIndex = photos.length - 1;
    }

    shouldAnimateIn = false;
    handleRenderSelectedImage();
  }

  function handleImageViewerRightClick(event) {
    var photos = PhotoStore.getPhotos();
    // Should do nothing if there are no photos
    if (!photos) {
      return;
    }

    // Add before the modulus operator and use modulus as a circular buffer
    selectedImageIndex = ++selectedImageIndex % photos.length;
    shouldAnimateIn = false;
    handleRenderSelectedImage();
  }

  /* View functions */
  function renderPhotoGrid(imageGridElm, props) {
    var components = PhotoStore.getPhotos().map(function (props, index) {
      return function renderThumbnail(element) {
        new Thumbnail().render(element, ObjectUtil.assign({}, props, {
          className: 'grid-item',
          index: index
        }));
      };
    });

    ComponentUtil.renderMultiple(components, imageGridElm)
  }

  function renderSelectedImage(selectedImageElm) {
    var photos = PhotoStore.getPhotos();
    if (!photos.length) {
      return;
    }

    var selectedChild = photos[selectedImageIndex];
    if (!selectedChild) {
      imageViewer.unmount();

      return;
    }

    imageViewer.render(selectedImageElm, {
      backdropClose: true,
      onLeftClick: handleImageViewerLeftClick,
      onRightClick: handleImageViewerRightClick,
      onClose: handleImageViewerClose,
      child: selectedChild,
      shouldAnimateIn: shouldAnimateIn
    });
  }

  return ObjectUtil.assign(Object.create(new Component()), {
    /* Lifecycle methods */
    componentDidMount: function () {
      this.componentDidUpdate.apply(this, arguments);
    },

    componentWillUpdate: function (element, props) {
      // Clean up element listeners
      var imageGridElm = element.querySelector('.grid');
      imageGridElm.removeEventListener('click', handleImageClick, false);
      // Reset handler after event listener was removed
      var handleRenderSelectedImage = function () {};
    },

    componentDidUpdate: function (element, props) {
      var selectedImageElm = element.querySelector('.selected-image');
      var imageGridElm = element.querySelector('.grid');

      // Create new handler for when prop functions gets called
      handleRenderSelectedImage = function () {
        renderSelectedImage(selectedImageElm);
      };

      // Re-attach element click listener to grid, to only listen
      // for clicks within its children, and not, e.g. image viewer
      imageGridElm.addEventListener('click', handleImageClick, false);
      renderPhotoGrid(imageGridElm, props);
    },

    componentWillUnmount: function (element) {
      // Clean up element listeners
      var imageGridElm = element.querySelector('.grid');
      imageGridElm.removeEventListener('click', handleImageClick, false);
      // Reset handler after event listener was removed
      var handleRenderSelectedImage = function () {};
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
  });
}

module.exports = ImageGrid;
