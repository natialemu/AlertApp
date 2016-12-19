import { expect, assert } from 'chai';
import configureStore from './moduleStore';

const NAME = 'TEST_STORE';

describe('lib/moduleStore', function () {
  beforeEach(function () {
    this.stores = [];
    this.createStore = function createStore(...args) {
      const store = configureStore(...args)();
      this.stores.push(store);
      return store;
    };
  });
  afterEach(function () {
    for (const store of this.stores) {
      store.purge();
    }
  });
  it('requires store name', function () {
    const msg = 'store name must be a non-empty string';
    expect(() => this.createStore(null)).to.throw(msg);
    expect(() => this.createStore('')).to.throw(msg);
    expect(() => this.createStore(['not a string'])).to.throw(msg);
    expect(() => this.createStore(NAME)).to.not.throw(msg);
  });
  it('requires modules to be an array', function () {
    const msg = 'modules must be an array';
    expect(() => this.createStore(NAME, null)).to.throw(msg);
    expect(() => this.createStore(NAME, {})).to.throw(msg);
    expect(() => this.createStore(NAME, [])).to.not.throw(msg);
  });
  it('returns a store proxy object with getState, dispatch, and subscribe ' +
      'methods from its store creation function', function () {
    expect(this.createStore('name', [])).to.contain.all.keys('getState', 'dispatch', 'subscribe');
  });
  it('returns module scoped actions and selectors from its store creation function', function () {
    function action() {
      return;
    }
    const fooSelected = {};
    const store = this.createStore('name', [{
      name: 'foo',
      reducer(state = {}) {
        return state;
      },
      actions: {
        fooAction: action,
      },
      selectors: {
        fooSelector() {
          return fooSelected;
        },
      },
      sagas: {
        *watchFoo() {
          return;
        },
      },
    }]);
    expect(store.foo).to.be.a('object');
    expect(store.foo.actions).to.be.a('object');
    expect(store.foo.selectors).to.be.a('object');
    expect(store.foo.actions.fooAction).to.equal(action);
    expect(store.foo.selectors.fooSelector()).to.equal(fooSelected);
  });
});
