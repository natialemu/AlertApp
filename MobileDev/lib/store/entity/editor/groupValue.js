import Immutable from 'immutable';

export const GROUP_CONFLICT = Symbol.for('GROUP_CONFLICT');

export function getGroupValue(fields, records, fieldTypes) {
  const groupValueFields = fields.concat([{
    key: ['_internalID'],
    type: 'text/plain',
  }]);

  return records.reduce((group, record, k) => {
    let newGroup = group;
    record = record.setIn(['_internalID'], k);
    for (let i = groupValueFields.length - 1; i >= 0; i--) {
      const field = groupValueFields[i];
      const { key, type } = field;
      const fieldType = fieldTypes[type];
      if (!fieldType) {
        throw new Error(`No group value accessor found for field type ${type}`);
      }
      const { toGroupValue } = fieldType;
      const groupValue = group.getIn(key);
      if (groupValue !== GROUP_CONFLICT) {
        let recordValue = record.getIn(key, GROUP_CONFLICT);
        if (recordValue && recordValue !== GROUP_CONFLICT) {
          recordValue = toGroupValue(recordValue, record, field);
        }
        if (groupValue === undefined && recordValue !== undefined) {
          newGroup = newGroup.setIn(key, recordValue);
        } else if (!Immutable.is(groupValue, recordValue)) {
          newGroup = newGroup.setIn(key, GROUP_CONFLICT);
        }
      }
    }
    return newGroup;
  }, new Immutable.Map());
}

export function applyGroupValue(fields, group, records, fieldTypes) {
  return records.map((record) => {
    let current = record;
    for (let i = fields.length - 1; i >= 0; i--) {
      const field = fields[i];
      const { key, type, readonly } = field;
      if (!readonly) {
        const { fromGroupValue } = fieldTypes[type];
        let groupValue = group.getIn(key);
        if (groupValue !== GROUP_CONFLICT) {
          groupValue = fromGroupValue(groupValue, record, field);
        }
        if (groupValue !== GROUP_CONFLICT) {
          if (groupValue === undefined) {
            current = current.deleteIn(key);
          } else {
            current = current.setIn(key, groupValue);
          }
        }
      }
    }
    return record.set(current);
  });
}
