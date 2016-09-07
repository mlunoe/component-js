'use strict';

var expect = require('chai').expect;

var ObjectUtil = require('../ObjectUtil');

describe('ObjectUtil', function () {

  describe('#assign()', function () {

    it('error cases', function () {
      expect(function () { ObjectUtil.assign(null); }).to.throw();
      expect(function () { ObjectUtil.assign(undefined); }).to.throw();
      expect(function () { ObjectUtil.assign(null, {}); }).to.throw();
      expect(function () { ObjectUtil.assign(undefined, {}); }).to.throw();
    });

    it('merges objects', function () {
      expect(ObjectUtil.assign({a: 'a'}, {b: 'b'})).to.deep.equal({a: 'a', b: 'b'});
    });

    it('overrides propeties of target', function () {
      expect(ObjectUtil.assign({a: 'a'}, {a: 'b'})).to.deep.equal({a: 'b'});
    });

    it('copies over undefined values', function () {
      expect(ObjectUtil.assign({a: 'a'}, {a: undefined})).to.deep.equal({a: undefined});
    });

  });

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

  });

});
