import Immutable from 'immutable';
import { createStructuredSelector } from 'reselect';
import { createImmutableSelector } from '../../util';
import { iterEntities, entityNamePlural } from '../../entity/util/iter';

export const STATES = {
  DELETED: 'DELETED',
  ADDED: 'ADDED',
  MODIFIED: 'MODIFIED',
};

function removeChildKeys(record, entity, entities) {
  for (const { relEntity, source } of iterEntities('children', entity, entities)) {
    if (source !== entity) {
      break;
    }
    record = record.delete(entityNamePlural(relEntity));
  }
  return record;
}

export function getState(record, entity, entities) {
  if (record.getIn(['status']) === 'DELETED') {
    return 'DELETED';
  } else if (!record.getIn(['original', 'id'])) {
    return 'ADDED';
  }
  const cur = removeChildKeys(record.get('current'), entity, entities);
  const orig = removeChildKeys(record.get('original'), entity, entities);
  if (!Immutable.is(cur, orig)) {
    return 'MODIFIED';
  }
  return 'UNCHANGED';
}

export const applyStateSelectors = () => entity => {
  entity.selectors.newRecords = createImmutableSelector(
    entity.selectors.expanded,
    (entityRecords) => entityRecords
      .filter(r => r.get('state') === STATES.ADDED)
  );

  entity.selectors.deletedRecords = createImmutableSelector(
    entity.selectors.expanded,
    (entityRecords) => entityRecords
      .filter(r => r.get('state') === STATES.DELETED)
  );

  entity.selectors.changedRecords = createImmutableSelector(
    entity.selectors.expanded,
    (entityRecords) => entityRecords
      .filter(r => r.get('state') === STATES.MODIFIED)
  );

  entity.selectors.newChangedOrDeletedRecords = createImmutableSelector(
    entity.selectors.newRecords,
    entity.selectors.deletedRecords,
    entity.selectors.changedRecords,
    (newR, deletedR, changedR) => newR
      .merge(deletedR)
      .merge(changedR)
  );

  entity.selectors.uploadRecords = createStructuredSelector({
    added: entity.selectors.newRecords,
    modified: entity.selectors.changedRecords,
    deleted: entity.selectors.deletedRecords,
  });

  entity.selectors.changeCount = createImmutableSelector(
    entity.selectors.newChangedOrDeletedRecords,
    (changeset) => changeset.count()
  );

  const filterChanges = (current, original) => {
    if (!original) {
      return current;
    }
    return current
      .filter((cur, k) => !Immutable.is(cur, original.get(k)))
      .map((cur, k) => {
        const orig = original.get(k);
        if (cur && cur.filter) {
          return filterChanges(cur, orig);
        }
        return { cur, orig };
      });
  };

  entity.selectors.changeSet = createImmutableSelector(
    entity.selectors.records,
    (records) => records
      .filter(r => !Immutable.is(r.get('current'), r.get('original')))
      .map(r => filterChanges(r.get('current'), r.get('original')))
  );

  return entity;
};
