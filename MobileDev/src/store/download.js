import Immutable from 'immutable';
import { flatten } from 'lodash';
import { normalize, arrayOf } from 'normalizr';
import { put, call, take, race } from 'redux-saga/effects';
import { normalizeModuleName } from '../../lib/store/util';
import denormalize from './denormalize';
import schemas from './schema';
import records from './records';
import FAKE_DATA from './fakeData';

const name = 'downloader';

const uname = normalizeModuleName(name);

function getFakeData({ entityName }) {
  return FAKE_DATA[entityName.plural];
}

function initialState() {
  return Immutable.fromJS({});
}

const INIT = `INIT_${uname}`;
const START = `START_${uname}`;
const CANCEL = `CANCEL_${uname}`;
const COMPLETE = `COMPLETE_${uname}`;

function reducer(state = initialState(), action) {
  switch (action.type) {
    case COMPLETE:
      return state
        .set('currentGroupID', action.currentGroupID);
    default:
      return state;
  }
}

const actions = {
  init(groupID) {
    return {
      groupID,
      type: INIT,
    };
  },
  start(groupID, accountID) {
    return {
      groupID,
      accountID,
      type: START,
    };
  },
  cancel() {
    return {
      type: CANCEL,
    };
  },
  complete(currentGroupID) {
    return {
      currentGroupID,
      type: COMPLETE,
    };
  },
};

function* download() {
  try {
    const accounts = yield call(
      getFakeData,
      { entityName: schemas.account.schema.getMeta('entityName') }
    );
    let users = yield accounts.map(() => call(
      getFakeData,
      { entityName: schemas.user.schema.getMeta('entityName') }
    ));
    users = flatten(users);
    let events = yield users.map(() => call(
      getFakeData,
      { entityName: schemas.event.schema.getMeta('entityName') }
    ));
    events = flatten(events);
    const denormalized = denormalize({
      accounts,
      users,
      events,
    });
    let { entities } = normalize(denormalized, arrayOf(schemas.account.schema));
    entities = Immutable.fromJS(entities)
      .map(rs => rs.map(r => new Immutable.fromJS(r)));
    yield put(records.actions.merge(entities));
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

const sagas = [
  function* watchStartDownload() {
    while (true) {
      const { groupID, organizationID, accountID } = yield take(START);

      yield put(records.actions.clear());

      const { cancel } = yield race({
        response: call(download, groupID, organizationID, accountID),
        cancel: take(CANCEL),
      });

      if (cancel) {
        yield put(records.actions.clear());
      } else {
        yield put(actions.complete(groupID));
      }
    }
  },
];

export default { name, reducer, actions, sagas };
