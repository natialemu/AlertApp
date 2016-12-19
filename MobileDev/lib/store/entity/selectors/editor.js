import Immutable from 'immutable';
import { createSelector } from 'reselect';
import { getEntityName, iterEntities } from '../../entity/util/iter';
import { expandEntity, expandedSelectors } from './expanded';
import { GROUP_CONFLICT, applyGroupValue } from '../editor/groupValue';

export const applyEditorSelectors = (entities, editorName, fieldTypes) => entity => {
  const entityName = getEntityName(entity).plural;

  const editorState = (state) => state[editorName(entity)].get(entityName) || new Immutable.Map();

  const groupValue = createSelector(
    editorState,
    (state) => (state.get('groupValue') || new Immutable.Map())
  );

  const groupValueJS = createSelector(
    groupValue,
    (group) => group
      .map(value => (value === GROUP_CONFLICT ? undefined : value))
      .toJS()
  );

  const mode = createSelector(
    editorState,
    (state) => state.get('mode')
  );

  const selection = createSelector(
    editorState,
    (state) => state.get('selection') || new Immutable.Map()
  );

  const selectionFirst = createSelector(
    selection,
    (selected) => selected.first()
  );


  const fields = entity.schema.getMeta('fieldList');

  const appliedGroupValue = createSelector(
    () => fields,
    groupValue,
    selection,
    () => fieldTypes,
    applyGroupValue
  );

  const expanded = createSelector(
    expandedSelectors(entity, entities, (relEntity) => relEntity.selectors.editor.expanded),
    appliedGroupValue,
    expandEntity(entity, entities)
  );

  const recordOptions = createSelector(
    entity.selectors.expanded,
    expanded,
    (allRecords, focusedRecords) => {
      if (!(focusedRecords && focusedRecords.count())) {
        return allRecords;
      }
      let opts = new Immutable.Map();
      for (const { relEntity, source } of iterEntities('parents', entity, entities)) {
        if (source !== entity) {
          break;
        }
        const relName = getEntityName(relEntity);
        const ids = focusedRecords.toList()
          .flatMap(r => r.getIn([relName.single, entityName]))
          .toSet();
        opts = opts.merge(allRecords.filter((_, k) => ids.has(k)));
      }
      return opts;
    }
  );

  const recordOptionsJS = createSelector(
    recordOptions,
    (s) => s.toList().toJS()
  );

  const groupState = createSelector(
    expanded,
    (records) => {
      const states = records.map(r => r.get('state')).toSet();
      if (states.count() === 1) {
        return states.toList().first();
      }
      return null;
    }
  );

  const isNew = createSelector(
    groupState,
    (state) => state === 'ADDED'
  );

  entity.selectors.editor = {
    groupValue,
    groupValueJS,
    mode,
    selection,
    selectionFirst,
    expanded,
    appliedGroupValue,
    recordOptions,
    recordOptionsJS,
    groupState,
    isNew,
  };

  return entity;
};
