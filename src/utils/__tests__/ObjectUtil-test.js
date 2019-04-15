/* global describe */
/* global it */

var expect = require('chai').expect;
var assign = require('../ObjectUtil').assign;

describe('ObjectUtil', function () {
  describe('#assign()', function () {
    it('error cases', function () {
      expect(function () { assign(null); }).to.throw();
      expect(function () { assign(undefined); }).to.throw();
      expect(function () { assign(null, {}); }).to.throw();
      expect(function () { assign(undefined, {}); }).to.throw();
    });

    it('merges objects', function () {
      expect(assign({ a: 'a' }, { b: 'b' })).to.deep.equal({ a: 'a', b: 'b' });
    });

    it('overrides propeties of target', function () {
      expect(assign({ a: 'a' }, { a: 'b' })).to.deep.equal({ a: 'b' });
    });

    it('copies over undefined values', function () {
      expect(assign({ a: 'a' }, { a: undefined })).to.deep.equal({ a: undefined });
    });
  });
});
