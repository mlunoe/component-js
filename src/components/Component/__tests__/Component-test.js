/* global describe */
/* global it */
/* global beforeEach */
/* global afterEach */

var expect = require('chai').expect;
var sinon = require('sinon');

var assign = require('../../../utils/ObjectUtil').assign;
var createElement = require('../../../utils/ComponentUtil').createElement;
var Component = require('../Component');

describe('Component', function () {
  var div;
  var component;

  beforeEach(function () {
    component = assign(Object.create(new Component()), {
      componentWillMount: sinon.spy(),
      componentDidMount: sinon.spy(),
      componentWillUpdate: sinon.spy(),
      componentDidUpdate: sinon.spy(),
      componentWillUnmount: sinon.spy(),
      render: function () {
        return createElement('div', { class: 'component' }, [createElement('My Component')]);
      }
    });
    div = global.document.createElement('div');
    component.mount(div);
  });

  afterEach(function () {
    component.unmount();
  });

  describe('#render()', function () {
    it('renders correctly', function () {
      expect(div.innerHTML).to.equal('<div class="component">My Component</div>');
    });

    it('calls replaceChild on consecutive mounts', function () {
      div.replaceChild = sinon.spy();
      component.mount(div);
      expect(div.replaceChild.calledOnce).to.equal(true);
    });

    it('calls replaceChild on consecutive renders', function () {
      div.replaceChild = sinon.spy();
      component.setState();
      expect(div.replaceChild.calledOnce).to.equal(true);
    });

    it("shouldn't call replaceChild when mounted to new parent", function () {
      component.mount(div);
      div.replaceChild = sinon.spy();
      component.mount(global.document.createElement('div'));
      expect(div.replaceChild.called).to.equal(false);
    });

    it('calls appendChild on first render', function () {
      div = global.document.createElement('div');
      div.appendChild = sinon.spy();
      component.mount(div);
      expect(div.appendChild.calledOnce).to.equal(true);
    });

    it('calls appendChild after unmount', function () {
      component.mount(div);
      div.appendChild = sinon.spy();
      component.unmount();
      component.mount(div);
      expect(div.appendChild.calledOnce).to.equal(true);
    });

    it("shouldn't call appendChild on consecutive renders", function () {
      div.appendChild = sinon.spy();
      component.mount(div);
      expect(div.appendChild.called).to.equal(false);
    });

    it('renders a nested component', function () {
      // clean up div
      component.unmount();
      div = global.document.createElement('div');
      var heading = assign(Object.create(new Component()), {
        render: function () {
          return createElement('h1', {}, [createElement(this.props.title)]);
        }
      });
      var subHeading = assign(Object.create(new Component()), {
        render: function () {
          return createElement('p', {}, [createElement(this.props.content)]);
        }
      });
      component = assign(Object.create(new Component()), {
        render: function () {
          return createElement('div', { class: 'component' }, [
            createElement('div', null, [
              createElement(heading, { title: 'My Component' }),
              createElement(subHeading, { content: 'A long time ago, in a galaxy far, far away....' })
            ])
          ]);
        }
      });

      component.mount(div);
      expect(div.innerHTML).to.equal('<div class="component">' +
          '<div>' +
            '<h1 title="My Component">My Component</h1>' +
            '<p content="A long time ago, in a galaxy far, far away....">A long time ago, in a galaxy far, far away....</p>' +
          '</div>' +
        '</div>');
    });
  });

  describe('life cycle methods', function () {
    it('calls componentWillMount if implemented', function () {
      expect(component.componentWillMount.calledOnce).to.equal(true);
    });

    it('makes props available for componentWillMount', function () {
      // Needs new component to catch initial render
      component = assign(Object.create(new Component()), {
        componentWillMount: sinon.spy(),
        render: function () {
          return createElement('div', { class: 'component' }, [createElement('My Component')]);
        }
      });
      component.mount(div, { one: 'one', two: 'two', three: 'three' });
      var args = component.componentWillMount.args[0];
      expect(args[0]).to.deep.equal({ one: 'one', two: 'two', three: 'three' });
    });

    it('calls componentWillUpdate if implemented', function () {
      component.mount(div);
      expect(component.componentWillUpdate.calledOnce).to.equal(true);
    });

    it('makes props available for componentWillUpdate', function () {
      // Get element before second render
      var element = div.querySelector('.component');
      component.mount(div, { one: 'one', two: 'two', three: 'three' });
      var args = component.componentWillUpdate.args[0];
      expect(args[0].innerHTML).to.deep.equal(element.innerHTML);
      expect(args[1]).to.deep.equal({ one: 'one', two: 'two', three: 'three' });
    });

    it('calls componentDidMount if implemented', function () {
      expect(component.componentDidMount.calledOnce).to.equal(true);
    });

    it('makes props available for componentDidMount', function () {
      // Needs new component to catch initial render
      component = assign(Object.create(new Component()), {
        componentDidMount: sinon.spy(),
        render: function () {
          return createElement('div', { class: 'component' }, [createElement('My Component')]);
        }
      });
      component.mount(div, { one: 'one', two: 'two', three: 'three' });
      var element = div.querySelector('.component');
      var args = component.componentDidMount.args[0];
      expect(args[0].innerHTML).to.deep.equal(element.innerHTML);
      expect(args[1]).to.deep.equal({ one: 'one', two: 'two', three: 'three' });
    });

    it('calls componentDidUpdate if implemented', function () {
      component.mount(div);
      expect(component.componentDidUpdate.calledOnce).to.equal(true);
    });

    it('makes props available for componentDidUpdate', function () {
      component.mount(div, { one: 'one', two: 'two', three: 'three' });
      var element = div.querySelector('.component');
      var args = component.componentDidUpdate.args[0];
      expect(args[0].innerHTML).to.deep.equal(element.innerHTML);
      expect(args[1]).to.deep.equal({ one: 'one', two: 'two', three: 'three' });
    });

    it('removes child correctly', function () {
      component.unmount();
      var elements = div.querySelectorAll('.component');
      expect(elements.length).to.equal(0);
    });

    it('calls componentWillUnmount if implemented', function () {
      component.unmount();
      expect(component.componentWillUnmount.calledOnce).to.equal(true);
    });

    it('calls componentWillUnmount when mounted into new parent', function () {
      component.mount(global.document.createElement('div'));
      expect(component.componentWillUnmount.calledOnce).to.equal(true);
    });

    it('calls componentWillUnmount if component returns null', function () {
      var shouldReturnNull = false;
      component = assign(Object.create(new Component()), {
        componentWillUnmount: sinon.spy(),
        render: function () {
          if (shouldReturnNull) {
            return null;
          }
          return createElement('div');
        }
      });
      component.mount(div);
      shouldReturnNull = true;
      component.mount(div);
      expect(component.componentWillUnmount.calledOnce).to.equal(true);
    });

    it('calls componentWillUnmount once per consecutive call', function () {
      component.unmount();
      component.unmount();
      component.unmount();
      expect(component.componentWillUnmount.calledOnce).to.equal(true);
    });
  });
});
