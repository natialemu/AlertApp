import Immutable from 'immutable';
import { pairs } from 'lodash';
import { expect } from 'chai';
import createRecordsModule from './records';
import { sharedModuleTests } from './common.test';

describe('lib/records', function () {
  beforeEach(function before() {
    this.createModule = function create(name) {
      return createRecordsModule(name);
    };
  });

  sharedModuleTests();

  describe('#reducer', function () {
    beforeEach(function () {
      const module = this.createModule('name');
      this.reducer = module.reducer;
      this.actions = module.actions;
    });
    it('defaults to an empty Immutable.Map', function () {
      const state = this.reducer(undefined, {});
      expect(Immutable.Map.isMap(state)).to.equal(true);
      expect(state.size).to.equal(0);
    });
    it('accepts records for merging', function () {
      const first = {
        a: {},
      };
      const second = {
        a: { modified: true },
        b: {},
      };
      let state = Immutable.Map();
      state = this.reducer(state, this.actions.merge(first));
      expect(state.toJS()).to.eql(Immutable.Map(pairs(first)).toJS());
      state = this.reducer(state, this.actions.merge(second));
      expect(state.toJS()).to.eql(
          Immutable.Map(pairs(first)).merge(Immutable.Map(pairs(second))).toJS());
    });
    it('can be cleared', function () {
      let state = Immutable.Map([
        ['a', {}],
        ['b', {}],
      ]);
      state = this.reducer(state, this.actions.clear());
      expect(state.size).to.equal(0);
    });
  });
});
