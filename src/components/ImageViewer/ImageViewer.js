var Component = require('../Component');
var Image = require('../Image');
var EventTypes = require('../../constants/EventTypes');
var PhotoStore = require('../../stores/PhotoStore');
var KeyboardUtil = require('../../utils/KeyboardUtil');
var ObjectUtil = require('../../utils/ObjectUtil');

var keyCodes = KeyboardUtil.keyCodes;

var getPhotoID = function (link) {
  var segments = link.split('/');
  var id = segments.pop()
  while (!id) {
    id = segments.pop();
  }

  return id;
};

function ImageViewer() {
  var image = new Image();
  var photoID;
  var imageProps;

  /* Event handlers */
  var handleImageEvent = function () {};
  function getImageEventHandler(element, props) {
    var onLeftClick = props.onLeftClick;
    var onRightClick = props.onRightClick;
    var onClose = props.onClose;

    // Return handler for event
    return function handleImageEvent(event) {
      var keyCode = event.keyCode;
      var direction = event.target.getAttribute('data-direction');
      var close = event.target.getAttribute('data-close');

      // Handle change image left
      if (typeof onLeftClick === 'function' && direction === 'left' ||
        keyCode === keyCodes.leftArrow) {
        onLeftClick(event);
      }

      // Handle change image right
      if (typeof onRightClick === 'function' && direction === 'right' ||
        keyCode === keyCodes.rightArrow) {
        onRightClick(event);
      }

      if (direction === 'left' || keyCode === keyCodes.leftArrow ||
        direction === 'right' || keyCode === keyCodes.rightArrow) {
        // Hide error message and display image
        element.querySelector('.error-message').classList.remove('hidden');
        element.querySelector('.display-image').classList.add('hidden');
        // Show loader
        element.querySelector('.loader-wrapper').classList.remove('hidden');
      }

      // Handle close viewer
      if (close === 'true' || keyCode === keyCodes.esc) {
        // Remove class to animate. Call close when animation is done
        element.classList.remove('show');
        setTimeout(function () {
          onClose(event);
        }, 200);
      }
    }
  }

  /* View functions */
  var renderImage = function () {};
  function getImageRenderer(element, props) {
    return function renderImage(id) {
      var child = props.child;
      if (photoID !== id) {
        return;
      }
      var photo = PhotoStore.getLargePhoto(photoID);
      if (!photo || !photo.src) {
        return;
      }

      element.querySelector('.loader-wrapper').classList.add('hidden');
      var imageElm = element.querySelector('.display-image');
      imageElm.classList.remove('hidden');

      image.render(imageElm, {
        src: photo.src,
        // Transfer other information
        title: child.title,
        link: child.link
      });
    };
  }

  var renderError = function () {};
  function getErrorRenderer(element) {
    return function renderError(id, message) {
      if (photoID !== id) {
        return;
      }

      element.querySelector('.loader-wrapper').classList.add('hidden');
      var errorElement = element.querySelector('.error-message');
      errorElement.classList.remove('hidden');
      errorElement.innerHTML = message || 'Image request error';
    };
  }

  return ObjectUtil.assign(Object.create(new Component()), {
    /* Lifecycle methods */
    componentDidMount: function (element, props) {
      this.componentDidUpdate.apply(this, arguments);
      // Set global listeners
      global.addEventListener('keydown', handleImageEvent, false);
    },

    componentWillUpdate: function (element) {
      // Clean up element listeners
      element.removeEventListener('click', handleImageEvent, false);
      PhotoStore.removeListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE,
        renderImage
      );
      PhotoStore.removeListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_ERROR,
        renderError
      );

      // Reset handler after event listener was removed
      handleImageEvent = function () {};
      // Reset renderers after event listener was removed
      renderImage = function () {};
      renderError = function () {};
    },

    componentDidUpdate: function (element, props) {
      photoID = getPhotoID(props.child.link);

      var onLeftClick = props.onLeftClick;
      var onRightClick = props.onRightClick;
      var onClose = props.onClose;

      // Create new handlers for event
      handleImageEvent = getImageEventHandler(element, props);
      // Create new render functions
      renderImage = getImageRenderer(element, props);
      renderError = getErrorRenderer(element);

      // Add show class in next render cycle to animate in
      if (props.shouldAnimateIn) {
        if (element) {
          setTimeout(function () {
            element.classList.add('show');
          }, 100);
        }
      }

      // Re-attach element listeners
      element.addEventListener('click', handleImageEvent, false);
      PhotoStore.addListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE,
        renderImage
      );
      PhotoStore.addListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_ERROR,
        renderError
      );

      // Fetch large photo
      PhotoStore.fetchLargePhoto(photoID);
    },

    componentWillUnmount: function (element) {
      // Clean up global listeners
      global.removeEventListener('keydown', handleImageEvent, false);
      // Clean up element listeners
      element.removeEventListener('click', handleImageEvent, false);
      PhotoStore.removeListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE,
        renderImage
      );
      PhotoStore.removeListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_ERROR,
        renderError
      );

      // Reset handler after event listener was removed
      handleImageEvent = function () {};
      // Reset renderers after event listener was removed
      renderImage = function () {};
      renderError = function () {};
    },

    getView: function (props) {
      var backdropClose = props.backdropClose;
      var child = props.child;
      var shouldAnimateIn = props.shouldAnimateIn;

      var dataClose = '';
      if (backdropClose) {
        dataClose = 'data-close="true"';
      }

      var imageViewerBackdropClasses = 'image-viewer-backdrop';
      if (!shouldAnimateIn) {
        imageViewerBackdropClasses += ' show';
      }

      var title = '';
      if (child && child.title) {
        title = (
          '<p class="title text-white text-align-center">' +
            child.title +
          '<p/>'
        );
      }

      return (
        '<div ' + dataClose + ' class="' + imageViewerBackdropClasses +'">' +
          '<div class="image-viewer">' +
            '<span data-close="true" class="close-button"></span>' +
            '<div class="loader-wrapper">' +
              '<div class="loader">' +
                '<div></div>' +
                '<div></div>' +
                '<div></div>' +
              '</div>' +
            '</div>' +
            '<p class="error-message primary hidden"></p>' +
            '<div class="display-image hidden"></div>' +
            title +
            '<div class="arrow-container">' +
              '<span data-direction="left" class="arrow left"></span>' +
              '<span data-direction="right" class="arrow right"></span>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }
  });
}

module.exports = ImageViewer;
