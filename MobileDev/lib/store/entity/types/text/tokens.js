import Immutable from 'immutable';

const toGroupValue = v => v;

const fromGroupValue = v => v;

const toTableValue = v => (v ? v.join(', ') : '');

const toExportValue = toTableValue;

const fromImportValue = v => Immutable
  .fromJS(v.split(',').map(t => t.trim()).filter(Boolean));

export default {
  toGroupValue,
  fromGroupValue,
  toTableValue,
  toExportValue,
  fromImportValue,
  type: 'text/tokens',
};
