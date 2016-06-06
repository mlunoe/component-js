var expect = require('chai').expect;
var sinon = require('sinon');

var EventEmitter = require('../EventEmitter');

describe('EventEmitter', function () {
  var spy;
  var emitter;

  beforeEach(function () {
    spy = sinon.spy();
    emitter = new EventEmitter();
  });

  describe('#emit()', function () {

    it('should invoke the callback', function () {
      emitter.on('foo', spy);
      emitter.emit('foo');
      expect(spy.calledOnce).to.equal(true);
    })

    it('should pass arguments to the callbacks', function () {
      emitter.on('foo', spy);
      emitter.emit('foo', 'bar', 'baz');
      expect(spy.calledOnce).to.equal(true);
      expect(spy.getCall(0).args[0]).to.equal('bar');
      expect(spy.getCall(0).args[1]).to.equal('baz');
    });

  });

});
