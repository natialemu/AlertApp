import Immutable from 'immutable';
import { expect } from 'chai';
import { put } from 'redux-saga/effects';
import createDownloaderModule, { applyDownloadSaga } from './downloader';
import { sharedModuleTests } from './common.test';

describe('lib/downloader', function () {
  beforeEach(function before() {
    this.createModule = function create(name) {
      return createDownloaderModule(name);
    };
    this.applySagas = function applySagas(module) {
      applyDownloadSaga(module, () => {});
      return module;
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
    it('sets pending state and clears error when download is requested', function () {
      let state = Immutable.Map({ context: 1, error: 2 });
      state = this.reducer(state, this.actions.download());
      expect(state.get('isPending')).to.equal(true);
      expect(state.get('context')).to.equal(1);
      expect(state.has('error')).to.equal(false);
    });
    it('clears pending state and sets context upon confirmation', function () {
      let state = Immutable.Map({ context: 1 });
      state = this.reducer(state, this.actions.download());
      state = this.reducer(state, this.actions.confirmDownload(2));
      expect(state.has('isPending')).to.equal(false);
      expect(state.get('context')).to.equal(2);
    });
    it('clears pending state and sets error upon rejection', function () {
      let state = Immutable.Map({ context: 1 });
      state = this.reducer(state, this.actions.download());
      state = this.reducer(state, this.actions.rejectDownload(2));
      expect(state.has('isPending')).to.equal(false);
      expect(state.get('error')).to.equal(2);
      expect(state.get('context')).to.equal(1);
    });
  });

  describe('#applyDownloadSaga()', function () {
    beforeEach(function () {
      this.module = this.createModule('name');
      applyDownloadSaga(this.module, function *downloadSaga() { return; });
    });
    it('puts response payload', function () {
      const mockResponse = {
        1: {},
      };
      const generator = this.module.sagas.download();
      generator.next();
      generator.next();
      expect(generator.next({ response: mockResponse }).value).to.eql(
          put(this.module.actions.confirmDownload(mockResponse)));
    });
    it('can be canceled', function () {
      const generator = this.module.sagas.download();
      const cancel = 'canceled';
      generator.next();
      generator.next();
      expect(generator.next({ cancel }).value).to.eql(
          put(this.module.actions.rejectDownload(new Error(cancel))));
    });
  });
});
