import moment from 'moment-timezone';
import { put } from 'redux-saga/effects';
import { momentFromString, momentFromTimestamp } from '../../../entity/util/memoizedMoment';
import { LOCALE, EXPORT_DATE_FORMAT, IMPORT_DATE_FORMATS } from '../../../entity/util/dateFormats';

const toGroupValue = v => v ? momentFromString(v).unix() : v;

const fromGroupValue = (value, record, field) => {
  if (!value) {
    return value;
  }
  let groupValue = momentFromTimestamp(value, 'X').toISOString();
  const curVal = record.getIn(field.key);
  // don't update dates if they differ by less than a second
  // assuming you have an ISO `str = "2016-08-22T20:38:15.123Z"`
  // str.slice(0, 19) gives you "2016-08-22T20:38:15"
  if (curVal && groupValue && curVal.slice(0, 19) === groupValue.slice(0, 19)) {
    groupValue = curVal;
  }
  return groupValue;
};

const toTableValue = toGroupValue;

const toExportValue = (value, record, field, { timezone }) => {
  if (value) {
    const v = (
      moment.tz(
        moment(value, 'X')
          .tz(timezone)
          .format('YYYY-MM-DDTHH:mm:ss'),
      'UTC').unix() / 86400
    ) + 25569;
    return { v, t: 'n', z: EXPORT_DATE_FORMAT };
  }
  return '';
};

function* fromImportValue(
  value,
  record,
  field,
  row,
  i,
  { timezone, progress, actions, entityName }
) {
  for (let k = 0; k < IMPORT_DATE_FORMATS.length; k++) {
    const fmt = IMPORT_DATE_FORMATS[k];
    const v = moment.tz(value, fmt, LOCALE, true, timezone);
    if (v.isValid()) {
      value = v.toISOString();
      break;
    }
    if (k + 1 === IMPORT_DATE_FORMATS.length) {
      yield put(progress.actions.error(entityName,
      `Row ${i + 1}: Invalid date ${field.label}: ${row.getIn(field.key)}`
      ));
      yield put(actions.cancel());
    }
  }
  // workbook format loses seconds; `slice(0, 16)` gives everything up to seconds.
  const curVal = record.getIn(field.key);
  if ((curVal || '').slice(0, 16) === value.slice(0, 16)) {
    return curVal;
  }
  return value;
}

export default {
  toGroupValue,
  fromGroupValue,
  toTableValue,
  toExportValue,
  fromImportValue,
  type: 'date/iso8601',
};
