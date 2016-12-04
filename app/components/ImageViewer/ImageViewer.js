var Component = require('../Component/Component');
var Image = require('../Image/Image');
var EventTypes = require('../../constants/EventTypes');
var PhotoStore = require('../../stores/PhotoStore');
var KeyboardUtil = require('../../utils/KeyboardUtil');
var ObjectUtil = require('../../utils/ObjectUtil');

var getPhotoID = function (link) {
  var segments = link.split('/');
  var id = segments.pop()
  while (!id) {
    id = segments.pop();
  }

  return id;
};

var handleImageEvent = function (element, props, event) {
  var keyCodes = KeyboardUtil.keyCodes;
  var keyCode = event.keyCode;
  var dataset = event.target.dataset;
  var onLeftClick = props.onLeftClick;
  var onRightClick = props.onRightClick;
  var onClose = props.onClose;

  // Handle change image left
  if (typeof onLeftClick === 'function' && dataset.direction === 'left' ||
    keyCode === keyCodes.leftArrow) {
    onLeftClick(event);
  }

  // Handle change image right
  if (typeof onRightClick === 'function' && dataset.direction === 'right' ||
    keyCode === keyCodes.rightArrow) {
    onRightClick(event);
  }

  // Handle close viewer
  if (dataset.close === 'true' || keyCode === keyCodes.esc) {
    // Remove class to animate. Call close when animation is done
    element.classList.remove('show');
    setTimeout(function () {
      onClose(event);
    }, 200);
  }
};

function ImageViewer() {
  var image = new Image();
  var imageEventHandler;
  var imageRenderHandler;
  var photoID;
  var imageProps;
  var keyPressListenerAttached = false;

  return ObjectUtil.inherits({
    componentDidMount: function (element, props) {
      // Set event handlers
      imageEventHandler = handleImageEvent.bind(this, element, props);
      element.onclick = imageEventHandler;
      // Viewer is opening
      if (props.child && !keyPressListenerAttached) {
        keyPressListenerAttached = true;
        global.window.addEventListener('keydown', imageEventHandler, true);
      }

      // Add show class in next render cycle to animate in
      if (props.shouldAnimateIn) {
        setTimeout(function () {
          element.classList.add('show');
        }, 100);
      }

      // TODO: Handle start loading
      this.componentDidUpdate(element, props);
    },

    componentDidUpdate: function (element, props) {
      photoID = getPhotoID(props.child.link);
      element.onclick = imageEventHandler;
      imageRenderHandler = this.renderImage.bind(
        this,
        element.querySelector('.display-image'),
        props.child
      );
      PhotoStore.on(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE,
        imageRenderHandler
      );
      PhotoStore.on(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_ERROR,
        this.renderError
      );

      // Fetch large photo
      PhotoStore.fetchLargePhoto(photoID);
    },

    componentWillUnmount: function () {
      // Clean up listener
      keyPressListenerAttached = false;
      global.window.removeEventListener('keydown', imageEventHandler, true);
      PhotoStore.removeListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE,
        imageRenderHandler
      );
    },

    renderImage: function (displayImageElement, photo, id) {
      if (photoID === id) {
        image.render(displayImageElement, {
          src: PhotoStore.getLargePhoto(photoID).src,
          // Transfer other information
          title: photo.title,
          link: photo.link
        });
      }
    },

    renderError: function (id) {
      if (photoID === id) {
        // TODO: Handle error
        console.log('Image request error');
      }
    },

    getFooter: function () {
      return (
        '<div class="arrow-container">' +
          '<span data-direction="left" class="arrow left"></span>' +
          '<span data-direction="right" class="arrow right"></span>' +
        '</div>'
      );
    },

    getView: function (props) {
      var dataClose = '';
      if (props.backdropClose) {
        dataClose = 'data-close="true"';
      }

      var imageViewerBackdropClasses = 'image-viewer-backdrop';
      if (!props.shouldAnimateIn) {
        imageViewerBackdropClasses += ' show';
      }

      var child = props.child;
      var title = '';
      if (child) {
        title = '<p class="text-white text-align-center">' + child.title + '<p/>';
      }

      return (
        '<div ' + dataClose + ' class="' + imageViewerBackdropClasses +'">' +
          '<div class="image-viewer">' +
            '<span data-close="true" class="close-button"></span>' +
            '<div class="display-image"></div>' +
            title +
            this.getFooter() +
          '</div>' +
        '</div>'
      );
    }
  }, Component);
}

module.exports = ImageViewer;
