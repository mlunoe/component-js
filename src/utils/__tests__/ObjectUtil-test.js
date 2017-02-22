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

});
