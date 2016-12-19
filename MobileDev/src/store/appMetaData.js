import Immutable from 'immutable';
import { normalizeModuleName } from '../../lib/store/util';

const name = 'appMetaData';

const uname = normalizeModuleName(name);

function initialState() {
  return Immutable.fromJS({
    versionNumber: 'v0.1',
    platform: 'unknown',
    appName: 'Alertz',
  });
}

const actionTypes = {
  SET_METADATA_FIELD: `SET_METADATA_FIELD_${uname}`,
};

function reducer(state = initialState(), action) {
  switch (action.type) {
    case actionTypes.SET_METADATA_FIELD:
      return state
        .set(action.field, action.value);
    default:
      return state;
  }
}

const actions = {
  setMetadataField(field, value) {
    return {
      type: actionTypes.SET_METADATA_FIELD,
      field,
      value,
    };
  }
};

export default { name, reducer, actions };
