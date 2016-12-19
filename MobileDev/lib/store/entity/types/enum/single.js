import { put } from 'redux-saga/effects';

const toGroupValue = v => v;

const fromGroupValue = v => v;

const toTableValue = (value, record, field) => {
  const options = field.options;
  if (options) {
    const opt = options.filter(({ id }) => id === value)[0];
    if (opt) {
      value = opt.text;
    }
  }
  if (!value) {
    value = '';
  }
  return value;
};

const toExportValue = toTableValue;

function* fromImportValue(
  value,
  record,
  field,
  row,
  i,
  { entityName, progress, actions }
) {
  value = value.toUpperCase();
  const [option] = field.options.filter(({ text }) => text.toUpperCase() === value);
  if (option) {
    value = option.id;
  } else {
    yield put(progress.actions.error(entityName,
      `Row ${i + 1}: Invalid ${field.label}: ${row.getIn(field.key)}`
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
  type: 'enum/single',
};
