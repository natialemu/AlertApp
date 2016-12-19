import { put } from 'redux-saga/effects';

const toGroupValue = v => v;

const fromGroupValue = v => v;

const toTableValue = v => v || 0;

const toExportValue = toTableValue;

function* fromImportValue(
  value,
  record,
  field,
  row,
  i,
  { entityName, progress, actions }
) {
  value = parseInt(value, 10);
  if (!isFinite(value)) {
    yield put(progress.actions.error(entityName,
      `Row ${i + 1}: Invalid integer ${field.label}: ${row.getIn(field.key)}`
    ));
    yield put(actions.cancel());
  }
  return value;
}

export default {
  toGroupValue,
  fromGroupValue,
  toTableValue,
  toExportValue,
  fromImportValue,
  type: 'number/integer',
};
