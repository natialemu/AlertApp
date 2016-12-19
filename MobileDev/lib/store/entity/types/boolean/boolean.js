const identity = v => v;

function fromImportValue(v) {
  return v === 'TRUE';
}

export default {
  fromImportValue,
  type: 'boolean',
  toGroupValue: identity,
  fromGroupValue: identity,
  toTableValue: identity,
  toExportValue: identity,
};
