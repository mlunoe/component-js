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

function ImageViewer() {
  var image = new Image();
  var photoID;
  var imageProps;
  var keyPressListenerAttached = false;

  return ObjectUtil.inherits({
    /* Lifecycle methods */
    componentDidMount: function () {
      var props = this.props;
      // Ensure context is this in handlers
      this.handleImageEvent = this.handleImageEvent.bind(this);
      this.renderImage = this.renderImage.bind(this);
      this.renderError = this.renderError.bind(this);

      // Viewer is opening
      if (props.child && !keyPressListenerAttached) {
        keyPressListenerAttached = true;
        // Set event handlers
        global.window.addEventListener('keydown', this.handleImageEvent, true);
      }

      // Add show class in next render cycle to animate in
      if (props.shouldAnimateIn) {
        var element = this.getElement();
        if (element) {
          setTimeout(function () {
            element.classList.add('show');
          }, 100);
        }
      }

      this.componentDidUpdate();
    },

    componentWillUpdate: function () {
      // Clean up listeners
      var element = this.getElement();
      if (element) {
        element.removeEventListener('click', this.handleImageEvent, false);
      }
      PhotoStore.removeListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE,
        this.renderImage
      );
      PhotoStore.removeListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_ERROR,
        this.renderError
      );
    },

    componentDidUpdate: function () {
      photoID = getPhotoID(this.props.child.link);

      // Re-attach listeners
      this.getElement().addEventListener('click', this.handleImageEvent, false);
      PhotoStore.on(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE,
        this.renderImage
      );
      PhotoStore.on(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_ERROR,
        this.renderError
      );

      // Fetch large photo
      PhotoStore.fetchLargePhoto(photoID);
    },

    componentWillUnmount: function () {
      // Clean up listeners
      keyPressListenerAttached = false;
      global.window.removeEventListener('keydown', this.handleImageEvent, true);
      var element = this.getElement();
      if (element) {
        element.removeEventListener('click', this.handleImageEvent, false);
      }
      PhotoStore.removeListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE,
        this.renderImage
      );
      PhotoStore.removeListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_ERROR,
        this.renderError
      );
    },

    /* Event handlers */
    handleImageEvent: function (event) {
      var element = this.getElement();
      if (!element) {
        return;
      }

      var props = this.props;
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

      if (dataset.direction === 'left' || keyCode === keyCodes.leftArrow ||
        dataset.direction === 'right' || keyCode === keyCodes.rightArrow) {
        // Hide error message and display image
        element.querySelector('.error-message').classList.remove('hidden');
        element.querySelector('.display-image').classList.add('hidden');
        var titleElm = element.querySelector('.title');
        if (titleElm) {
          titleElm.classList.add('hidden');
        }
        // Show loader
        element.querySelector('.loader-wrapper').classList.remove('hidden');
      }

      // Handle close viewer
      if (dataset.close === 'true' || keyCode === keyCodes.esc) {
        // Remove class to animate. Call close when animation is done
        element.classList.remove('show');
        setTimeout(function () {
          onClose(event);
        }, 200);
      }
    },

    /* View functions */
    renderImage: function (id) {
      var child = this.props.child;
      if (photoID !== id) {
        return;
      }
      var photo = PhotoStore.getLargePhoto(photoID);
      if (!photo || !photo.src) {
        return;
      }


      var element = this.getElement();
      element.querySelector('.loader-wrapper').classList.add('hidden');
      var imageElm = element.querySelector('.display-image');
      imageElm.classList.remove('hidden');
      var titleElm = element.querySelector('.title');
      if (titleElm) {
        titleElm.classList.remove('hidden');
      }

      image.render(imageElm, {
        src: photo.src,
        // Transfer other information
        title: child.title,
        link: child.link
      });
    },

    renderError: function (id, message) {
      if (photoID !== id) {
        return;
      }
      var element = this.getElement();
      element.querySelector('.loader-wrapper').classList.add('hidden');
      var titleElm = element.querySelector('.title');
      if (titleElm) {
        titleElm.classList.add('hidden');
      }
      var errorElement = element.querySelector('.error-message');
      errorElement.classList.remove('hidden');
      errorElement.innerHTML = message || 'Image request error';
    },

    getFooter: function () {
      return (
        '<div class="arrow-container">' +
          '<span data-direction="left" class="arrow left"></span>' +
          '<span data-direction="right" class="arrow right"></span>' +
        '</div>'
      );
    },

    getView: function () {
      var props = this.props;
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
            this.getFooter() +
          '</div>' +
        '</div>'
      );
    }
  }, Component);
}

module.exports = ImageViewer;
