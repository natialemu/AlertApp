import Immutable from 'immutable';
import { createSelector, createStructuredSelector } from 'reselect';
import { iterEntities, getEntityName } from '../../entity/util/iter';

const walk = (reltype, entity, entities, selection, relState, visitor) => {
  const iter = iterEntities(reltype, entity, entities);
  let sourceRecords = selection || Immutable.Map();
  let curSourceName = getEntityName(entity);
  let data = new Immutable.Map();
  for (const { relEntity, source } of iter) {
    const sourceName = getEntityName(source);
    if (sourceName !== curSourceName) {
      sourceRecords = data.get(sourceName.plural) || new Immutable.Map();
      curSourceName = sourceName;
    }
    const relName = getEntityName(relEntity);
    const relRecords = relState[relName.plural];
    if (relRecords) {
      data = visitor(data, sourceRecords, sourceName, relRecords, relName);
    }
  }
  return data;
};

const isParent = (idsKey, kids) => r => {
  try {
    return r
      .getIn(idsKey, new Immutable.List())
      .some(kids.has, kids);
  } catch (e) {
    return false;
  }
};

const extractParents = (entity, entities, selection, relState) => {
  const visitor = (data, sourceRecords, sourceName, relRecords, relName) => {
    const predicate = isParent([sourceName.plural], sourceRecords);
    const rels = relRecords.filter(predicate);
    return data.has(relName.plural) ?
      data.mergeIn([relName.plural], rels) :
      data.set(relName.plural, rels);
  };
  return walk('parents', entity, entities, selection, relState, visitor);
};

const isChild = (idsKey, records) => {
  const childIDs = records.toList()
    .flatMap(r => r.getIn(idsKey))
    .filter(Boolean)
    .toSet();
  return (_, k) => childIDs.includes(k);
};

const extractChildren = (entity, entities, selection, relState) => {
  const visitor = (data, sourceRecords, sourceName, relRecords, relName) => {
    const predicate = isChild([relName.plural], sourceRecords);
    const children = relRecords.filter(predicate);
    data = data.has(relName.plural) ?
      data.mergeIn([relName.plural], children) :
      data.set(relName.plural, children);
    const parents = extractParents(entities[relName.single], entities, children, relState);
    return data.mergeDeep(parents);
  };
  return walk('children', entity, entities, selection, relState, visitor);
};

export const applyFamilySelectors = entities => entity => {
  const expandedSelectors = {};

  for (const { relEntity } of iterEntities('parents', entity, entities)) {
    expandedSelectors[getEntityName(relEntity).plural] = relEntity.selectors.sortedRecords;
  }
  for (const { relEntity } of iterEntities('children', entity, entities)) {
    expandedSelectors[getEntityName(relEntity).plural] = relEntity.selectors.sortedRecords;
    for (const childsParent of iterEntities('parents', relEntity, entities)) {
      if (childsParent.source !== entity) {
        const parentName = getEntityName(childsParent.relEntity).plural;
        expandedSelectors[parentName] = childsParent.relEntity.selectors.sortedRecords;
      }
    }
  }

  entity.selectors.family = createSelector(
    createStructuredSelector(expandedSelectors),
    entity.selectors.sortedRecords,
    (_, selectedIDs) => selectedIDs,
    (relState, records, selectedIDs) => {
      const selection = records.filter((_, k) => selectedIDs.indexOf(k) > -1);
      const parents = extractParents(entity, entities, selection, relState);
      const children = extractChildren(entity, entities, selection, relState);
      return parents
        .mergeDeep(children)
        .set(getEntityName(entity).plural, selection);
    }
  );

  return entity;
};
