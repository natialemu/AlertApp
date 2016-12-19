import { put } from 'redux-saga/effects';
import enumType from './single';

function* fromImportValue(
  value,
  record,
  field,
  row,
  i,
  { entityName, progress, actions }
) {
  value = value.toUpperCase();
  const options = field.options;
  const [option] = options.filter(({ text }) => text.toUpperCase() === value);
  if (option) {
    value = option.id;
    if (value !== 'ACTIVE' && value !== 'PAUSED' && value !== 'DELETED') {
      value = 'ACTIVE';
    }
  } else {
    yield put(progress.actions.error(entityName,
      `Row ${i + 1}: Invalid ${field.label}: ${row.getIn(field.key)}`
    ));
    yield put(actions.cancel());
  }
  return value;
}

export default Object.assign({}, enumType, {
  fromImportValue,
  type: 'enum/status',
});
