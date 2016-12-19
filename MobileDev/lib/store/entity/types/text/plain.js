const identity = v => v;

export default {
  type: 'text/plain',
  toGroupValue: identity,
  fromGroupValue: identity,
  toTableValue: identity,
  toExportValue: identity,
  fromImportValue: identity,
};
