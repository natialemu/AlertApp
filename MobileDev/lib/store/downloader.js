import Immutable from 'immutable';
import { normalizeModuleName } from './util';
import { race, take, call, put } from 'redux-saga/effects';

export default function makeModule(name) {
  const uname = normalizeModuleName(name);

  // Action Types

  const actionTypes = {
    DOWNLOAD_REQUESTED: `${uname}_DOWNLOAD_REQUESTED`,
    DOWNLOAD_REQUEST_CANCELED: `${uname}_DOWNLOAD_REQUEST_CANCELED`,
    DOWNLOAD_PROGRESSED: `${uname}_DOWNLOAD_PROGRESSED`,
    DOWNLOAD_COMPLETED: `${uname}_DOWNLOAD_COMPLETED`,
    DOWNLOAD_REJECTED: `${uname}_DOWNLOAD_REJECTED`,
  };

  // Action Creators

  const actions = {
    download: () => ({ type: actionTypes.DOWNLOAD_REQUESTED }),
    cancelDownload: () => ({ type: actionTypes.DOWNLOAD_REQUEST_CANCELED }),
    notifyDownloadProgress: (progress) => ({ type: actionTypes.DOWNLOAD_PROGRESSED, progress }),
    confirmDownload: (state) => ({ type: actionTypes.DOWNLOAD_COMPLETED, state }),
    rejectDownload: (error) => ({ type: actionTypes.DOWNLOAD_REJECTED, error }),
  };

  // Reducer

  function reducer(state = Immutable.Map(), action) {
    switch (action.type) {
      case actionTypes.DOWNLOAD_REQUESTED:
        return state.set('isPending', true).delete('progress').delete('error');
      case actionTypes.DOWNLOAD_PROGRESSED:
        return state.set('progress', action.progress);
      case actionTypes.DOWNLOAD_COMPLETED:
        return state.delete('isPending').set('context', action.state);
      case actionTypes.DOWNLOAD_REJECTED:
        return state.delete('isPending').set('error', action.error);
      default:
        return state;
    }
  }

  return { name, actionTypes, actions, reducer };
}

export function applyDownloadSaga(module, generator) {
  const m = module;
  m.sagas = m.sagas || {};
  m.sagas.download = function* downloadSaga() {
    while (true) {
      yield take(m.actionTypes.DOWNLOAD_REQUESTED);
      try {
        const { response, cancel } = yield race({
          response: call(generator),
          cancel: take(m.actionTypes.DOWNLOAD_REQUEST_CANCELED),
        });
        if (response) {
          yield put(m.actions.confirmDownload(response));
        } else {
          throw new Error(cancel);
        }
      } catch (error) {
        yield put(m.actions.rejectDownload(error));
      }
    }
  };
}
