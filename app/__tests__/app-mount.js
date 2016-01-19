var React = require('react');
var u = require('react-addons-test-utils');
var expect = require('chai').expect;
var CounterApp = require('../counter.jsx');

describe('CounterApp', function () {
    it('renders', function () {
        var app = u.renderIntoDocument(<CounterApp />);
        expect(app).to.exist;
    })
})
