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
      // Ensure context is this in handlers
      this.handleImageEvent = this.handleImageEvent.bind(this);
      this.renderImage = this.renderImage.bind(this);
      this.renderError = this.renderError.bind(this);

      // Set event handlers
      this.getElement().onclick = this.handleImageEvent;
      // Viewer is opening
      if (this.props.child && !keyPressListenerAttached) {
        keyPressListenerAttached = true;
        global.window.addEventListener('keydown', this.handleImageEvent, true);
      }

      // Add show class in next render cycle to animate in
      if (this.props.shouldAnimateIn) {
        setTimeout(function () {
          this.getElement().classList.add('show');
        }.bind(this), 100);
      }

      // TODO: Handle start loading
      this.componentDidUpdate();
    },

    componentDidUpdate: function () {
      photoID = getPhotoID(this.props.child.link);
      this.getElement().onclick = this.handleImageEvent;
      // Clean up listeners
      PhotoStore.removeListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE,
        this.renderImage
      );
      PhotoStore.removeListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_ERROR,
        this.renderError
      );
      // Re-attach listeners
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
      var keyCodes = KeyboardUtil.keyCodes;
      var keyCode = event.keyCode;
      var dataset = event.target.dataset;
      var onLeftClick = this.props.onLeftClick;
      var onRightClick = this.props.onRightClick;
      var onClose = this.props.onClose;

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
        this.getElement().classList.remove('show');
        setTimeout(function () {
          onClose(event);
        }, 200);
      }
    },

    /* View functions */
    renderImage: function (id) {
      if (photoID !== id) {
        return;
      }

      image.render(this.getElement().querySelector('.display-image'), {
        src: PhotoStore.getLargePhoto(photoID).src,
        // Transfer other information
        title: this.props.child.title,
        link: this.props.child.link
      });
    },

    renderError: function (id) {
      if (photoID !== id) {
        return;
      }

      // TODO: Handle error
      console.log('Image request error');
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
      var dataClose = '';
      if (this.props.backdropClose) {
        dataClose = 'data-close="true"';
      }

      var imageViewerBackdropClasses = 'image-viewer-backdrop';
      if (!this.props.shouldAnimateIn) {
        imageViewerBackdropClasses += ' show';
      }

      var child = this.props.child;
      var title = '';
      if (child) {
        title = (
          '<p class="text-white text-align-center">' +
            child.title +
          '<p/>'
        );
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
