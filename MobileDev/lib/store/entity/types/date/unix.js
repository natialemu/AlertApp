import moment from 'moment';
import { toExportValue, createFromImportValue } from '../..//util/dateFormats';

// ignoring timezone for now
const toGroupValue = v => moment(v, 'X').format('MM/DD/YYYY');

const fromGroupValue = v => v;

const toTableValue = toGroupValue;

const fromImportValueFormatter = (curVal, value) => {
  value = value.unix();
  // Ignore changes of less than a minute
  if (curVal && Math.abs(curVal - value) < 60) {
    return curVal;
  }
  return value;
};

const fromImportValue = createFromImportValue(fromImportValueFormatter);

export default {
  toGroupValue,
  fromGroupValue,
  toTableValue,
  toExportValue,
  fromImportValue,
  type: 'date/unix',
};
