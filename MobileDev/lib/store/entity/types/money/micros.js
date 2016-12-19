import { put } from 'redux-saga/effects';

const toGroupValue = v => v ? v / 1e4 : v;

const fromGroupValue = v => v ? v * 1e4 : v;

const toTableValue = (v, record, field) => (
  v || field.isStats ? (v || 0) / 1e4 : ''
);

const toExportValue = (value, record, field, { currencyFormat, currencyOffset }) => {
  if (value) {
    return {
      v: value / currencyOffset,
      t: 'n',
      z: currencyFormat,
    };
  }
};

function* fromImportValue(
  value,
  record,
  field,
  row,
  i,
  { parseCurrencyEx, actions, progress, entityName }
) {
  value = parseFloat(value.replace(parseCurrencyEx, ''), 10);
  if (!isFinite(value)) {
    yield put(progress.actions.error(entityName,
      `Row ${i + 1}: Invalid money value ${field.label}: ${row.getIn(field.key)}`
    ));
    yield put(actions.cancel());
  }
  return value * 1e6;
}

export default {
  type: 'money/micros',
  toGroupValue,
  fromGroupValue,
  toTableValue,
  toExportValue,
  fromImportValue,
};
