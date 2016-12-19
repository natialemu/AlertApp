import Immutable from 'immutable';
import { createImmutableSelector } from '../../util';

export function prepareTableData(record, internalID, entityType, context) {
  const { stats } = context || {};
  const entityStats = stats && stats.get(entityType);

  const tableData = new Immutable.Map()
    .set('_internalID', internalID)
    .set('errors', record.get('errors'))
    .set('state', record.get('state'));

  let prepared = record;
  if (entityStats) {
    prepared = record.set('stats', entityStats
      .get(record.get('id'), new Immutable.Map()));
  }
  return { tableData, prepared };
}

export function getTableData(entityType, fields, records, fieldTypes, context, entity, entities) {
  const preparer = context.prepareTableData || prepareTableData;
  return records.map((record, k) => {
    const { tableData, prepared } = preparer(record, k, entityType, context);

    return fields.reduce((data, field) => {
      let value = prepared.getIn(field.key);
      const { toTableValue } = fieldTypes[field.type];
      value = toTableValue(value, prepared, field, context, entity, entities);
      return data.setIn(field.key, value);
    }, tableData);
  });
}

export const applyTableDataSelectors = (entities, fieldTypes, tableDataContext) => entity => {
  const entityName = entity.schema.getMeta('entityName');
  const fields = entity.schema.getMeta('fieldListExpanded');
  const selectors = entity.selectors;

  function getValidationErrors() {
    return (this.errors || [])
      .map(({ message }) => ({ errorMessage: message }));
  }

  function getKey() {
    return this._internalID;
  }

  selectors.tableData = createImmutableSelector(
    selectors.expanded,
    tableDataContext,
    (records, context) => getTableData(
      entityName.plural,
      fields,
      records,
      fieldTypes,
      context,
      entity,
      entities)
  );

  selectors.tableDataJS = selectors.tableDataJS = createImmutableSelector(
    selectors.tableData,
    (data) => data.toList().toJS()
  );

  selectors.editor.summary = createImmutableSelector(
    selectors.editor.expanded,
    tableDataContext,
    (records, context) => getTableData(
      entityName.plural,
      fields,
      records,
      fieldTypes,
      context,
      entity,
      entities)
      .toList()
      .toJS()
      .map(r => Object.assign({ getKey, getValidationErrors }, r))
  );

  return entity;
};
