import { expect, assert } from 'chai';
import * as util from './util';

describe('lib/util', function () {
  describe('#normalizeModuleName()', function () {
    it('requires a non-empty string', function () {
      const msg = 'module name must be a non-empty string';
      expect(() => util.normalizeModuleName()).to.throw(msg);
      expect(() => util.normalizeModuleName('')).to.throw(msg);
      expect(() => util.normalizeModuleName({})).to.throw(msg);
    });
    it('converts input string to upper snake case', function () {
      expect(util.normalizeModuleName('foo')).to.equal('FOO');
      expect(util.normalizeModuleName('fooBar')).to.equal('FOO_BAR');
      expect(util.normalizeModuleName('foo_barBaz')).to.equal('FOO_BAR_BAZ');
      expect(util.normalizeModuleName('foo__barBaz')).to.equal('FOO_BAR_BAZ');
    });
  });

  describe('#chunk()', function () {
    it('requires input items to be an array', function () {
      const msg = 'items must be an array';
      expect(() => util.chunk(undefined, 1)).to.throw(msg);
      expect(() => util.chunk(1, 1)).to.throw(msg);
      expect(() => util.chunk({}, 1)).to.throw(msg);
    });
    it('requires input size to be a positive integer', function () {
      const msg = 'size must be a positive integer';
      expect(() => util.chunk([], 0)).to.throw(msg);
      expect(() => util.chunk([], -1)).to.throw(msg);
      expect(() => util.chunk([], 1.5)).to.throw(msg);
      expect(() => util.chunk([], {})).to.throw(msg);
      expect(() => util.chunk([], 'one')).to.throw(msg);
    });
    it('chunks items by size', function () {
      expect(util.chunk([], 1)).to.eql([]);
      expect(util.chunk([1, 2, 3], 2)).to.eql([[1, 2], [3]]);
    });
  });

  describe('#delay()', function () {
    it('requires input time to be a positive integer', function () {
      const msg = 'time must be a non-negative number';
      expect(() => util.delay(-1, () => {})).to.throw(msg);
      expect(() => util.delay({}, () => {})).to.throw(msg);
      expect(() => util.delay('one', () => {})).to.throw(msg);
    });
    it('requires input fn to be a function', function () {
      const msg = 'fn must be a function';
      expect(() => util.delay(1, undefined)).to.throw(msg);
      expect(() => util.delay(1, {})).to.throw(msg);
    });
    it('resolves fn result', function (done) {
      util.delay(1, () => [1]).then((result) => {
        expect(result).to.eql([1]);
        done();
      });
    });
  });

  describe('#mapAsync()', function () {
    it('requires input items to be an array', function () {
      const msg = 'items must be an array';
      expect(() => util.mapAsync(undefined, () => {})).to.throw(msg);
      expect(() => util.mapAsync(1, () => {})).to.throw(msg);
      expect(() => util.mapAsync({}, () => {})).to.throw(msg);
    });
    it('requires input fn to be a function', function () {
      const msg = 'fn must be a function';
      expect(() => util.mapAsync([], undefined)).to.throw(msg);
      expect(() => util.mapAsync([], {})).to.throw(msg);
    });
    it('maps over items with fn', function (done) {
      util.mapAsync([1, 2], (v) => v * 2).then((result) => {
        expect(result).to.eql([2, 4]);
        done();
      });
    });
  });
});
