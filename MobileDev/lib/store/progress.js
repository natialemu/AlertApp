import Immutable from 'immutable';
import { normalizeModuleName } from './util';

const stepStatuses = {
  WAITING: {
    label: 'waiting',
    icon: 'O',
  },
  RUNNING: {
    label: 'running',
    icon: 'B',
  },
  DONE: {
    label: 'done',
    icon: 'A',
  },
  ERROR: {
    label: 'error',
    icon: 'C',
  },
};

export function defaultStep(id, text) {
  return {
    id,
    text,
    progress: 0,
    status: null,
  };
}

function updateProgress(state, { stepID, progress, status }) {
  return state.set('steps', state.get('steps')
    .map(step => {
      if (stepID === step.get('id')) {
        return step
          .set('progress', step.get('progress') + progress)
          .set('status', status);
      }
      return step;
    }));
}

export function makeProgress(name, initialSteps) {
  const uname = normalizeModuleName(name);

  function initialState() {
    return Immutable.fromJS({
      errors: [],
      running: false,
      steps: initialSteps(),
    });
  }

  const actionTypes = {
    INIT: `INIT_${uname}`,
    PROGRESS: `PROGRESS_${uname}`,
    COMPLETE: `COMPLETE_${uname}`,
    CANCEL: `CANCEL_${uname}`,
    ERROR: `ERROR_${uname}`,
  };

  const actions = {
    init() {
      return {
        type: actionTypes.INIT,
      };
    },
    progress(stepID, progress, status) {
      return {
        stepID,
        status,
        progress,
        type: actionTypes.PROGRESS,
      };
    },
    complete() {
      return {
        type: actionTypes.COMPLETE,
      };
    },
    cancel() {
      return {
        type: actionTypes.CANCEL,
      };
    },
    error(stepID, message) {
      return {
        stepID,
        message,
        type: actionTypes.ERROR,
        progress: 0,
        status: stepStatuses.ERROR,
      };
    },
  };

  function reducer(state = initialState(), action) {
    switch (action.type) {
      case actionTypes.INIT:
        return state
          .set('running', true)
          .set('steps', Immutable.fromJS(initialSteps()))
          .set('errors', new Immutable.List());
      case actionTypes.PROGRESS:
        return updateProgress(state, action);
      case actionTypes.COMPLETE:
        return state
          .set('currentGroupID', action.currentGroupID)
          .set('running', false);
      case actionTypes.CANCEL:
        return state
          .set('running', false);
      case actionTypes.ERROR:
        return updateProgress(
          state.set('errors', state.get('errors').push(action.message)),
          action
        );
      default:
        return state;
    }
  }

  return { name, actions, actionTypes, reducer, stepStatuses, selectors: {} };
}
