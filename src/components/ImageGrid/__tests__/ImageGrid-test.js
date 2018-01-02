'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var clock = sinon.useFakeTimers();

var createElement = require('../../../utils/ComponentUtil').createElement;
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
    div = global.document.createElement('div');

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

    imageGrid.mount(div);
  });

  afterEach(function () {
    PhotoStore.getPhotos = originalGetPhotos;
    PhotoStore.getLargePhoto = originalGetLargePhoto;
    imageGrid.unmount();
  });


  describe('#render()', function () {

    it('renders the grid element', function () {
      var imageGridEl = div.querySelector('.grid');
      expect(imageGridEl.className).to.equal('grid grid--1of4');
    });

    it('renders images inside the grid element', function () {
      // Test number of items
      var gridItems = div.querySelectorAll('.grid-item');
      expect(gridItems.length).to.equal(3);
      // Test content
      var images = div.querySelectorAll('.fill-image');
      expect(images[0].getAttribute('data-src')).to.equal('foo');
      expect(images[1].getAttribute('data-src')).to.equal('bar');
    });

    it('should show empty photo notification', function () {
      PhotoStore.getPhotos = function () {
        return [];
      };
      imageGrid.mount(div);
      PhotoStore.emit(EventTypes.PHOTO_STORE_PHOTOS_CHANGE)
      var element = div.querySelector('.text-align-center.primary');
      expect(element.innerHTML).to.equal(
        'Sorry, no images was found from that search. ' +
        'Please try another search.'
      );
    });

  });

  describe('#renderSelectedImage()', function () {

    it('should show selected image', function () {
      // Trigger image click
      var firstGridItem = div.querySelector('.grid-item');
      firstGridItem.click();
      var imageViewer = div.querySelector('.image-viewer');
      expect(imageViewer).to.not.equal(null);
      expect(imageViewer.tagName).to.equal('DIV');

      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'foo');

      var selectedImage = div.querySelector('img');
      expect(selectedImage.getAttribute('src')).to.equal('/foo-large');
    });

    it('should show selected image from click on children', function () {
      // Trigger image click
      var firstFillImage = div.querySelector('.fill-image');
      firstFillImage.click();
      var imageViewer = div.querySelector('.image-viewer');
      expect(imageViewer.tagName).to.equal('DIV');

      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'foo');

      var selectedImage = div.querySelector('img');
      expect(selectedImage.getAttribute('src')).to.equal('/foo-large');
    });

    it('stop iterating when hitting image grid', function () {
      // Trigger image click
      var imageGridElm = div.querySelector('.grid');
      imageGridElm.click();
      var imageViewer = div.querySelector('.image-viewer');
      expect(imageViewer).to.equal(null);
    });

    it('should show other selected image after re-opening', function () {
      // Trigger image click
      var secondGridItem = div.querySelector('.grid-item');
      secondGridItem.click();

      // Close image viewer
      var closeButton = div.querySelector('.close-button');
      closeButton.click();
      // Advance clock 200ms because of animation wait on close
      clock.tick(200);
      // Trigger another image click
      var thirdGridItem = div.querySelectorAll('.grid-item')[2];
      thirdGridItem.click();

      // Emit store event to fetch new selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'baz');

      var selectedImage = div.querySelector('img');
      expect(selectedImage.getAttribute('src')).to.equal('/baz-large');
    });

    it('should show error message', function () {
      // Trigger image click
      var firstGridItem = div.querySelector('.grid-item');
      firstGridItem.click();

      // Emit store event to display error message
      PhotoStore.emit(
        EventTypes.PHOTO_STORE_SINGLE_PHOTO_ERROR,
        'foo',
        'Some error'
      );
      var errorMessage = div.querySelector('.error-message');
      expect(errorMessage.innerHTML).to.equal('Some error');
    });

  });

  describe('#handleImageViewerClose()', function () {

    it('should close the image viewer', function () {
      // Trigger image click
      var firstGridItem = div.querySelector('.grid-item');
      firstGridItem.click();

      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'foo');

      // Close image viewer
      var closeButton = div.querySelector('.close-button');
      closeButton.click();
      // Advance clock 200ms because of animation wait on close
      clock.tick(200);
      var selectedImage = div.querySelector('img');
      expect(selectedImage).to.equal(null);
    });

  });


  describe('#handleImageViewerLeftClick()', function () {

    it('decrements selected image index', function () {
      // Trigger image click
      var secondGridItem = div.querySelectorAll('.grid-item')[1];
      secondGridItem.click();
      // Trigger left click
      var leftArrow = div.querySelector('.arrow.left');
      leftArrow.click(); // foo

      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'foo');

      var selectedImage = div.querySelector('img');
      expect(selectedImage.getAttribute('src')).to.equal('/foo-large');
    });

    it('overflows the index to point to end when < 0', function () {
      // Trigger image click
      var secondGridItem = div.querySelectorAll('.grid-item')[1];
      secondGridItem.click();
      // Trigger left click
      var leftArrow = div.querySelector('.arrow.left');
      leftArrow.click(); // foo
      leftArrow = div.querySelector('.arrow.left');
      leftArrow.click(); // baz

      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'baz');

      var selectedImage = div.querySelector('img');
      expect(selectedImage.getAttribute('src')).to.equal('/baz-large');
    });

  });

  describe('#handleImageViewerRightClick()', function () {

    it('increments selected image index', function () {
      // Trigger image click
      var secondGridItem = div.querySelectorAll('.grid-item')[1];
      secondGridItem.click();
      // Trigger right click
      var rightArrow = div.querySelector('.arrow.right');
      rightArrow.click(); // baz

      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'baz');

      var selectedImage = div.querySelector('img');
      expect(selectedImage.getAttribute('src')).to.equal('/baz-large');
    });

    it('overflows the index to point to start when > photo count', function () {
      // Trigger image click
      var secondGridItem = div.querySelectorAll('.grid-item')[1];
      secondGridItem.click();
      // Trigger right click
      var rightArrow = div.querySelector('.arrow.right');
      rightArrow.click(); // baz
      rightArrow = div.querySelector('.arrow.right');
      rightArrow.click(); // foo

      // Emit store event to fetch selected image
      PhotoStore.emit(EventTypes.PHOTO_STORE_SINGLE_PHOTO_CHANGE, 'foo');

      var selectedImage = div.querySelector('img');
      expect(selectedImage.getAttribute('src')).to.equal('/foo-large');
    });

  });

});
