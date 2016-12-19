import Immutable from 'immutable';
import { expect } from 'chai';
import { put } from 'redux-saga/effects';
import createRecordSetModule, {
  applyRecordSyncSaga,
  applyRecordSetSyncSaga,
  applyRecordSelector,
 } from './recordSet';
import createRecordsModule from './records';
import { sharedModuleTests } from './common.test';

describe('lib/recordSet', function () {
  beforeEach(function before() {
    this.createModule = function create(name) {
      return createRecordSetModule(name);
    };
  });

  sharedModuleTests();

  describe('#reducer', function () {
    beforeEach(function () {
      const module = this.createModule('name');
      this.reducer = module.reducer;
      this.actions = module.actions;
    });
    it('defaults to an empty Immutable.Set', function () {
      const state = this.reducer(undefined, {});
      expect(Immutable.Set.isSet(state)).to.equal(true);
      expect(state.size).to.equal(0);
    });
    it('accepts an array of keys for set initialization', function () {
      const first = ['a', 'b'];
      let state = Immutable.Set();
      state = this.reducer(state, this.actions.set(first));
      expect(state.toJS()).to.eql(Immutable.Set(first).toJS());
    });
    it('accepts an array of keys for incremental insertion', function () {
      const first = ['a', 'b'];
      const second = ['b', 'c'];
      let state = Immutable.Set(first);
      state = this.reducer(state, this.actions.union(second));
      expect(state.toJS()).to.eql(Immutable.Set(first).merge(Immutable.Set(second)).toJS());
    });
    it('accepts an array of keys for removal', function () {
      let state = Immutable.Set(['a', 'b']);
      state = this.reducer(state, this.actions.subtract(['a', 'b']));
      expect(state.has('a')).to.equal(false);
      expect(state.has('b')).to.equal(false);
      expect(state.size).to.equal(0);
      state = this.reducer(state, this.actions.subtract(['c']));
      expect(state.size).to.equal(0);
    });
    it('can be cleared', function () {
      let state = Immutable.Set(['a', 'b']);
      state = this.reducer(state, this.actions.clear());
      expect(state.size).to.equal(0);
    });
  });

  describe('#applyRecordSyncSaga', function () {
    beforeEach(function () {
      this.module = this.createModule('name');
      this.otherModule = createRecordsModule('other_name');
      this.yetAnotherModule = createRecordsModule('yet_another_name');
      applyRecordSyncSaga(this.module, this.otherModule);
      applyRecordSyncSaga(this.module, this.yetAnotherModule, (v) => v > 1);
    });
    it('puts a union action in response to an unfiltered merge action on ' +
        'the target module', function () {
      const values = {
        a: 1,
        b: 2,
      };
      const generator = this.module.sagas['sync:other_name']();
      generator.next();
      const n = generator.next(this.otherModule.actions.merge(values)).value;
      expect(n).to.eql(put(this.module.actions.union(Object.keys(values))));
    });
    it('puts union and subtract actions in response to a filtered merge action on ' +
        'the target module', function () {
      const values = {
        a: 1,
        b: 2,
      };
      const generator = this.module.sagas['sync:yet_another_name']();
      generator.next();
      const n = generator.next(this.yetAnotherModule.actions.merge(values)).value;
      expect(n).to.eql(put(this.module.actions.union(['b'])));
      expect(generator.next().value).to.eql(put(this.module.actions.subtract(['a'])));
    });
    it('puts a clear action in response to a clear action on the target module', function () {
      const generator = this.module.sagas['sync:other_name']();
      generator.next();
      const n = generator.next(this.otherModule.actions.clear()).value;
      expect(n).to.eql(put(this.module.actions.clear()));
    });
  });

  describe('#applyRecordSetSyncSaga', function () {
    beforeEach(function () {
      this.module = this.createModule('name');
      this.otherModule = this.createModule('other_name');
      applyRecordSetSyncSaga(this.module, this.otherModule);
    });

    it('puts an intersect action in response to a set ' +
        'action on the target module', function () {
      const values = ['a', 'b'];
      const generator = this.module.sagas['sync:other_name']();
      generator.next();
      const n = generator.next(this.otherModule.actions.set(values)).value;
      expect(n).to.eql(put(this.module.actions.intersect(values)));
    });
    it('puts an intersect action in response to an intersect ' +
        'action on the target module', function () {
      const values = ['a', 'b'];
      const generator = this.module.sagas['sync:other_name']();
      generator.next();
      const n = generator.next(this.otherModule.actions.intersect(values)).value;
      expect(n).to.eql(put(this.module.actions.intersect(values)));
    });
    it('puts a union action in response to a union action on the target module', function () {
      const values = ['a', 'b'];
      const generator = this.module.sagas['sync:other_name']();
      generator.next();
      const n = generator.next(this.otherModule.actions.union(values)).value;
      expect(n).to.eql(put(this.module.actions.union(values)));
    });
    it('puts a subtract action in response to a subtract action on the target module', function () {
      const values = ['a', 'b'];
      const generator = this.module.sagas['sync:other_name']();
      generator.next();
      const n = generator.next(this.otherModule.actions.subtract(values)).value;
      expect(n).to.eql(put(this.module.actions.subtract(values)));
    });
    it('puts a clear action in response to a clear action on the target module', function () {
      const generator = this.module.sagas['sync:other_name']();
      generator.next();
      const n = generator.next(this.otherModule.actions.clear()).value;
      expect(n).to.eql(put(this.module.actions.clear()));
    });
  });

  describe('#applyRecordSelector', function () {
    beforeEach(function () {
      this.module = this.createModule('name');
      this.constrainingModule = createRecordsModule('other_name');
    });
    it('creates a composed selector', function () {
      applyRecordSelector(this.module, this.constrainingModule);
      expect(this.module.selectors.getRecords).to.be.a('function');
    });
    it('resolves root state to an array of selected items', function () {
      applyRecordSelector(this.module, this.constrainingModule);
      const resp = this.module.selectors.getRecords({
        name: Immutable.Set(['a', 'c']),
        other_name: Immutable.Map({
          a: 1,
          b: 2,
          c: 3,
        }),
      });
      expect(Immutable.Set(resp).equals(Immutable.Set([1, 3]))).to.equal(true);
    });
    it('is memoized', function () {
      applyRecordSelector(this.module, this.constrainingModule);
      const state = {
        name: Immutable.Set(['a']),
        other_name: Immutable.Map({ a: 1 }),
      };
      const resp = this.module.selectors.getRecords(state);
      expect(Immutable.Set(resp).equals(
          Immutable.Set(this.module.selectors.getRecords(state)))).to.equal(true);
      expect(this.module.selectors.getRecords.recomputations()).to.equal(1);
    });
  });
});
