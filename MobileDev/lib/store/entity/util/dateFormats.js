import moment from 'moment-timezone';
import { put } from 'redux-saga/effects';
import { momentFromTimestamp } from './memoizedMoment';

export function getLocale() {
  return 'en-US';
}

export function getWorkbookDateFormat() {
  const locale = getLocale();
  let { L, LT } = moment.localeData(locale)._longDateFormat;
  L = L
    .toLocaleLowerCase()
    .replace(/(d|m)\1/g, (str, [match]) => match);
  LT = LT
    .toLocaleLowerCase()
    .replace(/(h)\1/g, (str, [match]) => match)
    .replace(/a/ig, 'AM/PM');
  return `${L} ${LT}`;
}

export const LOCALE = getLocale();

export const EXPORT_DATE_FORMAT = getWorkbookDateFormat();

export function toExportValue(value, record, field, { timezone }) {
  if (value) {
    const v = (
      moment.tz(
        momentFromTimestamp(value)
          .tz(timezone)
          .format('YYYY-MM-DDTHH:mm:ss'),
      'UTC').unix() / 86400
    ) + 25569;
    return { v, t: 'n', z: EXPORT_DATE_FORMAT };
  }
  return '';
}

export const IMPORT_DATE_FORMATS = [
  'l',
  'l LT',
  'l LTS',
  'l LTS Z',
  'LTS',
  'h A',
  'M/D/YY HH:mm',
  'M/D/YY H:mm',
  'M/D/YYYY HH:mm',
  'M/D/YYYY H:mm',
  'M/D/YY',
  'M/D/YYYY',
];

export function createFromImportValue(formatter) {
  return function* fromImportValue(
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
        value = v;
        break;
      }
      if (k + 1 === IMPORT_DATE_FORMATS.length) {
        yield put(progress.actions.error(entityName,
        `Row ${i + 1}: Invalid date ${field.label}: ${row.getIn(field.key)}`
        ));
        yield put(actions.cancel());
      }
    }
    const curVal = record.getIn(['current'].concat(field.key));
    return formatter(curVal, value);
  };
}
