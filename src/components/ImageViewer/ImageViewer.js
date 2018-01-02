var Component = require('../Component');
var createElement = require('../../utils/ComponentUtil').createElement;
var EventTypes = require('../../constants/EventTypes');
var Image = require('../Image');
var keyCodes = require('../../utils/KeyboardUtil').keyCodes;
var ObjectUtil = require('../../utils/ObjectUtil');
var PhotoStore = require('../../stores/PhotoStore');

var getPhotoID = function (link) {
  var segments = link.split('/');
  var id = segments.pop();
  while (!id && segments.length) {
    id = segments.pop();
  }

  return id;
};

function ImageViewer() {
  var image = new Image();
  var photoID;

  var imageViewer = ObjectUtil.assign(Object.create(new Component()), {
    name: 'imageViewer',
    /* Event handlers */
    handleImageEvent: function (event) {
      var props = imageViewer.props;
      var keyCode = event.keyCode;
      var direction = event.target.getAttribute('data-direction');
      var close = event.target.getAttribute('data-close');

      // Handle change image left
      if ((typeof props.onLeftClick === 'function' && direction === 'left') ||
        keyCode === keyCodes.leftArrow) {
        props.onLeftClick(event);
      }

      // Handle change image right
      if ((typeof props.onRightClick === 'function' && direction === 'right') ||
        keyCode === keyCodes.rightArrow) {
        props.onRightClick(event);
      }

      if (direction === 'left' || keyCode === keyCodes.leftArrow ||
        direction === 'right' || keyCode === keyCodes.rightArrow) {
        // Hide error message and display image and show loader
        photoID = null;
        imageViewer.setState({ errorMessage: null, photo: null });
      }

      // Handle close viewer
      if (close === 'true' || keyCode === keyCodes.esc) {
        var element = this;
        if (this === global) {
          element = global.document.querySelector('.image-viewer-backdrop');
        }
        // Remove class to animate. Call close when animation is done
        if (element) {
          element.classList.remove('show');
        }

        setTimeout(function () {
          props.onClose(event);
        }, 200);
      }
    },

    handleUpdatePhotoID: function (id) {
      if (photoID !== id) {
        return;
      }

      imageViewer.setState({
        photo: PhotoStore.getLargePhoto(id)
      });
    },

    handleUpdateError: function (id, message) {
      if (photoID !== id) {
        return;
      }

      imageViewer.setState({ errorMessage: message || 'Image request error' });
    },

    /* Lifecycle methods */
    componentDidMount: function () {
      // Set global listeners
      global.addEventListener('keydown', this.handleImageEvent, false);
      PhotoStore.addListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE,
        this.handleUpdatePhotoID
      );
      PhotoStore.addListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_ERROR,
        this.handleUpdateError
      );
      this.componentDidUpdate.apply(this, arguments);
    },

    componentWillUpdate: function (element) {
      // Clean up element listeners
      if (element) {
        element.removeEventListener('click', this.handleImageEvent, false);
      }
    },

    componentDidUpdate: function (element, props) {
      // Add show class in next render cycle to animate in
      if (props.shouldAnimateIn) {
        if (element) {
          setTimeout(function () {
            element.classList.add('show');
          }, 100);
        }
      }

      // Re-attach element listeners
      if (element) {
        element.addEventListener('click', this.handleImageEvent, false);
      }

      var link = '';
      if (props.child && props.child.link) {
        link = props.child.link;
      }
      // Fetch and store large photo
      var newPhotoID = getPhotoID(link);
      if (photoID !== newPhotoID) {
        photoID = newPhotoID;
        PhotoStore.fetchLargePhoto(photoID);
      }
    },

    componentWillUnmount: function (element) {
      // Clean up global listeners
      global.removeEventListener('keydown', this.handleImageEvent, false);
      // Clean up element listeners
      if (element) {
        element.removeEventListener('click', this.handleImageEvent, false);
      }
      PhotoStore.removeListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE,
        this.handleUpdatePhotoID
      );
      PhotoStore.removeListener(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_ERROR,
        this.handleUpdateError
      );
    },

    render: function (props) {
      var child = props.child;
      var backdropClose = props.backdropClose;
      var shouldAnimateIn = props.shouldAnimateIn;
      var errorMessage = this.state.errorMessage;
      var photo = this.state.photo;

      if (child == null) {
        return null;
      }

      var dataClose = '';
      if (backdropClose) {
        dataClose = 'true';
      }

      var imageViewerBackdropClasses = 'image-viewer-backdrop';
      if (!shouldAnimateIn) {
        imageViewerBackdropClasses += ' show';
      }

      var displayImage = null;
      if (photo && photo.src) {
        displayImage = createElement(image, {
          class: 'display-image',
          src: photo.src,
          // Transfer other information
          title: child.title,
          link: child.src
        });
      }

      var errorMessageComp = null;
      if (typeof errorMessage === 'string') {
        errorMessageComp = createElement('p', { class: 'error-message primary' }, [
          createElement(errorMessage)
        ]);
      }

      var loaderWrapperClasses = 'loader-wrapper';
      if ((photo && photo.src) || errorMessage) {
        loaderWrapperClasses += ' hidden';
      }

      var title = null;
      if (child.title) {
        title = (
          createElement('p', { class: 'title text-white text-align-center' }, [
            createElement(child.title)
          ])
        );
      }

      return (
        createElement('div', { class: imageViewerBackdropClasses, dataClose: dataClose }, [
          createElement('div', { class: 'image-viewer' }, [
            createElement('span', { dataClose: 'true', class: 'close-button' }),
            createElement('div', { class: loaderWrapperClasses }, [
              createElement('div'),
              createElement('div'),
              createElement('div')
            ]),
            errorMessageComp,
            displayImage,
            title,
            createElement('div', { class: 'arrow-container' }, [
              createElement('span', { class: 'arrow left', dataDirection: 'left' }),
              createElement('span', { class: 'arrow right', dataDirection: 'right' })
            ])
          ])
        ])
      );
    }
  });

  return imageViewer;
}

module.exports = ImageViewer;
