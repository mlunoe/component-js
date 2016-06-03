var Component = require('./components/Component/Component');
var ImageViewer = require('./components/ImageViewer/ImageViewer');
var Thumbnail = require('./components/Thumbnail/Thumbnail');
var ObjectUtil = require('./utils/ObjectUtil');

function App() {
  var app = Object.create(new Component());
  var imageViewer = new ImageViewer();
  var selectedImage;

  var handleImageClick = function (event) {
    var index = parseInt(event.target.dataset.index, 10);
    if (!isNaN(index)) {
      selectedImage = index;
      app.notifySubscribers();
    }
  };

  var handleImageViewerModalClose = function () {
    selectedImage = undefined;
    app.notifySubscribers();
  };

  var handleImageViewerModalOpen = function (imageIndex) {
    selectedImage = imageIndex;
  };

  var handleImageViewerLeftClick = function (images) {
    if (--selectedImage < 0) {
      selectedImage = images.length - 1;
    }
    app.notifySubscribers();
  };

  var handleImageViewerRightClick = function (images) {
    // Add before the modulus operator and use modulus as a circular buffer
    selectedImage = ++selectedImage % images.length;
    app.notifySubscribers();
  };

  return ObjectUtil.assign(app, {
    componentDidMount: function (element, props) {
      element.onclick = handleImageClick;
      var children = props.children;

      this.renderChildren(
        element.querySelector('.image-grid'),
        children
      );
      this.renderSelectedImage(
        element.querySelector('.selected-image'),
        children
      );
    },

    renderChildren: function (element, children) {
      if (!element || !children) {
        return;
      }

      children.forEach(function (props, index) {
        var thumbnail = new Thumbnail();
        props.index = index;
        thumbnail.render(element, props);
      });
    },

    renderSelectedImage: function (element, children) {
      if (!element || !children) {
        return;
      }

      var selectedChild = children[selectedImage];

      if (selectedChild === undefined) {
        return;
      }

      var props = {
        images: children,
        onLeftClick: handleImageViewerLeftClick.bind(this, children),
        onRightClick: handleImageViewerRightClick.bind(this, children),
        onClose: handleImageViewerModalClose,
        child: selectedChild
      };
      return imageViewer.render(element, props);
    },

    getView: function (props) {
      props || (props = {});
      var children = props.children || [];

      return (
        '<div class="app container-fluid">' +
          '<div class="row image-grid"></div>' +
          '<div class="selected-image"></div>' +
        '</div>'
      );
    }
  });
}

module.exports = App;
