import Immutable from 'immutable';
import { createStructuredSelector } from 'reselect';
import { createImmutableSelector } from '../../util';
import { iterEntities, getEntityName } from '../../entity/util/iter';
import { getState } from './state';

export const expandedSelectors = (entity, entities, relSelector) => {
  const entityName = getEntityName(entity);
  const selectors = {};
  for (const { relEntity, source } of iterEntities('parents', entity, entities)) {
    if (getEntityName(source) !== entityName) {
      break;
    }
    const relName = getEntityName(relEntity);
    selectors[relName.plural] = relSelector(relEntity);
  }
  return createStructuredSelector(selectors);
};

export const expandEntity = (entity, entities) => {
  const entityName = getEntityName(entity);

  return (relState, records) => {
    const iterparents = iterEntities('parents', entity, entities);
    const prepared = records.map((r, k) => r
      .set('_internalID', k)
      .set('id', r.getIn('id') || k)
      .set('state', getState(r, entity, entities)));
    let expanded;
    for (const { relEntity, key, source } of iterparents) {
      if (getEntityName(source) !== entityName) {
        break;
      }
      const relName = getEntityName(relEntity);
      const relRecords = relState[relName.plural] || new Immutable.Map();
      expanded = relRecords.reduce(
        (m, parent) => m.merge(parent.get(entityName.plural, new Immutable.List())
          .filter(k => m.has(k) || prepared.has(k))
          .reduce((mm, k) => mm.set(k, (mm.get(k) || prepared.get(k))
            .set(relName.single, parent)
            .setIn(key, parent.get('id') || parent.get('_internalID'))),
            m
          )
        ),
        expanded || new Immutable.Map()
      );
    }
    // record had no parents!
    if (expanded === undefined) {
      expanded = prepared;
    }
    return expanded.map(exp => exp
      .set('errors', Immutable.fromJS(entity.validate ? entity.validate(exp) : []))
      .set('_externalStatus', exp.get('status')));
  };
};

export const applyExpandedSelectors = entities => entity => {
  if (entity.applyExpandedSelectors) {
    entity.applyExpandedSelectors(entity, entities);
    return entity;
  }

  entity.selectors.expanded = createImmutableSelector(
    expandedSelectors(entity, entities, (relEntity) => relEntity.selectors.expanded),
    entity.selectors.records,
    expandEntity(entity, entities)
  );

  return entity;
};
