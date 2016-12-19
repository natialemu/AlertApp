import Immutable from 'immutable';
import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { normalizeModuleName } from '../../util';
import { entityNamePlural, iterEntities } from '../../entity/util/iter';
import { STATES, getState } from '../../entity/selectors/state';
import { getGroupValue } from './groupValue';

const emptyMap = new Immutable.Map();
const emptySet = new Immutable.Set();
const emptyList = new Immutable.List();

export default function makeEditor(name, recordsModule, entities, fieldTypes, timezoneSelector) {
  const uname = normalizeModuleName(name);

  const actionTypes = {
    CREATE: `CREATE_${uname}`,
    EDIT: `EDIT_${uname}`,
    SWAP: `SWAP_${uname}`,
    CHANGE_MODE: `CHANGE_MODE_${uname}`,
    UPDATE_GROUP_VALUE: `UPDATE_GROUP_VALUE_${uname}`,
    DELETE: `DELETE_${uname}`,
    REVERT: `REVERT_${uname}`,
    COMMIT: `COMMIT_${uname}`,
    MERGE_STATE: `MERGE_STATE_${uname}`,
    RESET: `RESET_${uname}`,
  };

  const actions = {
    create(entity) {
      return {
        entity,
        type: actionTypes.CREATE,
      };
    },
    edit(entity, selectedIDs, singleParent = false) {
      return {
        entity,
        selectedIDs,
        singleParent,
        type: actionTypes.EDIT,
      };
    },
    swap(entity, selectedIDs) {
      return {
        entity,
        selectedIDs,
        type: actionTypes.SWAP,
      };
    },
    changeMode(entity, mode) {
      return {
        entity,
        mode,
        type: actionTypes.CHANGE_MODE,
      };
    },
    updateGroupValue(entity, changes) {
      return {
        entity,
        changes,
        type: actionTypes.UPDATE_GROUP_VALUE,
      };
    },
    delete(entity, selectedIDs) {
      return {
        entity,
        selectedIDs,
        type: actionTypes.DELETE,
      };
    },
    revert(entity, selectedIDs) {
      return {
        entity,
        selectedIDs,
        type: actionTypes.REVERT,
      };
    },
    commit(entity) {
      return {
        entity,
        type: actionTypes.COMMIT,
      };
    },
    mergeState(editorState) {
      return {
        editorState: Immutable.fromJS(editorState),
        type: actionTypes.MERGE_STATE,
      };
    },
    reset() {
      return {
        type: actionTypes.RESET,
      };
    },
  };

  const reducer = (state = emptyMap, action) => {
    switch (action.type) {
      case actionTypes.MERGE_STATE:
        return state.merge(action.editorState);
      case actionTypes.RESET:
        return emptyMap;
      default:
        return state;
    }
  };

  function createNewRecord(entity, timezone) {
    return Immutable.fromJS(entity.create(timezone)[entityNamePlural(entity)])
      .map((r) => emptyMap
        .set('original', null));
  }

  function createEditorStateNode(entity, selection, mode, focused = false) {
    return Immutable.fromJS({
      [entityNamePlural(entity)]: {
        selection,
        mode,
        focused,
        groupValue: getGroupValue(entity.schema.getMeta('fieldList'), selection, fieldTypes),
      },
    });
  }

  function applyChildIDs(entity, editorState) {
    const entityName = entityNamePlural(entity);
    const children = editorState.getIn([entityName, 'selection']);
    if (!children) {
      return editorState;
    }
    const childKeys = children.keySeq().toSet();
    for (const { relEntity, source, key } of iterEntities('parents', entity, entities)) {
      if (entityNamePlural(source) !== entityName) {
        break;
      }
      const skey = [entityNamePlural(relEntity), 'selection'];
      const idsKey = [ entityName];
      let selection = editorState.getIn(skey);
      if (selection && selection.count() === 1) {
        selection = selection.map(r => r
          .setIn(idsKey, r.getIn(idsKey, emptySet)
            .toSet()
            .union(childKeys)
            .toList()));
        const parentID = selection.first().getIn(['id']);
        editorState = editorState
          .setIn(skey, selection)
          .setIn([entityName, 'groupValue'].concat(key), parentID);
        editorState = applyChildIDs(relEntity, editorState);
      }
    }
    return editorState;
  }

  function* create({ entity }) {
    const tz = yield select(timezoneSelector);
    const selection = createNewRecord(entity, tz);
    let editorState = createEditorStateNode(entity, selection, STATES.ADDED, true);

    const state = yield select((s) => s);

    for (const { relEntity, options } of iterEntities('parents', entity, entities)) {
      if (!options || !options.optional) {
        const relName = entityNamePlural(relEntity);
        const curRelSelection = editorState.get(relName);
        if (!curRelSelection || !curRelSelection.count()) {
          let relSelection = relEntity.selectors.sortedRecords(state);
          if (relEntity.selectors.editor) {
            const relSelector = relEntity.selectors.editor.filteredRecordOptions ?
              relEntity.selectors.editor.filteredRecordOptions :
              relEntity.selectors.editor.recordOptions;
            const opts = relSelector(state);
            relSelection = relSelection.filter((r, k) => opts.has(k)).take(1);
          } else {
            relSelection = relSelection.take(1);
          }
          if (!relSelection.count()) {
            relSelection = createNewRecord(relEntity, tz);
            editorState = editorState
              .merge(createEditorStateNode(relEntity, relSelection, STATES.ADDED));
          } else {
            editorState = editorState
              .merge(createEditorStateNode(relEntity, relSelection, STATES.MODIFIED));
            const relFam = relEntity.selectors.family(state, relSelection.keySeq());
            for (const relParent of iterEntities('parents', relEntity, entities)) {
              if (!relParent.options || !relParent.options.optional) {
                const relParentEntity = relParent.relEntity;
                const relParentName = entityNamePlural(relParentEntity);
                const relParentSelection = relFam.get(relParentName).take(1);
                editorState = editorState
                  .merge(createEditorStateNode(relParentEntity, relParentSelection, STATES.MODIFIED));
              }
            }
          }
        }
      }
    }
    yield put(actions.mergeState(applyChildIDs(entity, editorState)));
  }

  function* edit({ entity, selectedIDs, singleParent }) {
    const state = yield select((s) => s);
    const fam = entity.selectors.family(state, selectedIDs);
    const selection = fam.get(entityNamePlural(entity), emptyMap);
    let editorState = createEditorStateNode(entity, selection, STATES.MODIFIED, true);
    let seen = emptySet;
    for (const { relEntity, options } of iterEntities('parents', entity, entities)) {
      const relName = entityNamePlural(relEntity);
      if (!seen.has(relName) && (!options || !options.optional)) {
        seen = seen.add(relName);
        let relSelection = fam.get(relName, emptyMap);
        if (singleParent) {
          relSelection = relSelection.take(1);
        }
        editorState = editorState
          .merge(createEditorStateNode(relEntity, relSelection, STATES.MODIFIED));
      }
    }
    yield put(actions.mergeState(editorState));
  }

  function* swap({ entity, selectedIDs }) {
    const state = yield select((s) => s);
    const fam = entity.selectors.family(state, selectedIDs);
    const selection = fam.get(entityNamePlural(entity), emptyMap);
    let editorState = state[name]
      .merge(createEditorStateNode(entity, selection, STATES.MODIFIED));
    for (const { relEntity, source, options } of iterEntities('parents', entity, entities)) {
      if (!options || !options.optional) {
        const sourceName = entityNamePlural(source);
        const sourceSelection = editorState
          .getIn([sourceName, 'selection'], emptyMap)
          .keySeq()
          .first();
        const relName = entityNamePlural(relEntity);
        const relSelection = editorState.getIn([relName, 'selection'], emptyMap).first();
        if (sourceSelection && relSelection) {
          const curChildren = relSelection
            .getIn([sourceName], emptySet)
            .toSet();
          if (!curChildren.has(sourceSelection)) {
            const newParent = fam.get(relName, emptyMap).take(1);
            if (newParent.count()) {
              const newParentSelection = createEditorStateNode(relEntity, newParent, STATES.MODIFIED);
              editorState = editorState.merge(newParentSelection);
            }
          }
        }
      }
    }
    for (const { relEntity } of iterEntities('children', entity, entities)) {
      const relName = entityNamePlural(relEntity);
      let mode = editorState.getIn([relName, 'mode']);
      const focused = editorState.getIn([relName, 'focused']);
      if (mode === STATES.MODIFIED && !focused) {
        let relSelection = fam.get(relName, emptyMap);
        if (!relSelection.count()) {
          relSelection = createNewRecord(relEntity, timezoneSelector(state));
          mode = STATES.ADDED;
        }
        const newRelSelection = relSelection.take(1);
        editorState = editorState
          .merge(createEditorStateNode(relEntity, newRelSelection, mode));
      }
      if (focused || mode === STATES.ADDED) {
        editorState = applyChildIDs(relEntity, editorState);
      }
    }
    yield put(actions.mergeState(editorState));
  }

  function* changeMode({ entity, mode }) {
    if (mode === 'NONE') {
      let editorState = yield select(s => s[name]);
      const entityName = entityNamePlural(entity);
      const curKeys = editorState.getIn([entityName, 'selection'], emptyMap).keySeq();
      editorState = editorState
        .merge(createEditorStateNode(entity, emptyMap, mode));
      for (const { relEntity, source } of iterEntities('parents', entity, entities)) {
        if (source !== entity) {
          break;
        }
        const selectionKey = [entityNamePlural(relEntity), 'selection'];
        let parentSelection = editorState.getIn(selectionKey, emptyMap);
        parentSelection = parentSelection.map(r => r
          .setIn([entityName], r.getIn([entityName], emptyList)
            .toSet()
            .subtract(curKeys)
            .toList()));
        editorState = editorState.setIn(selectionKey, parentSelection);
      }
      yield put(actions.mergeState(editorState));
      return;
    }
    if (mode === STATES.MODIFIED) {
      const optsSelector = entity.selectors.editor.filteredRecordOptions ?
        entity.selectors.editor.filteredRecordOptions :
        entity.selectors.editor.recordOptions;
      const opts = yield select(optsSelector);
      if (opts.count()) {
        yield put(actions.swap(entity, opts.take(1).keySeq()));
        return;
      }
    }
    const state = yield select(s => s);
    const tz = timezoneSelector(state);
    const selection = createNewRecord(entity, tz);
    let editorState = state[name]
      .merge(createEditorStateNode(entity, selection, STATES.ADDED));
    editorState = applyChildIDs(entity, editorState);
    for (const { relEntity } of iterEntities('children', entity, entities)) {
      const relName = entityNamePlural(relEntity);
      const focused = editorState.getIn([relName, 'focused']);
      if (!focused && editorState.getIn([relName, 'mode']) === STATES.MODIFIED) {
        const relSelection = createNewRecord(relEntity, tz);
        editorState = editorState
          .merge(createEditorStateNode(relEntity, relSelection, STATES.ADDED));
      }
      editorState = applyChildIDs(relEntity, editorState);
    }
    yield put(actions.mergeState(editorState));
  }

  function* updateGroupValue({ entity, changes }) {
    let editorState = yield select(s => s[name]);
    const gvk = [entityNamePlural(entity), 'groupValue'];
    let groupValue = editorState.getIn(gvk);
    if (!groupValue) {
      return;
    }
    for (let i = 0; i < changes.length; i++) {
      const change = changes[i];
      if (change.length === 1) {
        const [key] = change;
        groupValue = groupValue.deleteIn(key);
      } else {
        const [key, value] = change;
        groupValue = groupValue.setIn(key, value);
      }
    }
    editorState = editorState.setIn(gvk, groupValue);
    yield put(actions.mergeState(editorState));
  }

  function* del({ entity, selectedIDs }) {
    const state = yield select(s => s);
    let fam = entity.selectors.family(state, selectedIDs);
    const entityName = entityNamePlural(entity);
    let records = state[recordsModule.name];

    function detach(ent, relEntity, detachedKeys) {
      const relName = entityNamePlural(relEntity);
      const relSelection = fam.get(relName, emptyMap)
        .filter((_, parentID) => records.hasIn([relName, parentID]))
        .map((_, parentID) => {
          const parent = records.getIn([relName, parentID]);
          const idsKey = [entityNamePlural(ent)];
          const keys = parent.getIn(idsKey, emptyList).filter(d => !detachedKeys.has(d));
          return parent.setIn(idsKey, keys);
        });
      fam = fam.mergeIn([relName], relSelection);
      records = records.mergeIn([relName], relSelection);
    }

    const stateMap = fam.get(entityName, emptyMap).reduce(
      (m, r, k) => {
        const s = getState(r, entity, entities);
        const key = s === STATES.ADDED ? s : STATES.MODIFIED;
        return m.setIn([key, k], r);
      }, emptyMap
    );

    const addedKeys = stateMap.get(STATES.ADDED, emptyMap).keySeq().toSet();
    if (addedKeys.count()) {
      let hasParents = false;
      for (const { relEntity, source } of iterEntities('parents', entity, entities)) {
        hasParents = true;
        if (entityNamePlural(source) !== entityName) {
          break;
        }
        detach(entity, relEntity, addedKeys);
      }
      if (!hasParents) {
        records = records.set(
          entityName,
          records
            .get(entityName, emptyMap)
            .filter((_, k) => !addedKeys.has(k))
        );
      }
      for (const { relEntity } of iterEntities('children', entity, entities)) {
        const relName = entityNamePlural(relEntity);
        const childKeys = fam.get(relName, emptyMap).keySeq().toSet();
        for (const cp of iterEntities('parents', relEntity, entities)) {
          if (cp.source !== relEntity) {
            break;
          }
          detach(relEntity, cp.relEntity, childKeys);
        }
      }
    }
    stateMap.get(STATES.MODIFIED, emptyMap).forEach((r, k) => {
      records = records.setIn(
        [entityName, k],
        r.setIn(['status'], STATES.DELETED)
      );
    });
    yield put(recordsModule.actions.merge(records));
  }

  function* revert({ entity, selectedIDs }) {
    let state = yield select(s => s);
    const selection = entity.selectors.sortedRecords(state)
      .filter((_, k) => selectedIDs.indexOf(k) > -1);
    const sorted = selection.reduce(
      (m, r, k) => m.setIn([
        (getState(r, entity, entities) === STATES.ADDED ? 'new' : 'changed'),
        k,
      ], r),
      emptyMap
    );
    const newRecords = sorted.get('new');
    if (newRecords) {
      yield put(actions.delete(entity, newRecords.keySeq()));
    }
    const changedRecords = sorted.get('changed');
    if (changedRecords) {
      state = yield select(s => s);
      const entityName = entityNamePlural(entity);
      let records = state[recordsModule.name];
      changedRecords.forEach((r, k) => {
        records = records.setIn([entityName, k], r.get('original'));
        for (const { relEntity, key, source } of iterEntities('parents', entity, entities)) {
          if (source !== entity) {
            break;
          }
          const fk = r.getIn(['original'].concat(key));
          const relName = entityNamePlural(relEntity);
          let rels = records.get(relName);
          const childIDKey = [entityName];
          rels = rels.map(p => {
            const keys = p.getIn(childIDKey, emptyList);
            if (p.getIn(['id']) === fk) {
              return p.setIn(childIDKey, keys.push(k));
            }
            return p.setIn(childIDKey, keys.filter(d => d !== k));
          });
          records = records.set(relName, rels);
        }
      });
      yield put(recordsModule.actions.merge(records));
    }
  }

  function* commit({ entity }) {
    let records = yield select(s => s[recordsModule.name]);
    const editorState = yield select(s => s[name]);
    let selection = yield select(entity.selectors.editor.appliedGroupValue);

    records = records.mergeIn([entityNamePlural(entity)], selection);
    const scrubber = (sourceName, sourceKeys) => {
      const keyPath = [sourceName];
      return r => {
        if (!r.get(keyPath, emptySet)) {
          console.log(r.toJS());
          return r;
        }
        return r.setIn(keyPath, r.getIn(keyPath, emptySet)
          .toSet()
          .subtract(sourceKeys)
          .toList()
        );
      };
    };

    for (const { relEntity, source } of iterEntities('parents', entity, entities)) {
      const sourceName = entityNamePlural(source);
      const sourceSelection = editorState.getIn([sourceName, 'selection']);
      if (sourceSelection) {
        const sourceKeys = sourceSelection
          .keySeq()
          .toSet();
        const relName = entityNamePlural(relEntity);
        const scrubbed = records.get(relName, emptyMap)
          .map(scrubber(sourceName, sourceKeys));
        selection = yield select(relEntity.selectors.editor.appliedGroupValue);
        records = records.set(relName, scrubbed.merge(selection));
      }
    }

    if (entity.prepareCommit) {
      records = entity.prepareCommit(editorState, records, entities);
    }
    yield put(recordsModule.actions.merge(records));
    yield put(actions.reset());
  }

  function watcher(pattern, handler) {
    function* safeHandler(action) {
      try {
        yield* handler(action);
      } catch (e) {
        console.error(e);
      }
    }
    return function* watchPattern() {
      yield* takeEvery(pattern, safeHandler);
    };
  }

  const sagas = [
    watcher(actionTypes.CREATE, create),
    watcher(actionTypes.EDIT, edit),
    watcher(actionTypes.SWAP, swap),
    watcher(actionTypes.CHANGE_MODE, changeMode),
    watcher(actionTypes.UPDATE_GROUP_VALUE, updateGroupValue),
    watcher(actionTypes.DELETE, del),
    watcher(actionTypes.REVERT, revert),
    watcher(actionTypes.COMMIT, commit),
  ];

  const sagaMethods = {
    create,
    edit,
    swap,
    changeMode,
    updateGroupValue,
    del,
    revert,
    commit,
  };

  return { name, actionTypes, actions, reducer, sagas, sagaMethods };
}
