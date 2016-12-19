import { Schema } from 'normalizr';
import FIELDS from '../../../lib/fields/account.json';
import { memoizedUUID } from '../../../lib/store/entity/util/memoizedUUID';
import { fieldMap } from '../../../lib/store/entity/util/fields';

const schema = new Schema('accounts', {
  idAttribute: memoizedUUID(),
  meta: {
    entityName: {
      single: 'account',
      plural: 'accounts',
    },
    parents: [],
    children: [
      ['user', ['account_id']]
    ],
    fieldList: FIELDS,
    fieldListExpanded: FIELDS,
    fieldMap: fieldMap(FIELDS),
  },
});

export default {
  schema,
};
