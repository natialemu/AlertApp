import { isString, isArray } from 'lodash';
import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork } from 'redux-saga/effects';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import immutableTransform from 'redux-persist-transform-immutable';
import createActionBuffer from 'redux-action-buffer';
import createLogger from 'redux-logger';
import { AsyncStorage } from 'react-native';

function createModuleStore(name, modules = {}, persistanceConfig = {}) {
  const wares = [
    createActionBuffer(REHYDRATE),
    createLogger(),
  ];
  const sagaMiddleware = createSagaMiddleware();
  const reducer = modules.length === 0
      ? (state) => state
      : combineReducers(modules.reduce((o, m) => {
        const v = o;
        v[m.name] = m.reducer;
        return v;
      }, {}));

  const store = createStore(
    reducer,
    {},
    compose(
      autoRehydrate(),
      applyMiddleware(
        sagaMiddleware,
        ...wares
      )
    )
  );

  sagaMiddleware.run(function* rootSaga() {
    for (const m of modules) {
      const sagas = m.sagas || {};
      for (const j of Object.keys(sagas)) {
        yield fork(sagas[j]);
      }
    }
  });

  let rehydrated = false;
  const persistor = persistStore(store, Object.assign({
    storage: AsyncStorage,
    transforms: [immutableTransform({})],
  }, persistanceConfig), () => {
    rehydrated = true;
  });

  return modules.reduce((o, m) => {
    const v = o;
    const selectors = m.selectors || {};
    v[m.name] = {
      actions: m.actions || {},
      selectors: Object.keys(selectors).reduce((oo, k) => {
        const s = oo;
        s[k] = () => selectors[k](store.getState());
        return s;
      }, {}),
    };
    return v;
  }, {
    subscribe: store.subscribe.bind(store),
    dispatch: store.dispatch.bind(store),
    getState: store.getState.bind(store),
    purge: () => {
      if (rehydrated) {
        persistor.purge();
      }
    },
  });
}

export default function (name, modules = [], persistanceConfig = {}) {
  if (!isString(name) || name.trim().length === 0) {
    throw new Error('store name must be a non-empty string');
  }
  if (!isArray(modules)) {
    throw new Error('modules must be an array.');
  }

  return () => createModuleStore(name, modules, persistanceConfig);
}
