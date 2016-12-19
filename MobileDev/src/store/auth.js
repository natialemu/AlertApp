import Immutable from 'immutable';
import { put, take } from 'redux-saga/effects';
import { normalizeModuleName } from '../../lib/store/util';

const name = 'auth';

const uname = normalizeModuleName(name);

function initialState() {
  return Immutable.fromJS({
    sessionToken: null,
    hasSessionToken: false,
  });
}

const actionTypes = {
  GET_SESSION_TOKEN: `GET_SESSION_TOKEN_${uname}`,
  SET_SESSION_TOKEN: `SET_SESSION_TOKEN_${uname}`,
  HAS_SESSION_TOKEN: `HAS_SESSION_TOKEN_${uname}`,
};

function reducer(state = initialState(), action) {
  switch (action.type) {
    case actionTypes.SET_SESSION_TOKEN:
      return state
        .set('hasSessionToken', true)
        .set('sessionToken', action.token);
    default:
      return state;
  }
}

const actions = {
  getSessionToken() {
    return {
      type: actionTypes.GET_SESSION_TOKEN,
    };
  },
  setSessionToken(token) {
    return {
      type: actionTypes.SET_SESSION_TOKEN,
      token,
    };
  },
};

const sagas = [
  function* watchGetSessionToken() {
    while (true) {
      yield take(actionTypes.GET_SESSION_TOKEN);
      yield put(actions.setSessionToken('anAuthToken'));
    }
  },
];

export default { name, reducer, actions, sagas };
