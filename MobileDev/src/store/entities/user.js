import { Schema, arrayOf } from 'normalizr';
// import { createSelector } from 'reselect';
// import Immutable from 'immutable';
import FIELDS from '../../../lib/fields/user.json';
import { memoizedUUID } from '../../../lib/store/entity/util/memoizedUUID';
import { fieldMap } from '../../../lib/store/entity/util/fields';
import account from './account';

const schema = new Schema('users', {
  idAttribute: memoizedUUID(),
  meta: {
    entityName: {
      single: 'user',
      plural: 'users',
    },
    parents: [
      ['account', ['account_id']]
    ],
    children: [
      ['event', ['user_id']]
    ],
    fieldList: FIELDS,
    fieldListExpanded: FIELDS,
    fieldMap: fieldMap(FIELDS),
  },
});

account.schema.define({
  users: arrayOf(schema),
});

// const validator = () => [];

// const selectors = {};

// selectors.records = (state) => (
//     state.records &&
//     state.records.get(schema.getMeta('entityName').plural)
//   ) || new Immutable.Map();

// selectors.first = createSelector(
//   selectors.records,
//   (rs) => rs.first() || new Immutable.Map()
// );

// selectors.userID = createSelector(
//   selectors.first,
//   (r) => r.get('id')
// );

export default {
  schema,
};
