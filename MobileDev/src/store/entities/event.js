import { Schema, arrayOf } from 'normalizr';
// import { createSelector } from 'reselect';
// import Immutable from 'immutable';
import FIELDS from '../../../lib/fields/event.json';
import { memoizedUUID } from '../../../lib/store/entity/util/memoizedUUID';
import { fieldMap } from '../../../lib/store/entity/util/fields';
import user from './user';

const schema = new Schema('events', {
  idAttribute: memoizedUUID(),
  meta: {
    entityName: {
      single: 'event',
      plural: 'events',
    },
    parents: [
      ['user', ['user_id']]
    ],
    children: [],
    fieldList: FIELDS,
    fieldListExpanded: FIELDS,
    fieldMap: fieldMap(FIELDS),
  },
});

user.schema.define({
  events: arrayOf(schema),
});

// const validator = () => [];

// const selectors = {};

// selectors.records = (state) => (
//     state.records &&
//     state.records.get(schema.getMeta('entityName').plural)
//   ) || new Immutable.Map();

export default {
  schema,
};
