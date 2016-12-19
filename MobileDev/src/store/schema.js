import { Schema, arrayOf } from 'normalizr';
import { createStructuredSelector } from 'reselect';
import { prepareTableData } from '../../lib/store/entity/selectors/tableData';
import makeSelectorFactories from '../../lib/store/entity/selectors/factory';
import recordsModule from './records';
import account from './entities/account';
import event from './entities/event';
import user from './entities/user';
import fieldTypes from './types';

export const accountContext = new Schema('accountContext', {
  idAttribute: () => 'ACCOUNT_CONTEXT',
});

accountContext.define({
  accounts: arrayOf(account.schema),
});

const entities = [
  account,
  user,
  event
];

const customPreparedTableData = (record, internalID, entityType, context) => {
  const { tableData, prepared } = prepareTableData(record, internalID, entityType, context);
  return { prepared, tableData };
};

const tableDataContext = createStructuredSelector({
  prepareTableData: () => customPreparedTableData,
});

function applyEntitySelectors(entityList) {
  const entityMap = entities.reduce(
    (m, e) => {
      m[e.schema.getMeta('entityName').single] = e;
      if (!e.selectors) {
        e.selectors = {};
      }
      return m;
    }, {}
  );
  const params = { tableDataContext, fieldTypes, recordsModule };
  const factories = makeSelectorFactories(entityMap, params);
  factories.forEach(f => entityList.forEach(f));
  return entityMap;
}

const entityMap = applyEntitySelectors(entities);

export default entityMap;
