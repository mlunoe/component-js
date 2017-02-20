'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var EventTypes = require('../../../constants/EventTypes');
var ImageGrid = require('../ImageGrid');
var PhotoStore = require('../../../stores/PhotoStore');

describe('ImageGrid', function () {
  var div;
  var imageGrid;
  var originalGetPhotos = PhotoStore.getPhotos;
  var originalGetLargePhoto = PhotoStore.getLargePhoto;

  beforeEach(function () {
    imageGrid = new ImageGrid();
    div = document.createElement('div');

    PhotoStore.getPhotos = function () {
      return [
        {
          link: '/foo',
          src: 'foo',
          title: 'Foo'
        },
        {
          link: '/bar',
          src: 'bar',
          title: 'Bar'
        },
        {
          link: '/baz',
          src: 'baz',
          title: 'Baz'
        }
      ];
    };

    PhotoStore.getLargePhoto = function (id) {
      return {
        src: '/' + id + '-large'
      };
    };

    imageGrid.render(div);
  });

  afterEach(function () {
    PhotoStore.getPhotos = originalGetPhotos;
    PhotoStore.getLargePhoto = originalGetLargePhoto;
    imageGrid.unmount();
  });


  describe('#render()', function () {

    it('renders the grid element', function () {
      var elements = div.getElementsByClassName('grid');
      expect(elements[0].className).to.equal('grid grid--1of4');
    });

    it('renders images inside the grid element', function () {
      // Test number of items
      var gridItems = div.getElementsByClassName('grid-item');
      expect(gridItems.length).to.equal(3);
      // Test content
      var images = div.getElementsByClassName('fill-image');
      expect(images[0].getAttribute('data-src')).to.equal('foo');
      expect(images[1].getAttribute('data-src')).to.equal('bar');
    });

    it('should show empty photo notification', function () {
      PhotoStore.getPhotos = function () {
        return [];
      };
      imageGrid.render(div);
      var elements = div.getElementsByClassName('text-align-center primary');
      expect(elements[0].innerHTML).to.equal('Sorry, no images was found from that search. Please try another search.');
    });

  });

  describe('#renderSelectedImage()', function () {

    it('should show selected image', function () {
      // Trigger image click
      imageGrid.handleImageClick({target: {dataset: {index: 0}}});
      var imageViewer = div.getElementsByClassName('image-viewer')[0];
      expect(typeof imageViewer).to.not.equal('undefined');

      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'foo');
      var selectedImage = imageViewer.getElementsByTagName('img')[0];
      expect(selectedImage.getAttribute('src')).to.equal('/foo-large');
    });

    it('should show selected image from click on children', function () {
      // Trigger image click
      var firstFillImage = div.querySelector('.fill-image');
      imageGrid.handleImageClick({target: firstFillImage});
      var imageViewer = div.querySelector('.image-viewer');
      expect(imageViewer).to.not.equal(null);

      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'foo');
      var selectedImage = imageViewer.querySelector('img');
      expect(selectedImage.getAttribute('src')).to.equal('/foo-large');
    });

    it('stop iterating when hitting image grid', function () {
      // Trigger image click
      var imageGridElm = div.querySelector('.grid');
      imageGrid.handleImageClick({target: imageGridElm});
      var imageViewer = div.querySelector('.image-viewer');
      expect(imageViewer).to.equal(null);
    });

    it('should show other selected image after re-opening', function () {
      // Trigger image click
      imageGrid.handleImageClick({target: {dataset: {index: 0}}});

      // Close image viewer
      imageGrid.handleImageViewerClose();

      // Trigger another image click
      imageGrid.handleImageClick({target: {dataset: {index: 2}}});
      // Emit store event to fetch new selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'baz');

      var selectedImage = div.getElementsByTagName('img')[0];
      expect(selectedImage.getAttribute('src')).to.equal('/baz-large');
    });

    it('should show error message', function () {
      // Trigger image click
      imageGrid.handleImageClick({target: {dataset: {index: 0}}});

      // Emit store event to display error message
      PhotoStore.emit(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_ERROR,
        'foo',
        'Some error'
      );
      var errorMessage = div.getElementsByClassName('error-message')[0];
      expect(errorMessage.innerHTML).to.equal('Some error');
    });

  });

  describe('#handleImageViewerClose()', function () {

    it('should close the image viewer', function () {
      // Trigger image click
      imageGrid.handleImageClick({target: {dataset: {index: 0}}});

      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'foo');
      imageGrid.handleImageViewerClose();
      var selectedImage = div.getElementsByTagName('img')[0];
      expect(typeof selectedImage).to.equal('undefined');
    });

  });


  describe('#handleImageViewerLeftClick()', function () {

    it('decrements selected image index', function () {
      // Trigger image click
      imageGrid.handleImageClick({target: {dataset: {index: 1}}});
      // Trigger left click
      imageGrid.handleImageViewerLeftClick({}); // foo
      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'foo');

      var selectedImage = div.getElementsByTagName('img')[0];
      expect(selectedImage.getAttribute('src')).to.equal('/foo-large');
    });

    it('overflows the index to point to end when < 0', function () {
      // Trigger image click
      imageGrid.handleImageClick({target: {dataset: {index: 1}}});
      // Trigger left click
      imageGrid.handleImageViewerLeftClick({}); // foo
      imageGrid.handleImageViewerLeftClick({}); // baz
      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'baz');

      var selectedImage = div.getElementsByTagName('img')[0];
      expect(selectedImage.getAttribute('src')).to.equal('/baz-large');
    });

    it('overflows the index even for multiple rounds', function () {
      // Trigger image click
      imageGrid.handleImageClick({target: {dataset: {index: 1}}});
      // Trigger left click
      imageGrid.handleImageViewerLeftClick({}); // foo
      imageGrid.handleImageViewerLeftClick({}); // baz
      imageGrid.handleImageViewerLeftClick({}); // bar
      imageGrid.handleImageViewerLeftClick({}); // foo
      imageGrid.handleImageViewerLeftClick({}); // baz
      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'baz');

      var selectedImage = div.getElementsByTagName('img')[0];
      expect(selectedImage.getAttribute('src')).to.equal('/baz-large');
    });

  });

  describe('#handleImageViewerRightClick()', function () {

    it('increments selected image index', function () {
      // Trigger image click
      imageGrid.handleImageClick({target: {dataset: {index: 1}}});
      // Trigger left click
      imageGrid.handleImageViewerRightClick({}); // baz
      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'baz');

      var selectedImage = div.getElementsByTagName('img')[0];
      expect(selectedImage.getAttribute('src')).to.equal('/baz-large');
    });

    it('overflows the index to point to start when > # of photos', function () {
      // Trigger image click
      imageGrid.handleImageClick({target: {dataset: {index: 1}}});
      // Trigger left click
      imageGrid.handleImageViewerRightClick({}); // baz
      imageGrid.handleImageViewerRightClick({}); // foo
      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'foo');

      var selectedImage = div.getElementsByTagName('img')[0];
      expect(selectedImage.getAttribute('src')).to.equal('/foo-large');
    });

    it('overflows the index even for multiple rounds', function () {
      // Trigger image click
      imageGrid.handleImageClick({target: {dataset: {index: 1}}});
      // Trigger left click
      imageGrid.handleImageViewerRightClick({}); // baz
      imageGrid.handleImageViewerRightClick({}); // foo
      imageGrid.handleImageViewerRightClick({}); // bar
      imageGrid.handleImageViewerRightClick({}); // baz
      imageGrid.handleImageViewerRightClick({}); // foo
      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'foo');

      var selectedImage = div.getElementsByTagName('img')[0];
      expect(selectedImage.getAttribute('src')).to.equal('/foo-large');
    });
  });

});
