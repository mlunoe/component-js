'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var ObjectUtil = require('../../../utils/ObjectUtil');
var Component = require('../Component');

describe('Component', function () {
  var div;
  var component;

  beforeEach(function () {
    component = ObjectUtil.inherits({
      componentWillMount: sinon.spy(),
      componentDidMount: sinon.spy(),
      componentWillUpdate: sinon.spy(),
      componentDidUpdate: sinon.spy(),
      componentWillUnmount: sinon.spy(),
      getView: function () {
        return '<div class="component">My Component</div>'
      }
    }, Component);
    div = document.createElement('div')
    component.render(div);
  });

  afterEach(function () {
    component.unmount();
  });

  describe('#render()', function () {

    it('renders correctly', function () {
      var elements = div.querySelectorAll('.component');
      expect(elements[0].innerHTML).to.equal('My Component');
    });

    it('calls replaceChild on consecutive renders', function () {
      div.replaceChild = sinon.spy();
      component.render(div);
      component.render(div);
      expect(div.replaceChild.calledOnce).to.equal(true);
    });

    it('shouldn\'t call replaceChild when rendered to new parent', function () {
      component.render(div);
      div.replaceChild = sinon.spy();
      component.render(document.createElement('div'));
      expect(div.replaceChild.called).to.equal(false);
    });

    it('calls appendChild on first render', function () {
      div.appendChild = sinon.spy();
      component = ObjectUtil.inherits({
        getView: function () {
          return '<div class="component"></div>'
        }
      }, Component);
      component.render(div);
      expect(div.appendChild.calledOnce).to.equal(true);
    });

    it('calls appendChild after unmount', function () {
      component.render(div);
      div.appendChild = sinon.spy();
      component.unmount();
      component.render(div);
      expect(div.appendChild.calledOnce).to.equal(true);
    });

    it('shouldn\'t call appendChild on consecutive renders', function () {
      div.appendChild = sinon.spy();
      component.render(div);
      expect(div.appendChild.called).to.equal(false);
    });

    it('calls componentWillMount if implemented', function () {
      expect(component.componentWillMount.calledOnce).to.equal(true);
    });

    it('calls componentDidMount if implemented', function () {
      expect(component.componentDidMount.calledOnce).to.equal(true);
    });

    it('makes props available for componentDidMount', function () {
      component = ObjectUtil.inherits({
        componentDidMount: sinon.spy(),
        componentDidUpdate: sinon.spy(),
        componentWillUnmount: sinon.spy(),
        getView: function () {
          return '<div class="component">My Component</div>'
        }
      }, Component);
      component.render(div, {one: 'one', two: 'two', three: 'three'});
      expect(component.props)
        .to.deep.equal({one: 'one', two: 'two', three: 'three'});
    });

    it('calls componentWillUpdate if implemented', function () {
      component.render(div);
      expect(component.componentDidUpdate.calledOnce).to.equal(true);
    });

    it('calls componentDidUpdate if implemented', function () {
      component.render(div);
      expect(component.componentDidUpdate.calledOnce).to.equal(true);
    });

    it('makes props available for componentDidUpdate', function () {
      component.render(div, {one: 'one', two: 'two', three: 'three'});
      expect(component.props)
        .to.deep.equal({one: 'one', two: 'two', three: 'three'});
    });

  });

  describe('#unmount()', function () {

    it('removes child correctly', function () {
      component.unmount();
      var elements = div.querySelectorAll('.component');
      expect(elements.length).to.equal(0);
    });

    it('calls componentWillUnmount if implemented', function () {
      component.unmount();
      expect(component.componentWillUnmount.calledOnce).to.equal(true);
    });

  });

});
