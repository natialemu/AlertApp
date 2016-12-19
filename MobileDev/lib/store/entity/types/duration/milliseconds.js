import moment from 'moment';

const toGroupValue = v => v;

const fromGroupValue = v => v;

const toTableValue = v => v || 0;

const toExportValue = (value) => {
  if (value) {
    const d = moment.duration(value);
    const parts = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'].map(span => {
      const n = d[span]();
      return [n, n === 1 ? span.replace(/s$/, '') : span];
    }).filter(([n]) => n);
    return parts.map(p => p.join(' ')).join(', ');
  }
  return '';
};

const fromImportValue = v => v;

export default {
  toGroupValue,
  fromGroupValue,
  toTableValue,
  toExportValue,
  fromImportValue,
  type: 'duration/milliseconds',
};
