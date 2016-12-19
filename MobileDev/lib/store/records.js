import Immutable from 'immutable';
import { normalizeModuleName } from './util';

export default function makeModule(name) {
  const uname = normalizeModuleName(name);

  // Action Types

  const actionTypes = {
    MERGE: `${uname}_MERGE`,
    CLEAR: `${uname}_CLEAR`,
  };

  // Action Creators

  const actions = {
    merge: (records) => ({ type: actionTypes.MERGE, records }),
    clear: () => ({ type: actionTypes.CLEAR }),
  };

  // Reducer

  function reducer(state = Immutable.Map({}), action) {
    switch (action.type) {
      case actionTypes.MERGE:
        return state.merge(action.records);
      case actionTypes.CLEAR:
        return state.clear();
      default:
        return state;
    }
  }

  // Selectors

  const selectors = {
    getRecords: (state) => state[name],
  };

  return { name, actionTypes, actions, reducer, selectors };
}
