var expect = require('chai').expect;
var sinon = require('sinon');

var ObjectUtil = require('../ObjectUtil');

describe('ObjectUtil', function () {

  describe('#inherits()', function () {

    describe('objects', function () {

      it('creates a new object', function () {
        var a = {a: 'a'};
        var b = {b: 'b'};
        expect(ObjectUtil.inherits(a, b)).to.not.equal(a);
        expect(ObjectUtil.inherits(a, b)).to.not.equal(b);
      });

      it('makes b available in the prototype', function () {
        var a = {a: 'a'};
        var b = {b: 'b'};
        expect(ObjectUtil.inherits(a, b).__proto__).to.deep.equal(b);
      });

      it('makes properties available from both objects', function () {
        var a = {a: 'a'};
        var b = {b: 'b'};
        expect(ObjectUtil.inherits(a, b)).to.deep.equal({a: 'a', b: 'b'});
      });

      it('prefers properties from child object', function () {
        var a = {a: 'a', shared: 'a\'s shared'};
        var b = {b: 'b', shared: 'b\'s shared'};
        expect(ObjectUtil.inherits(a, b).shared).to.equal('a\'s shared');
        expect(ObjectUtil.inherits(a, b).__proto__.shared).to.equal('b\'s shared');
      });

    });

    describe('functions', function () {

      it('creates a new object', function () {
        var a = function () { return {a: 'a'}; };
        var b = function () { return {b: 'b'}; };
        expect(ObjectUtil.inherits(a, b)).to.not.equal(a);
        expect(ObjectUtil.inherits(a, b)).to.not.equal(b);
      });

      it('makes b available in the prototype', function () {
        var a = function () { return {a: 'a'}; };
        var b = function () { return {b: 'b'}; };
        expect(ObjectUtil.inherits(a, b).__proto__).to.deep.equal(b());
      });

      it('makes properties available from both objects', function () {
        var a = function () { return {a: 'a'}; };
        var b = function () { return {b: 'b'}; };
        expect(ObjectUtil.inherits(a, b)).to.deep.equal({a: 'a', b: 'b'});
      });

      it('prefers properties from child object', function () {
        var a = function () { return {a: 'a', shared: 'a\'s shared'}; };
        var b = function () { return {b: 'b', shared: 'b\'s shared'}; };
        expect(ObjectUtil.inherits(a, b).shared).to.equal('a\'s shared');
        expect(ObjectUtil.inherits(a, b).__proto__.shared).to.equal('b\'s shared');
      });

    });

    describe('propertiesObject', function () {

      it('defaults to writable true', function () {
        var a = {a: 'a'};
        var b = {b: 'b'};
        var result = ObjectUtil.inherits(a, b);
        result.a = 'c';
        expect(result.a).to.equal('c');
      });

      it('passed propertiesObject overrides writable', function () {
        var a = {a: 'a'};
        var b = {b: 'b'};
        var result = ObjectUtil.inherits(a, b, {writable: false});
        result.a = 'c';
        expect(result.a).to.equal('a');
      });

      it('defaults to enumerable true', function () {
        var a = {a: 'a'};
        var b = {b: 'b'};
        var result = ObjectUtil.inherits(a, b);
        expect(result.propertyIsEnumerable('a')).to.equal(true);
      });

      it('passed propertiesObject overrides enumerable', function () {
        var a = {a: 'a'};
        var b = {b: 'b'};
        var result = ObjectUtil.inherits(a, b, {enumerable: false});
        expect(result.propertyIsEnumerable('a')).to.equal(false);
      });

      it('defaults to configurable true', function () {
        var a = {a: 'a'};
        var b = {b: 'b'};
        var result = ObjectUtil.inherits(a, b);
        delete result.a;
        expect(Object.prototype.hasOwnProperty.call(result, 'a')).to.equal(false);
      });

      it('passed propertiesObject overrides configurable', function () {
        var a = {a: 'a'};
        var b = {b: 'b'};
        var result = ObjectUtil.inherits(a, b, {configurable: false});
        delete result.a;
        expect(Object.prototype.hasOwnProperty.call(result, 'a')).to.equal(true);
      });

    });

  });

});
