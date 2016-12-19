import Immutable from 'immutable';
import { pairs } from 'lodash';
import { normalizeModuleName } from './util';
import { createSelector } from 'reselect';
import { take, put } from 'redux-saga/effects';

export default function makeModule(name) {
  const uname = normalizeModuleName(name);

  // Action Types

  const actionTypes = {
    SET: `${uname}_SET_SELECTION`,
    INTERSECT: `${uname}_INTERSECT_SELECTION`,
    UNION: `${uname}_UNION_SELECTION`,
    SUBTRACT: `${uname}_SUBTRACT_SELECTION`,
    CLEAR: `${uname}_CLEAR_SELECTION`,
  };

  // Actions

  const actions = {
    set: (keys) => ({ type: actionTypes.SET, keys }),
    intersect: (keys) => ({ type: actionTypes.INTERSECT, keys }),
    union: (keys) => ({ type: actionTypes.UNION, keys }),
    subtract: (keys) => ({ type: actionTypes.SUBTRACT, keys }),
    clear: () => ({ type: actionTypes.CLEAR }),
  };

  // Reducer
  function reducer(state = Immutable.Set(), action) {
    switch (action.type) {
      case actionTypes.SET:
        return Immutable.Set(action.keys);
      case actionTypes.INTERSECT:
        return state.intersect(action.keys);
      case actionTypes.UNION:
        return state.union(action.keys);
      case actionTypes.SUBTRACT:
        return state.subtract(action.keys);
      case actionTypes.CLEAR:
        return state.clear();
      default:
        return state;
    }
  }

  // Selectors
  const selectors = {
    getKeys: (state) => state[name],
  };

  return { name, actionTypes, actions, reducer, selectors };
}

export function applyRecordSyncSaga(module, constrainingModule, filter) {
  const m = module;
  m.sagas = m.sagas || {};
  m.sagas[`sync:${constrainingModule.name}`] = function* syncSaga() {
    while (true) {
      const action = yield take([
        constrainingModule.actionTypes.MERGE,
        constrainingModule.actionTypes.CLEAR,
      ]);

      let keys;
      switch (action.type) {
        case constrainingModule.actionTypes.MERGE:
          if (filter) {
            keys = pairs(action.records).reduce((o, [k, v]) => {
              o[filter(v) ? 'add' : 'remove'].push(k);
              return o;
            }, {
              add: [],
              remove: [],
            });
          } else {
            keys = {
              add: Object.keys(action.records),
              remove: [],
            };
          }
          if (keys.add.length) {
            yield put(m.actions.union(keys.add));
          }
          if (keys.remove.length) {
            yield put(m.actions.subtract(keys.remove));
          }
          break;
        case constrainingModule.actionTypes.CLEAR:
          yield put(m.actions.clear());
          break;
        default:
          break;
      }
    }
  };
}

export function applyRecordSetSyncSaga(module, constrainingModule) {
  const m = module;
  m.sagas = m.sagas || {};
  m.sagas[`sync:${constrainingModule.name}`] = function* syncSaga() {
    while (true) {
      const action = yield take([
        constrainingModule.actionTypes.SET,
        constrainingModule.actionTypes.INTERSECT,
        constrainingModule.actionTypes.UNION,
        constrainingModule.actionTypes.SUBTRACT,
        constrainingModule.actionTypes.CLEAR,
      ]);

      switch (action.type) {
        case constrainingModule.actionTypes.SET:
        case constrainingModule.actionTypes.INTERSECT:
          yield put(m.actions.intersect(action.keys));
          break;
        case constrainingModule.actionTypes.UNION:
          yield put(m.actions.union(action.keys));
          break;
        case constrainingModule.actionTypes.SUBTRACT:
          yield put(m.actions.subtract(action.keys));
          break;
        case constrainingModule.actionTypes.CLEAR:
          yield put(m.actions.clear());
          break;
        default:
          break;
      }
    }
  };
}

export function applyRecordSelector(module, constrainingModule) {
  const m = module;
  m.selectors = m.selectors || {};
  m.selectors.getRecords = createSelector([
    m.selectors.getKeys,
    constrainingModule.selectors.getRecords,
  ], (keys, records) => keys.reduce((o, k) => {
    const v = records.get(k);
    if (v) {
      o.push(v);
    }
    return o;
  }, []));
}
