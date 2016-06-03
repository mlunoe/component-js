var Component = require('../Component/Component');
var Image = require('../Image/Image');
var KeyboardUtil = require('../../utils/KeyboardUtil');
var ObjectUtil = require('../../utils/ObjectUtil');

function ImageViewer() {
  var listenerAttached = false;
  var selectedImage = null;
  var image = new Image();
  var imageViewer = Object.create(new Component());

  var handleImageChange = function (props, event) {
    var images = props.images;
    var onLeftClick = props.onLeftClick;
    var onRightClick = props.onRightClick;
    // Should do nothing if the key event was already consumed,
    // or there is only one or no images
    if (event.defaultPrevented || !images || images.length < 2) {
      return;
    }

    var direction = event.target.dataset.direction;

    if (event.keyCode === KeyboardUtil.keyCodes.leftArrow) {
      direction = 'left';
    }

    if (event.keyCode === KeyboardUtil.keyCodes.rightArrow) {
      direction = 'right';
    }

    if (direction === 'left' && typeof onLeftClick === 'function') {
      onLeftClick();
    }

    if (direction === 'right' && typeof onRightClick === 'function') {
      onRightClick();
    }

    // Consume the event for suppressing "double action".
    event.preventDefault();

    // this.handleLoadingImageChange(true);
  };

  var attachDetachKeyPressListener = function (props) {
    var handler = handleImageChange.bind(imageViewer, props);
    var images = props.images;
    // Closes
    if (!(images || images.length) && listenerAttached) {
      global.window.removeEventListener('keydown', handler, true);
    }

    // Opens
    if (images && images.length && !listenerAttached) {
      global.window.addEventListener('keydown', handler, true);
    }
  };

  return ObjectUtil.assign(imageViewer, {
    componentDidMount: function (element, props) {
      element.onclick = handleImageChange.bind(this, props);

      this.renderDisplayImage(
        element.querySelector('.display-image'),
        props.child
      );

      if (typeof props.onClose === 'function') {
        element.querySelector('.close-button').onclick = props.onClose;
      }
    },

    renderDisplayImage: function (element, props) {
      if (!element) {
        return;
      }

      image.render(element, props);
    },

    getFooter: function () {
      return (
        '<div>' +
          '<div class="close-button"></div>' +
          '<div data-direction="left" class="arrow-container"></div>' +
          '<div data-direction="right" class="arrow-container forward"></div>' +
        '</div>'
      );
    },

    getView: function (props) {
      attachDetachKeyPressListener(props);

      var images = props.images;
      if (!images || !images.length) {
        return '';
      }

      return (
        '<div>' +
          '<div class="display-image"></div>' +
          this.getFooter() +
        '</div>'
      );
    }
  });
}

module.exports = ImageViewer;
