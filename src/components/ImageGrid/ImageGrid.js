var Component = require('../../components/Component');
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
  function handleImageClick(imageGridElm, props, event) {
    var node = event.target;
    // Walk up dom tree to first element from event.target with `data-index`,
    // stop if we reach the image grid node
    while (node.getAttribute('data-index') == null && node !== imageGridElm) {
      node = node.parentNode;
    }
    var index = parseInt(node.getAttribute('data-index'), 10);
    if (!isNaN(index)) {
      shouldAnimateIn = true;
      selectedImageIndex = index;
      renderSelectedImage(imageGridElm.nextSibling, props);
    }
  }

  function handleImageViewerClose(selectedImageElm, props) {
    shouldAnimateIn = true;
    selectedImageIndex = undefined;
    renderSelectedImage(selectedImageElm, props);
  }

  function handleImageViewerLeftClick(selectedImageElm, props, event) {
    var photos = PhotoStore.getPhotos();
    // Should do nothing if there are no photos
    if (!photos) {
      return;
    }

    if (--selectedImageIndex < 0) {
      selectedImageIndex = photos.length - 1;
    }

    shouldAnimateIn = false;
    renderSelectedImage(selectedImageElm, props);
  }

  function handleImageViewerRightClick(selectedImageElm, props, event) {
    var photos = PhotoStore.getPhotos();
    // Should do nothing if there are no photos
    if (!photos) {
      return;
    }

    // Add before the modulus operator and use modulus as a circular buffer
    selectedImageIndex = ++selectedImageIndex % photos.length;
    shouldAnimateIn = false;
    renderSelectedImage(selectedImageElm, props);
  }

  /* View functions */
  function renderPhotoGrid(imageGridElm, props) {
    PhotoStore.getPhotos().forEach(function (props, index) {
      var newProps = ObjectUtil.assign({}, props);
      newProps.index = index;
      newProps.className = 'grid-item';
      new Thumbnail().render(imageGridElm, newProps);
    });
  }

  function renderSelectedImage(selectedImageElm, props) {
    var photos = PhotoStore.getPhotos();
    if (!photos.length) {
      return;
    }

    var selectedChild = photos[selectedImageIndex];
    if (!selectedChild) {
      imageViewer.unmount(props);

      return;
    }
    imageViewer.render(selectedImageElm, {
      backdropClose: true,
      onLeftClick: this.handleImageViewerLeftClick,
      onRightClick: this.handleImageViewerRightClick,
      onClose: this.handleImageViewerClose,
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
      imageGridElm.removeEventListener('click', this.handleImageClick, false);
    },

    componentDidUpdate: function (element, props) {
      var selectedImageElm = element.querySelector('.selected-image');
      var imageGridElm = element.querySelector('.grid');

      // Pass down necessary props to handler
      this.handleImageClick = handleImageClick.bind(this, imageGridElm, props);
      this.handleImageViewerLeftClick = handleImageViewerLeftClick.bind(
        this,
        selectedImageElm,
        props
      );
      this.handleImageViewerRightClick = handleImageViewerRightClick.bind(
        this,
        selectedImageElm,
        props
      );
      this.handleImageViewerClose = handleImageViewerClose.bind(
        this,
        selectedImageElm,
        props
      );

      // Re-attach element click listener to grid, to only listen
      // for clicks within its children, and not, e.g. image viewer
      imageGridElm.addEventListener('click', this.handleImageClick, false);
      renderPhotoGrid(imageGridElm, props);
    },

    componentWillUnmount: function (element) {
      // Clean up element listeners
      var imageGridElm = element.querySelector('.grid');
      imageGridElm.removeEventListener('click', this.handleImageClick, false);
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
