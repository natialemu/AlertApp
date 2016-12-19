import Immutable from 'immutable';
import { createStructuredSelector } from 'reselect';
import { createImmutableSelector } from '../../util';
import { iterEntities, entityNamePlural } from '../../entity/util/iter';


export function sortRecords(a, b) {
  const aTime = (a.getIn(['updated_at']) || a.getIn(['created_at']));
  const bTime = (b.getIn(['updated_at']) || b.getIn(['created_at']));
  if (aTime > bTime) {
    return -1;
  } else if (bTime > aTime) {
    return 1;
  }
  return 0;
}

export const applyCurrentValueSelectors = (entities, recordsModule) => entity => {
  function currentValue(record) {
    return record;
  }

  const name = entityNamePlural(entity);
  const selectors = entity.selectors;

  const getEntityIDsFromParent = r => r.getIn([name]);

  const parentSelectors = {};
  for (const { relEntity } of iterEntities('parents', entity, entities)) {
    parentSelectors[entityNamePlural(relEntity)] = relEntity.selectors.records;
  }

  if (!selectors.records) {
    selectors.records = createImmutableSelector(
      createStructuredSelector(parentSelectors),
      recordsModule.selectors.getRecords,
      (parents, state) => {
        const records = state.get(name) || new Immutable.Map();
        let parentIDs;
        for (const { relEntity, source } of iterEntities('parents', entity, entities)) {
          if (source !== entity) {
            break;
          }
          if (!parentIDs) {
            parentIDs = new Immutable.Set();
          }
          parentIDs = (parents[entityNamePlural(relEntity)] || new Immutable.Map())
            .toList()
            .flatMap(getEntityIDsFromParent)
            .toSet()
            .union(parentIDs);
        }
        if (!parentIDs) {
          return records;
        }
        return records.filter((_, k) => parentIDs.includes(k));
      }
    );
  }

  selectors.sortedRecords = createImmutableSelector(
    selectors.records,
    (records) => records.sort(sortRecords)
  );

  selectors.currentValues = createImmutableSelector(
    selectors.sortedRecords,
    (entityRecords) => entityRecords.map(currentValue)
  );

  return entity;
};
