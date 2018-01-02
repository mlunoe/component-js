var assign = require('../../utils/ObjectUtil').assign;
var Component = require('../../components/Component');
var createElement = require('../../utils/ComponentUtil').createElement;
var EventTypes = require('../../constants/EventTypes');
var ImageViewer = require('../../components/ImageViewer');
var PhotoStore = require('../../stores/PhotoStore');
var Thumbnail = require('../../components/Thumbnail');

function ImageGrid() {
  var imageViewer = new ImageViewer();

  var imageGrid = assign(Object.create(new Component()), {
    name: 'imageGrid',
    initialState: function () {
      return {
        photos: PhotoStore.getPhotos(),
        selectedImageIndex: null,
        shouldAnimateIn: true
      };
    },

    /* Event handlers */
    handlePhotosUpdate: function () {
      imageGrid.setState({ photos: PhotoStore.getPhotos() });
    },

    handleImageClick: function (event) {
      var node = event.target;
      // Walk up dom tree to first element from event.target with `data-index`,
      // stop if we reach the image grid node
      while (node.getAttribute('data-index') == null && node !== this) {
        node = node.parentNode;
      }

      var index = parseInt(node.getAttribute('data-index'), 10);
      // eslint-disable-next-line no-restricted-globals
      if (!isNaN(index)) {
        imageGrid.setState({
          selectedImageIndex: index,
          shouldAnimateIn: true
        });
      }
    },

    handleImageViewerClose: function () {
      imageGrid.setState({
        selectedImageIndex: null,
        shouldAnimateIn: true
      });
    },

    handleImageViewerLeftClick: function () {
      var photos = PhotoStore.getPhotos();
      var selectedImageIndex = imageGrid.state.selectedImageIndex;
      // Should do nothing if there are no photos
      if (!photos) {
        return;
      }

      if (--selectedImageIndex < 0) {
        selectedImageIndex = photos.length - 1;
      }

      imageGrid.setState({
        photos: photos,
        selectedImageIndex: selectedImageIndex,
        shouldAnimateIn: false
      });
    },

    handleImageViewerRightClick: function () {
      var photos = PhotoStore.getPhotos();
      var selectedImageIndex = imageGrid.state.selectedImageIndex;
      // Should do nothing if there are no photos
      if (!photos) {
        return;
      }

      // Add before the modulus operator and use modulus as a circular buffer
      selectedImageIndex = ++selectedImageIndex % photos.length;

      imageGrid.setState({
        photos: photos,
        selectedImageIndex: selectedImageIndex,
        shouldAnimateIn: false
      });
    },

    /* Lifecycle methods */
    componentDidMount: function () {
      // Re-render image grid when new photos are received
      PhotoStore.addListener(
        EventTypes.PHOTO_STORE_PHOTOS_CHANGE,
        this.handlePhotosUpdate
      );

      this.componentDidUpdate.apply(this, arguments);
    },

    componentWillUpdate: function (element) {
      // Clean up element listeners
      if (element) {
        var imageGridElm = element.querySelector('.grid');
        if (imageGridElm) {
          imageGridElm.removeEventListener('click', this.handleImageClick, false);
        }
      }
    },

    componentDidUpdate: function (element) {
      if (element) {
        var imageGridElm = element.querySelector('.grid');
        if (imageGridElm) {
          // Re-attach element click listener to grid, to only listen
          // for clicks within its children, and not, e.g. image viewer
          imageGridElm.addEventListener('click', this.handleImageClick, false);
        }
      }
    },

    componentWillUnmount: function (element) {
      // Clean up element listeners
      var imageGridElm = element.querySelector('.grid');
      imageGridElm.removeEventListener('click', this.handleImageClick, false);
      PhotoStore.removeListener(
        EventTypes.PHOTO_STORE_PHOTOS_CHANGE,
        this.handlePhotosUpdate
      );
    },

    /* View functions */
    render: function () {
      var noImagesMessage = null;
      var photos = this.state.photos || [];

      if (!photos.length) {
        noImagesMessage = createElement(
          'p',
          { class: 'text-align-center primary' },
          [createElement('Sorry, no images was found from that search. Please try another search.')]
        );
      }

      var tumbnails = photos.map(function (props, index) {
        return createElement(new Thumbnail(), assign({}, props, {
          className: 'grid-item',
          index: index
        }));
      });

      return (
        createElement('div', { class: 'image-grid' }, [
          noImagesMessage,
          createElement('div', { class: 'grid grid--1of4' }, tumbnails),
          createElement(imageViewer, {
            backdropClose: true,
            child: photos[this.state.selectedImageIndex],
            onLeftClick: this.handleImageViewerLeftClick,
            onRightClick: this.handleImageViewerRightClick,
            onClose: this.handleImageViewerClose,
            // photos: photos,
            shouldAnimateIn: this.state.shouldAnimateIn
          })
        ])
      );
    }
  });

  return imageGrid;
}

module.exports = ImageGrid;
