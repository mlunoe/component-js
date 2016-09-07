'use strict';

var expect = require('chai').expect;

var PhotoStore = require('../../../stores/PhotoStore');
var ImageGrid = require('../ImageGrid');

describe('ImageGrid', function () {
  var div;
  var imageGrid;
  var originalGetPhotos = PhotoStore.getPhotos;

  beforeEach(function () {
    imageGrid = new ImageGrid();

    PhotoStore.getPhotos = function () {
      return [];
    };
    div = document.createElement('div')
    imageGrid.render(div);
  });

  afterEach(function () {
    PhotoStore.getPhotos = originalGetPhotos;
    imageGrid.unmount();
  });


  describe('#render()', function () {

    it('renders correctly', function () {
      var elements = div.getElementsByClassName('grid');
      expect(elements[0].className).to.equal('grid grid--1of4');
    });

    it('should show empty photo notification', function () {
      var elements = div.getElementsByClassName('text-align-center primary');
      expect(elements[0].innerHTML).to.equal('Sorry, no images was found from that search. Please try another search.');
    });

  });

  // TODO: Add tests for the following essential functions
  describe('#renderSelectedImage()', function () {

  });


  describe('#handleImageViewerLeftClick()', function () {

  });

  describe('#handleImageViewerRightClick()', function () {
  });

});
